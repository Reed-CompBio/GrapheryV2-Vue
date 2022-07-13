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
import { computed, defineComponent, reactive, watch } from 'vue';
import { useHeadquarterStorage } from 'stores/headquarter-storage';
import { storeToRefs } from 'pinia';
import { VariableInfoWrapper } from 'components/mixins/variable-base';
import VariableCard from 'components/workspace/code-area/variable-area/VariableCard.vue';
import { useGraphBus } from 'src/components/mixins/controller/graph-bus';

export default defineComponent({
    components: { VariableCard },
    setup() {
        const storage = useHeadquarterStorage();
        // const refresh = storage.refreshStepRecord;
        const { currentStepRecord } = storeToRefs(storage);
        const fixedVariables = reactive<Record<string, VariableInfoWrapper>>(
            Object.fromEntries(
                Object.entries(currentStepRecord.value?.variables ?? {}).map(
                    ([key, value]) => {
                        return [key, new VariableInfoWrapper(value, key)];
                    }
                )
            )
        );
        const accessedVariables = computed<VariableInfoWrapper[]>(() =>
            (currentStepRecord.value?.accesses ?? []).map((access) => {
                return new VariableInfoWrapper(access, 'returned variable');
            })
        );
        const _variables = computed<VariableInfoWrapper[]>(() => {
            return [
                ...accessedVariables.value,
                ...Object.values(fixedVariables),
            ];
        });
        const graphBus = useGraphBus();

        watch(
            () => currentStepRecord.value?.variables,
            (newVal) => {
                if (newVal === undefined) {
                    for (const prop of Object.getOwnPropertyNames(
                        fixedVariables
                    )) {
                        delete fixedVariables[prop];
                    }
                } else {
                    for (const key of Object.getOwnPropertyNames(newVal)) {
                        if (!(key in fixedVariables)) {
                            fixedVariables[key] = new VariableInfoWrapper(
                                newVal[key],
                                key
                            );
                        } else {
                            if (
                                newVal[key].pythonId !==
                                fixedVariables[key].variable.pythonId
                            ) {
                                fixedVariables[key].updateBase(newVal[key]);
                            }
                        }
                    }
                }
            }
        );

        watch(_variables, (newVal) => {
            graphBus.emit('clear-highlight');

            for (const variable of newVal) {
                variable.requestHighlight();
            }
        });
        return { variables: _variables };
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
