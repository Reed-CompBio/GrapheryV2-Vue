import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { HeadquarterStorageType } from 'stores/headquarter-storage-types';
import { ExecutionResult } from 'src/types/tutorial-types';

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

    const stepInfo = reactive({});

    // getters
    const graphAnchors = computed(() => {
        if (storage.tutorialContent) {
            return storage.tutorialContent.tutorialAnchor.graphAnchors;
        } else if (storage.graphContent) {
            return [storage.graphContent];
        } else {
            console.error('Cannot Load Graphs');
        }
        return [];
    });

    const codes = computed(() => {
        if (storage.tutorialContent) {
            return [storage.tutorialContent.tutorialAnchor.code];
        } else if (storage.graphContent) {
            return storage.graphContent.tutorialAnchors.map(
                (item) => item.code
            );
        }
        return [];
    });

    const executionResultCollection = computed<ExecutionResult[] | null>(() => {
        if (storage.tutorialContent) {
            return currentCode.value?.executionResults || null;
        } else if (storage.graphContent) {
            return currentGraphAnchor.value?.executionResults || null;
        } else {
            return null;
        }
    });

    const currentGraphAnchor = computed(() => {
        const filterRes = graphAnchors.value.filter(
            (item) => item.id === storage.currentGraphId
        );
        return filterRes.length === 0 ? null : filterRes[0];
    });

    const currentCode = computed(() => {
        const filterRes = codes.value.filter(
            (item) => item.id === storage.currentCodeId
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

    // actions

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
    };
});
