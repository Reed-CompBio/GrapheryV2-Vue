<template>
    <div class="var-display-wrapper">
        <div class="var-display-accessed-variables">
            <div
                v-for="(variable, index) in accessedVariables"
                :key="index"
                class="var-display-variable"
            >
                <VariableCard :info="variable" />
            </div>
        </div>
        <div class="var-display-variables">
            <div
                v-for="variable in variables"
                :key="variable.label"
                class="var-display-variable"
            >
                <VariableCard :info="variable" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGraphBus } from 'src/components/mixins/controller/graph-bus';
import VariableCard from 'components/workspace/code-area/variable-area/VariableCard.vue';

import type { PropType } from 'vue';
import type { StateTree, Store } from 'pinia';
import type { IStateGetters } from 'src/stores/store-interfaces';

export default defineComponent({
    components: { VariableCard },
    props: {
        storage: {
            type: Object as PropType<Store<string, StateTree, IStateGetters>>,
            required: true,
        },
    },
    setup(props) {
        const { currentStepRecord } = storeToRefs(props.storage);

        const fixedNamedVars = computed(() =>
            Object.entries(currentStepRecord.value?.variables ?? {}).map(
                ([key, value]) => {
                    return {
                        label: key,
                        ...value,
                    };
                }
            )
        );
        const accessedVariables = computed(() =>
            (currentStepRecord.value?.accesses ?? []).map((access) => {
                return { label: 'returned variable', ...access };
            })
        );

        const graphBus = useGraphBus();

        watch(fixedNamedVars, () => {
            graphBus.emit('clear-highlight');
        });
        return { variables: fixedNamedVars, accessedVariables };
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
