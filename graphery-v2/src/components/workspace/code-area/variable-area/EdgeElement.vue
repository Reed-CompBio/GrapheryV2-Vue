<template>
    <div class="var-edge-element-wrapper">
        <div class="var-edge-element-grid">
            <ElementWrapper
                :info="source"
                :parent="info"
                :index="edgeIndexFormatter('source')"
            />
            <div class="var-edge-direction-indicator">
                {{ directionIndicator }}
            </div>
            <ElementWrapper
                :info="target"
                :parent="info"
                :index="edgeIndexFormatter('target')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { VariableInfo } from 'src/components/mixins/variable-base';
import { computed, defineComponent } from 'vue';
import ElementWrapper from './ElementWrapper.vue';

import type { GraphEdgeType } from 'src/types/execution-types';
import type { PropType } from 'vue';

export default defineComponent({
    components: { ElementWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo<GraphEdgeType>>,
            required: true,
        },
    },
    setup(props) {
        const source = computed(() => props.info.variable.repr.source);
        const target = computed(() => props.info.variable.repr.target);
        const directed = computed(() => props.info.variable.repr.is_directed);
        const directionIndicator = computed(() =>
            directed.value ? '->' : '-'
        );

        function edgeIndexFormatter(type: 'source' | 'target') {
            return type === 'source' ? '[0]' : '[1]';
        }

        return { source, target, directionIndicator, edgeIndexFormatter };
    },
});
</script>

<style lang="sass">
.var-edge-element-grid
    display: grid
    grid-template-columns: 20fr 1fr 20fr
</style>
