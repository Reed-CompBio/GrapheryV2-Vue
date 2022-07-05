<template>
    <div class="var-display-wrapper">
        <div
            class="var-display-variable"
            v-for="(variable, index) in variables"
            :key="index"
        >
            <VariableCard :info="variable" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useHeadquarterStorage } from 'stores/headquarter-storage';
import { storeToRefs } from 'pinia';
import { VariableInfoWrapper } from 'components/mixins/variable-base';
import VariableCard from 'components/workspace/code-area/variable-area/VariableCard.vue';

export default defineComponent({
    components: { VariableCard },
    setup() {
        const storage = useHeadquarterStorage();
        // const refresh = storage.refreshStepRecord;
        const { currentStepRecord } = storeToRefs(storage);
        const variables = computed<VariableInfoWrapper[]>(() => {
            return [
                ...Object.entries(currentStepRecord.value?.variables ?? {}).map(
                    ([key, value]) => {
                        return new VariableInfoWrapper(value, key);
                    }
                ),
                ...(currentStepRecord.value?.accesses ?? []).map((access) => {
                    return new VariableInfoWrapper(access, 'accessed variable');
                }),
            ];
        });
        return { variables };
    },
});
</script>
