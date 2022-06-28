import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { apolloClient } from 'src/utils/graphql-client';
import { gql } from 'graphql-tag';
import { useBus } from 'components/mixins/controller/headquarter-bus';
import { LangCode } from 'src/types/api-types';
import { CHANGABLE_PROPERTIES } from 'src/types/execution-types';

import type {
    HeadquarterStorageType,
    StepInfoType,
} from 'stores/headquarter-storage-types';
import type {
    CodeType,
    ExecutionResultType,
    GraphAnchorType,
    GraphType,
    TutorialType,
} from 'src/types/api-types';
import type { RecordArrayType, RecordType } from 'src/types/execution-types';

export const useHeadquarterStorage = defineStore('headquarter', () => {
    // type definition see below
    // https://github.com/vuejs/pinia/blob/bfe1707bc2a466c5c47df33fac75baea50775f3a/packages/pinia/src/types.ts#L561

    // storage
    const storage = reactive<HeadquarterStorageType>({
        currentGraphAnchorId: null,
        currentCodeId: null,
        tutorialContent: null,
        graphContent: null,
    });

    const stepInfo = reactive<StepInfoType>({
        currentStep: 0,
        breakpoints: new Set<number>(),
        stepRecord: undefined,
    });

    // getters
    const graphAnchors = computed<GraphAnchorType[]>(() => {
        if (storage.tutorialContent) {
            return storage.tutorialContent.tutorialAnchor.graphAnchors;
        } else if (storage.graphContent) {
            return [storage.graphContent.graphAnchor];
        } else {
            console.error('Cannot Load Graphs');
        }
        return [];
    });

    const codes = computed(() => {
        if (storage.tutorialContent) {
            return storage.tutorialContent.tutorialAnchor.code
                ? [storage.tutorialContent.tutorialAnchor.code]
                : [];
        } else if (storage.graphContent) {
            return storage.graphContent.graphAnchor.tutorialAnchors.map(
                (item) => item.tutorialAnchor.code as CodeType
            );
        }
        return [];
    });

    const executionResultCollection = computed<ExecutionResultType[] | null>(
        () => {
            if (storage.tutorialContent) {
                return currentGraphAnchor.value?.executionResults || null;
            } else if (storage.graphContent) {
                return currentCode.value?.executionResults || null;
            } else {
                return null;
            }
        }
    );

    const currentGraphAnchor = computed(() => {
        const findRes = graphAnchors.value.find(
            (item) => item.id === storage.currentGraphAnchorId
        );
        return findRes || null;
    });

    const currentGraph = computed(() => {
        return currentGraphAnchor.value?.graph || null;
    });

    const currentCode = computed(() => {
        const findRes = codes.value.find(
            (item) => item && item.id === storage.currentCodeId
        );
        return findRes || null;
    });

    const currentExecutionResult = computed(() => {
        return (
            executionResultCollection.value?.find(
                (item) =>
                    item.graphAnchor.id === currentGraphAnchor.value?.id &&
                    item.code.id === currentCode.value?.id
            ) || null
        );
    });

    // I regret using Json instead of JSON, but ....
    const currentRecordArray = computed(() => {
        if (currentExecutionResult.value?.resultJson)
            return JSON.parse(
                currentExecutionResult.value?.resultJson
            ) as RecordArrayType;
        else return null;
    });

    const currentStep = computed(() => stepInfo.currentStep);
    const refreshStepRecord = () => {
        // TODO: need a better way to keep track of changes

        const properties = new Set(CHANGABLE_PROPERTIES);
        let step = stepInfo.currentStep;

        if (
            currentRecordArray.value === null ||
            stepInfo.stepRecord === undefined
        )
            return;

        while (properties.size !== 0 && step >= 0) {
            const record = currentRecordArray.value[step];
            for (const property of properties) {
                if (record[property] !== undefined) {
                    stepInfo.stepRecord[property] = record[property] as any;
                    properties.delete(property);
                }
            }
            step -= 1;
        }

        return stepInfo.stepRecord;
    };
    const currentStepRecord = computed(() => {
        return refreshStepRecord();
    });

    const getNextBreakpoint = computed(() => {
        // TODO, this is going to be a problem if you have stacks

        return () => {
            if (currentRecordArray.value) {
                for (
                    let i = stepInfo.currentStep + 1;
                    i < currentRecordArray.value.length;
                    i++
                ) {
                    const record: RecordType = currentRecordArray.value[i];
                    if (stepInfo.breakpoints.has(record.line)) {
                        return i;
                    }
                }
            }
            return null;
        };
    });
    const getPrevBreakpoint = computed(() => {
        return () => {
            if (currentRecordArray.value) {
                for (let i = stepInfo.currentStep - 1; i >= 0; i--) {
                    const record: RecordType = currentRecordArray.value[i];
                    if (stepInfo.breakpoints.has(record.line)) {
                        return i;
                    }
                }
            }

            return null;
        };
    });

    // actions
    async function loadTutorialContent(url: string, lang: string) {
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

        if (queryResult.data && !queryResult.errors && !queryResult.error) {
            return queryResult.data.tutorialContent;
        } else {
            console.error(queryResult.error);
            console.error(queryResult.errors);
            return null;
        }
    }

    async function loadGraphJsonAndExecutionResult(
        anchorId: string,
        codeId: string
    ) {
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

        if (result.data && !result.errors && !result.error) {
            return result.data.graph;
        } else {
            console.error(result.error);
            console.error(result.errors);
            return null;
        }
    }

    async function loadCode(codeId: string, graphAnchorId: string) {
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

        if (result.data && !result.errors && !result.error) {
            return result.data.code;
        } else {
            console.error(result.error);
            console.error(result.errors);
            return null;
        }
    }

    function initStepRecord() {
        stepInfo.currentStep = 0;

        if (currentRecordArray.value) {
            stepInfo.stepRecord = {
                ...currentRecordArray.value[0],
            };
        } else {
            stepInfo.stepRecord = undefined;
        }
    }

    watch(currentRecordArray, () => {
        eventBus.emit('reset-state');
    });

    // event bus
    const eventBus = useBus();

    // event bus actions
    eventBus.on('step-changed-to', (step: number | null) => {
        // change current step
        if (step) {
            stepInfo.currentStep = step;
        }
    });
    eventBus.on('next-step', () => {
        stepInfo.currentStep += 1;
    });
    eventBus.on('previous-step', () => {
        if (stepInfo.currentStep > 0) {
            stepInfo.currentStep -= 1;
        }
    });
    eventBus.on('jump-forward', () => {
        const nextBreakpoint = getNextBreakpoint.value();
        eventBus.emit('step-changed-to', nextBreakpoint);
    });
    eventBus.on('jump-backward', () => {
        const prevBreakpoint = getPrevBreakpoint.value();
        eventBus.emit('step-changed-to', prevBreakpoint);
    });
    eventBus.on('add-breakpoint', (line: number) => {
        stepInfo.breakpoints.add(line);
    });
    eventBus.on('remove-breakpoint', (line: number) => {
        stepInfo.breakpoints.delete(line);
    });
    // TODO: consider moving this to other places
    eventBus.on(
        'fetch-graph',
        ({ graphAnchorId = undefined, codeAnchorId = undefined }) => {
            graphAnchorId = graphAnchorId || currentGraphAnchor.value?.id;
            codeAnchorId = codeAnchorId || currentCode.value?.id;

            const graphAnchor = graphAnchors.value.find(
                (item) => item.id === graphAnchorId
            );

            // if the content is already fetched, we do nothing
            if (graphAnchor?.graph) {
                eventBus.emit('load-graph-anchor', graphAnchorId as string);
                return;
            }

            if (codeAnchorId && graphAnchorId && graphAnchor) {
                loadGraphJsonAndExecutionResult(
                    graphAnchorId,
                    codeAnchorId
                ).then((graph) => {
                    if (graph) {
                        graphAnchor.graph = graph;
                        eventBus.emit(
                            'load-graph-anchor',
                            graphAnchorId as string
                        );
                    } else {
                        console.debug(
                            'the graph information is empty and might not be the intended behavior'
                        );
                    }
                });
            } else {
                console.error(
                    'cannot load graph information due to invalid input of graph anchor id and code anchor id'
                );
            }
        }
    );
    eventBus.on('fetch-tutorial', ({ url, lang = LangCode.EN }) => {
        loadTutorialContent(url, lang).then((tutorial) => {
            if (tutorial) {
                storage.tutorialContent = tutorial;
            } else {
                console.debug(
                    'tutorial is null and might not be the intended behavior'
                );
            }
        });
    });
    eventBus.on('fetch-code', ({ codeId, graphAnchorId }) => {
        codeId = codeId || currentCode.value?.id;
        graphAnchorId = graphAnchorId || currentGraphAnchor.value?.id;

        const codeRecord = codes.value.find((item) => item.id === codeId);

        // similar to fetching graph, we do nothing if the content is already fetched
        if (codeRecord?.code && codeRecord?.executionResults) {
            eventBus.emit('load-code', codeId as string);
            return;
        }

        if (codeRecord && codeId && graphAnchorId) {
            loadCode(codeId, graphAnchorId).then((code) => {
                if (code) {
                    codeRecord.code = code.code;
                    codeRecord.executionResults = code.executionResults;
                    eventBus.emit('load-code', codeId as string);
                } else {
                    console.debug(
                        'the code information is empty and might not be the intended behavior'
                    );
                }
            });
        } else {
            console.error(
                'cannot load code due to invalid input of either code id or graph anchor id'
            );
        }
    });
    eventBus.on('reset-states', () => {
        // reset steps
        initStepRecord();
        // reset breakpoints
        for (const line of stepInfo.breakpoints) {
            eventBus.emit('remove-breakpoint', line);
        }
        // TODO variable area should be reset
        stepInfo.stepRecord = undefined;
    });
    eventBus.on('load-graph-anchor', (anchorId: string) => {
        storage.currentGraphAnchorId = anchorId;
    });
    eventBus.on('load-code', (codeId: string) => {
        storage.currentCodeId = codeId;
    });

    return {
        // states
        storage,
        stepInfo,
        // getters
        graphAnchors,
        codes,
        executionResultCollection,
        currentGraphAnchor,
        currentGraph,
        currentCode,
        currentExecutionResult,
        currentRecordArray,
        currentStep,
        currentStepRecord,
        nextBreakpoint: getNextBreakpoint,
        // actions
        loadTutorialContent,
        loadGraphJsonAndExecutionResult,
    };
});
