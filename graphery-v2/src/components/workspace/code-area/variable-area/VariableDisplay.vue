<template>
    <div class="var-display-wrapper">
        <div
            v-for="(variable, index) in variables"
            :key="index"
            class="var-display-variable"
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
                ...(currentStepRecord.value?.accesses ?? []).map((access) => {
                    return new VariableInfoWrapper(access, 'returned variable');
                }),
                ...Object.entries(currentStepRecord.value?.variables ?? {}).map(
                    ([key, value]) => {
                        return new VariableInfoWrapper(value, key);
                    }
                ),
            ];
        });
        return { variables };
    },
});
</script>

<style lang="sass">
.var-display-wrapper
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: auto
    grid-gap: 20px
    padding: 20px 5px
</style>
