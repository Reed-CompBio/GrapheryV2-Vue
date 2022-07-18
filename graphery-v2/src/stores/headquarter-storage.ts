import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { useStorageBus } from 'components/mixins/controller/storage-bus';
import { CHANGABLE_PROPERTIES } from 'src/types/execution-types';

import type {
    HeadquarterStorageType,
    StepInfoType,
} from 'stores/headquarter-storage-types';
import type {
    CodeType,
    ExecutionResultType,
    GraphAnchorType,
} from 'src/types/api-types';
import { ResponseInfoType } from 'src/types/execution-comm-type';

import initEvents from './headquarter-events';

// event bus
const eventBus = useStorageBus();

export const useHeadquarterStorage = defineStore('headquarter', () => {
    // type definition see below
    // https://github.com/vuejs/pinia/blob/bfe1707bc2a466c5c47df33fac75baea50775f3a/packages/pinia/src/types.ts#L561

    // storage
    const storage = reactive<HeadquarterStorageType>({
        currentGraphAnchorId: null,
        currentCodeId: null,
        tutorialContent: null,
        graphContent: null,
        state: {
            loadingTutorial: null,
            loadingGraph: null,
            loadingCode: null,
        },
    });

    const stepInfo = reactive<StepInfoType>({
        currentStep: 0,
        breakpoints: new Set<number>(),
        stepRecord: {},
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
                return (
                    (graphAnchors.value
                        .map((val) => val.graph?.graphAnchor.executionResult)
                        .filter((val) =>
                            Boolean(val)
                        ) as ExecutionResultType[]) || null
                );
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

    const currentExecutionResultInfo = computed(() => {
        if (currentExecutionResult.value)
            return JSON.parse(
                currentExecutionResult.value?.resultJson
            ) as ResponseInfoType;
        else return null;
    });

    // I regret using Json instead of JSON, but ....
    const currentRecordArray = computed(() => {
        return currentExecutionResultInfo.value?.result ?? null;
    });

    const currentRecordArrayMaxLength = computed(() => {
        return (currentRecordArray.value?.length ?? 0) - 1;
    });

    const currentStep = computed(() => stepInfo.currentStep);

    const currentStepRecord = computed(() => {
        // TODO: need a better way to keep track of changes

        const properties = new Set(CHANGABLE_PROPERTIES);
        let step = stepInfo.currentStep;

        if (currentRecordArray.value === null) return;

        while (properties.size !== 0 && step >= 0) {
            const record = currentRecordArray.value[step];
            for (const property of properties) {
                if (record[property]) {
                    stepInfo.stepRecord[property] = record[property] as any;
                    properties.delete(property);
                }
            }
            step -= 1;
        }

        return stepInfo.stepRecord;
    });

    const currentLine = computed(
        () => currentRecordArray.value?.[currentStep.value].line ?? -1
    );
    const currentTutorialContent = computed(() => storage.tutorialContent);

    const isLoadingTutorialContent = computed(
        () => storage.state.loadingTutorial
    );

    const isLoadingGraph = computed(() => storage.state.loadingGraph);

    const isLoadingCode = computed(() => storage.state.loadingCode);

    // actions

    function changeContentState(
        type: 'code' | 'graph' | 'tutorial',
        state: boolean | null
    ) {
        switch (type) {
            case 'code': {
                storage.state.loadingCode = state;
                break;
            }
            case 'graph': {
                storage.state.loadingGraph = state;
                break;
            }
            case 'tutorial': {
                storage.state.loadingTutorial = state;
                break;
            }
        }
    }

    watch(currentRecordArray, () => {
        eventBus.emit('reset-states');
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
        currentExecutionResultInfo,
        currentRecordArray,
        currentRecordArrayMaxLength,
        currentStep,
        currentStepRecord,
        currentLine,
        currentTutorialContent,
        isLoadingTutorialContent,
        isLoadingGraph,
        isLoadingCode,
        // actions
        changeContentState,
    };
});

initEvents(useHeadquarterStorage());
