import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { apolloClient } from 'src/utils/graphql-client';
import { gql } from 'graphql-tag';

import type {
    HeadquarterStorageType,
    StepInfoType,
} from 'stores/headquarter-storage-types';
import type {
    ExecutionResultType,
    GraphAnchorType,
    GraphType,
    TutorialType,
} from 'src/types/tutorial-types';

export const useHeadquarterStorage = defineStore('headquarter', () => {
    // type definition see below
    // https://github.com/vuejs/pinia/blob/bfe1707bc2a466c5c47df33fac75baea50775f3a/packages/pinia/src/types.ts#L561

    // storage
    const storage = reactive<HeadquarterStorageType>({
        currentGraphId: null,
        currentCodeId: null,
        tutorialContent: null,
        graphContent: null,
    });

    const stepInfo = reactive<StepInfoType>({
        currentStep: 0,
        breakpoints: [],
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
            return [storage.tutorialContent.tutorialAnchor.code];
        } else if (storage.graphContent) {
            return storage.graphContent.graphAnchor.tutorialAnchors.map(
                (item) => item.tutorialAnchor.code
            );
        }
        return [];
    });

    const executionResultCollection = computed<ExecutionResultType[] | null>(
        () => {
            if (storage.tutorialContent) {
                return currentCode.value?.executionResults || null;
            } else if (storage.graphContent) {
                return currentGraphAnchor.value?.executionResults || null;
            } else {
                return null;
            }
        }
    );

    const currentGraphAnchor = computed(() => {
        const filterRes = graphAnchors.value.filter(
            (item) => item.id === storage.currentGraphId
        );
        return filterRes.length === 0 ? null : filterRes[0];
    });

    const currentCode = computed(() => {
        const filterRes = codes.value.filter(
            (item) => item && item.id === storage.currentCodeId
        );
        return filterRes.length === 0 ? null : filterRes[0];
    });

    const currentExecutionResult = computed(() => {
        return executionResultCollection.value?.find(
            (item) =>
                item.graphAnchor.id === currentGraphAnchor.value?.id &&
                item.code.id === currentCode.value?.id
        );
    });

    const currentStep = computed(() => stepInfo.currentStep);

    const nextBreakpoint = computed(() => {
        return (currentLine: number) => {
            for (const num of stepInfo.breakpoints) {
                if (num > currentLine) {
                    return num;
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

        if (queryResult.data && !queryResult.errors) {
            storage.tutorialContent = queryResult.data.tutorialContent;
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

        if (result.data && !result.errors) {
            // TODO fill in the lazy load result here
        }
    }

    return {
        // states
        storage,
        stepInfo,
        // getters
        graphAnchors,
        codes,
        executionResultCollection,
        currentGraphAnchor,
        currentCode,
        currentExecutionResult,
        currentStep,
        nextBreakpoint,
        loadTutorialContent,
        loadGraphJsonAndExecutionResult,
    };
});
