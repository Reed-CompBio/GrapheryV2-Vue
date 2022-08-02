<template>
    <div id="graph-wrapper" class="full-height">
        <div
            v-if="isLoadingGraph"
            id="graph-display-loading"
            class="full-height"
        >
            <q-spinner size="64px" />
        </div>
        <div id="graph-display-section" class="full-height">
            <GraphControl ref="graph-control" :graphing="graphing" />
            <GraphingSection ref="graphing" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type { GraphAnchorType } from 'src/types/api-types';
import GraphingSection from 'components/workspace/graph-area/GraphingSection.vue';
import GraphControl from 'components/workspace/graph-area/GraphControl.vue';
import { useHeadquarterStorage } from 'stores/headquarter/headquarter-storage';

export default defineComponent({
    components: { GraphControl, GraphingSection },
    props: {
        graphInfos: {
            type: Object as PropType<GraphAnchorType[]>,
            default: undefined,
        },
    },
    setup() {
        const graphing = ref<InstanceType<typeof GraphingSection> | null>(null);
        const graphControl = ref<InstanceType<typeof GraphControl> | null>(
            null
        );

        const storage = useHeadquarterStorage();

        const isLoadingGraph = computed(() => storage.isLoadingGraph);

        return {
            graphing,
            graphControl,
            isLoadingGraph,
        };
    },
});
</script>

<style scoped lang="sass">
#graph-display-loading
    display: flex
    align-items: center
    justify-content: center
</style>
