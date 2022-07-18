import { useHeadquarterBus } from 'components/mixins/controller/headquarter-bus';
import { apolloClient } from 'src/utils/graphql-client';
import { LangCode } from 'src/types/api-types';
import gql from 'graphql-tag';
import { useStorageBus } from 'components/mixins/controller/storage-bus';
import type { useHeadquarterStorage } from './headquarter-storage';
import type { CodeType, GraphType, TutorialType } from 'src/types/api-types';
import type { RecordType } from 'src/types/execution-types';

const headquarterBus = useHeadquarterBus();
const eventBus = useStorageBus();

export default function InitStorageEvent(
    storage: ReturnType<typeof useHeadquarterStorage>
) {
    headquarterBus.on('next-step', () => {
        headquarterBus.emit('step-changed-to', storage.currentStep + 1);
    });
    headquarterBus.on('previous-step', () => {
        headquarterBus.emit('step-changed-to', storage.currentStep - 1);
    });

    function initStepRecord() {
        storage.stepInfo.stepRecord = {};
        headquarterBus.emit('step-changed-to', 0);
    }

    async function loadTutorialContent(url: string, lang: string) {
        console.debug('run loading tutorial on url', url, lang);
        storage.changeContentState('tutorial', true);

        const queryResult = await apolloClient.query<{
            tutorialContent: TutorialType;
        }>({
            query: gql`
                query LoadTutorialContent($url: String!, $lang: LangCode!) {
                    tutorialContent(url: $url, lang: $lang) {
                        id
                        title
                        authors {
                            displayedName
                        }
                        abstract
                        contentMarkdown
                        modifiedTime
                        itemStatus
                        tutorialAnchor {
                            rank
                            itemStatus
                            graphAnchors {
                                id
                                url
                                itemStatus
                                # use lazy load
                                #                                graph {
                                #                                    graphJson
                                #                                }
                                graphDescription(lang: $lang) {
                                    id
                                    title
                                    authors {
                                        displayedName
                                    }
                                    modifiedTime
                                    itemStatus
                                    descriptionMarkdown
                                }
                            }
                            code {
                                id
                                code
                                # use lazy load
                                #                                executionResults {
                                #                                    graphAnchor {
                                #                                        id
                                #                                    }
                                #                                    resultJson
                                #                                    resultJsonMeta
                                #                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                url,
                lang,
            },
        });

        let result;

        if (queryResult.data && !queryResult.errors && !queryResult.error) {
            console.debug(
                `run loading tutorial on ${url} successfully, the result is `,
                queryResult.data
            );
            result = JSON.parse(
                JSON.stringify(queryResult.data.tutorialContent)
            );
        } else {
            console.error('cannot load tutorial since');
            console.error(queryResult.error);
            console.error(queryResult.errors);
            result = null;
        }

        return result;
    }

    async function loadGraphJsonAndExecutionResult(
        anchorId: string,
        codeId: string
    ) {
        console.debug('start fetching graph', anchorId, codeId);
        storage.changeContentState('graph', true);

        // TODO figure out loading execution result with a specific code id
        const result = await apolloClient.query<{ graph: GraphType }>({
            query: gql`
                query ($anchorId: UUID!, $codeId: UUID!) {
                    graph(anchorId: $anchorId) {
                        graphJson
                        graphAnchor {
                            executionResult(codeId: $codeId) {
                                graphAnchor {
                                    id
                                }
                                code {
                                    id
                                }
                                resultJson
                                resultJsonMeta
                            }
                        }
                    }
                }
            `,
            variables: {
                anchorId,
                codeId,
            },
        });

        let res;
        if (result.data && !result.errors && !result.error) {
            res = JSON.parse(JSON.stringify(result.data.graph));
            console.debug('fetched graph', res);
        } else {
            console.error(result.error);
            console.error(result.errors);
            res = null;
        }

        return res;
    }

    async function loadCode(codeId: string, graphAnchorId: string) {
        console.debug('start fetching code', codeId, graphAnchorId);
        storage.changeContentState('code', true);

        const result = await apolloClient.query<{ code: CodeType }>({
            query: gql`
                query ($codeId: UUID!, $graphAnchorId: UUID!) {
                    code(codeId: $codeId) {
                        code
                        executionResult(graphAnchorId: $graphAnchorId) {
                            graphAnchor {
                                id
                            }
                            code {
                                id
                            }
                            resultJson
                            resultJsonMeta
                        }
                    }
                }
            `,
            variables: {
                codeId,
                graphAnchorId,
            },
        });

        let res;
        if (result.data && !result.errors && !result.error) {
            res = JSON.parse(JSON.stringify(result.data.code));
            console.debug('fetched code', res);
        } else {
            console.error(result.error);
            console.error(result.errors);
            res = null;
        }
        return res;
    }

    eventBus.on(
        'fetch-graph',
        ({ graphAnchorId = undefined, codeAnchorId = undefined, state }) => {
            graphAnchorId = graphAnchorId || storage.currentGraphAnchor?.id;
            codeAnchorId = codeAnchorId || storage.currentCode?.id;

            const graphAnchor = storage.graphAnchors.find(
                (item) => item.id === graphAnchorId
            );

            // if the content is already fetched, we do nothing
            if (graphAnchor?.graph) {
                eventBus.emit('fetched-graph', {
                    anchorId: graphAnchorId,
                    state: {
                        fetchSuccess: true,
                        ...state,
                    },
                });
                return;
            }

            if (codeAnchorId && graphAnchorId && graphAnchor) {
                loadGraphJsonAndExecutionResult(
                    graphAnchorId,
                    codeAnchorId
                ).then((graph) => {
                    if (graph) {
                        graphAnchor.graph = graph;
                    } else {
                        console.debug(
                            'the graph information is empty and might not be the intended behavior'
                        );
                    }

                    eventBus.emit('fetched-graph', {
                        anchorId: graphAnchorId,
                        state: {
                            fetchSuccess: Boolean(graph),
                            ...state,
                        },
                    });
                });
            } else {
                console.error(
                    'cannot load graph information due to invalid input of graph anchor id and code anchor id',
                    graphAnchorId,
                    codeAnchorId
                );
                eventBus.emit('fetched-graph', {
                    anchorId: undefined,
                    state: {
                        fetchSuccess: false,
                        ...state,
                    },
                });
            }
        }
    );

    function getNextBreakpoint() {
        if (storage.currentRecordArray) {
            for (
                let i = storage.stepInfo.currentStep + 1;
                i < storage.currentRecordArray.length;
                i++
            ) {
                const record: RecordType = storage.currentRecordArray[i];
                if (storage.stepInfo.breakpoints.has(record.line)) {
                    return i;
                }
            }
        }
        return null;
    }

    function getPrevBreakpoint() {
        if (storage.currentRecordArray) {
            for (let i = storage.stepInfo.currentStep - 1; i >= 0; i--) {
                const record: RecordType = storage.currentRecordArray[i];
                if (storage.stepInfo.breakpoints.has(record.line)) {
                    return i;
                }
            }
        }

        return null;
    }

    eventBus.on('fetched-graph', ({ anchorId, state }) => {
        console.debug('fetched graph', anchorId);
        if (state.fetchSuccess && anchorId) {
            storage.changeContentState('graph', false);
            if (state.fetchSuccessCall) state.fetchSuccessCall();
            eventBus.emit('load-graph-anchor', anchorId);
        } else {
            storage.changeContentState('graph', null);
            if (state.fetchFailedCall) state.fetchFailedCall();
        }
    });

    eventBus.on('fetch-tutorial', ({ url, lang = LangCode.EN, state }) => {
        loadTutorialContent(url, lang).then((tutorial) => {
            if (tutorial) {
                storage.storage.tutorialContent = tutorial;
                console.debug(
                    'stored tutorial loading result',
                    storage.storage.tutorialContent
                );
            } else {
                console.debug(
                    'tutorial is null and might not be the intended behavior'
                );
            }

            eventBus.emit('fetched-tutorial', {
                anchorId: tutorial?.tutorialAnchor.id,
                state: {
                    fetchSuccess: Boolean(tutorial),
                    ...state,
                },
            });
        });
    });

    eventBus.on('fetched-tutorial', ({ state }) => {
        if (state.fetchSuccess) {
            if (state.fetchSuccessCall) state.fetchSuccessCall();
            storage.changeContentState('tutorial', false);
            eventBus.emit('load-code', storage.codes[0].id);
        } else {
            if (state.fetchFailedCall) state.fetchFailedCall();
            storage.changeContentState('tutorial', null);
        }
    });

    eventBus.on('fetch-code', ({ codeId, graphAnchorId, state }) => {
        storage.changeContentState('code', true);

        codeId = codeId || storage.currentCode?.id;
        graphAnchorId = graphAnchorId || storage.currentGraphAnchor?.id;

        const codeRecord = storage.codes.find((item) => item.id === codeId);

        // similar to fetching graph, we do nothing if the content is already fetched
        if (codeRecord?.code && codeRecord?.executionResults) {
            eventBus.emit('fetched-code', {
                codeId: codeRecord.id,
                state: {
                    fetchSuccess: true,
                    ...state,
                },
            });
            return;
        }

        if (codeRecord && codeId && graphAnchorId) {
            loadCode(codeId, graphAnchorId).then((code) => {
                if (code) {
                    codeRecord.code = code.code;
                    codeRecord.executionResults = code.executionResults;
                } else {
                    console.debug(
                        'the code information is empty and might not be the intended behavior'
                    );
                }
                eventBus.emit('fetched-code', {
                    codeId: code?.id,
                    state: {
                        fetchSuccess: Boolean(code),
                        ...state,
                    },
                });
            });
        } else {
            console.error(
                'cannot load code due to invalid input of either code id or graph anchor id'
            );
            eventBus.emit('fetched-code', {
                codeId: undefined,
                state: {
                    fetchSuccess: false,
                    ...state,
                },
            });
        }
    });

    eventBus.on('fetched-code', ({ codeId, state }) => {
        if (state.fetchSuccess && codeId) {
            if (state.fetchSuccessCall) state.fetchSuccessCall();
            storage.changeContentState('code', false);
            eventBus.emit('load-code', codeId);
        } else {
            if (state.fetchFailedCall) state.fetchFailedCall();
            storage.changeContentState('code', null);
        }
    });

    eventBus.on('reset-states', () => {
        // reset steps
        initStepRecord();
        // reset breakpoints
        for (const line of storage.stepInfo.breakpoints) {
            eventBus.emit('remove-breakpoint', line);
        }
    });

    eventBus.on('load-graph-anchor', (anchorId: string) => {
        storage.storage.currentGraphAnchorId = anchorId;
    });

    eventBus.on('load-code', (codeId: string) => {
        storage.storage.currentCodeId = codeId;
    });

    // event bus actions
    headquarterBus.on('jump-forward', () => {
        const nextBreakpoint = getNextBreakpoint();
        headquarterBus.emit('step-changed-to', nextBreakpoint);
    });
    headquarterBus.on('jump-backward', () => {
        const prevBreakpoint = getPrevBreakpoint();
        headquarterBus.emit('step-changed-to', prevBreakpoint);
    });

    headquarterBus.on('step-changed-to', (step: number | null) => {
        // change current step
        if (
            step !== null &&
            step >= 0 &&
            step <= storage.currentRecordArrayMaxLength
        ) {
            storage.stepInfo.currentStep = step;
        }
    });
    headquarterBus.on('add-breakpoint', (line: number) => {
        storage.stepInfo.breakpoints.add(line);
    });
    headquarterBus.on('remove-breakpoint', (line: number) => {
        storage.stepInfo.breakpoints.delete(line);
    });
}
