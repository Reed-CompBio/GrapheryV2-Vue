<template>
    <div id="graph-wrapper" class="full-height">
        <div id="graph-display-section" class="full-height">
            <GraphControl :graphing="graphing" ref="graph-control" />
            <GraphingSection :graph-data="graphData" ref="graphing" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type { GraphAnchorType } from 'src/types/tutorial-types';
import type { SerializedGraph } from 'graphology-types';
import GraphingSection from 'components/workspace/graph/GraphingSection.vue';
import GraphControl from 'components/workspace/graph/GraphControl.vue';

export default defineComponent({
    components: { GraphControl, GraphingSection },
    props: {
        graphInfos: {
            type: Object as PropType<GraphAnchorType[]>,
            default: undefined,
        },
    },
    setup() {
        const graphData = JSON.parse(
            '{"attributes": {}, "options": {"allowSelfLoops": true, "type": "undirected", "multi": false}, "nodes": [{"key": "v_69", "attribute": {"id": "v_69", "name": "F", "displayed": {}, "size": 10}}, {"key": "v_75", "attribute": {"id": "v_75", "name": "D", "displayed": {}, "size": 10}}, {"key": "v_72", "attribute": {"id": "v_72", "name": "H", "displayed": {}, "size": 10}}, {"key": "v_67", "attribute": {"id": "v_67", "name": "K", "displayed": {}, "size": 10}}, {"key": "v_66", "attribute": {"id": "v_66", "name": "B", "displayed": {}, "size": 10}}, {"key": "v_71", "attribute": {"id": "v_71", "name": "J", "displayed": {}, "size": 10}}, {"key": "v_68", "attribute": {"id": "v_68", "name": "E", "displayed": {}, "size": 10}}, {"key": "v_73", "attribute": {"id": "v_73", "name": "L", "displayed": {}, "size": 10}}, {"key": "v_65", "attribute": {"id": "v_65", "name": "C", "displayed": {}, "size": 10}}, {"key": "v_70", "attribute": {"id": "v_70", "name": "A", "displayed": {}, "size": 10}}, {"key": "v_64", "attribute": {"id": "v_64", "name": "I", "displayed": {}, "size": 10}}, {"key": "v_74", "attribute": {"id": "v_74", "name": "G", "displayed": {}, "size": 10}}], "edges": [{"key": "v_69->v_68", "source": "v_69", "target": "v_68", "attributes": {"id": "e_73", "name": "E-F", "source": "v_68", "target": "v_69", "displayed": {}}}, {"key": "v_69->v_66", "source": "v_69", "target": "v_66", "attributes": {"id": "e_74", "name": "B-F", "source": "v_66", "target": "v_69", "displayed": {}}}, {"key": "v_69->v_75", "source": "v_69", "target": "v_75", "attributes": {"id": "e_78", "name": "D-F", "source": "v_75", "target": "v_69", "displayed": {}}}, {"key": "v_69->v_74", "source": "v_69", "target": "v_74", "attributes": {"id": "e_81", "name": "G-F", "source": "v_74", "target": "v_69", "displayed": {}}}, {"key": "v_75->v_65", "source": "v_75", "target": "v_65", "attributes": {"id": "e_77", "name": "C-D", "source": "v_65", "target": "v_75", "displayed": {}}}, {"key": "v_72->v_64", "source": "v_72", "target": "v_64", "attributes": {"id": "e_71", "name": "H-I", "source": "v_72", "target": "v_64", "displayed": {}}}, {"key": "v_72->v_66", "source": "v_72", "target": "v_66", "attributes": {"id": "e_79", "name": "B-H", "source": "v_66", "target": "v_72", "displayed": {}}}, {"key": "v_67->v_68", "source": "v_67", "target": "v_68", "attributes": {"id": "e_72", "name": "E-K", "source": "v_68", "target": "v_67", "displayed": {}}}, {"key": "v_67->v_74", "source": "v_67", "target": "v_74", "attributes": {"id": "e_76", "name": "G-K", "source": "v_74", "target": "v_67", "displayed": {}}}, {"key": "v_66->v_70", "source": "v_66", "target": "v_70", "attributes": {"id": "e_75", "name": "A-B", "source": "v_70", "target": "v_66", "displayed": {}}}, {"key": "v_68->v_73", "source": "v_68", "target": "v_73", "attributes": {"id": "e_83", "name": "E-L", "source": "v_68", "target": "v_73", "displayed": {}}}, {"key": "v_68->v_65", "source": "v_68", "target": "v_65", "attributes": {"id": "e_70", "name": "C-E", "source": "v_65", "target": "v_68", "displayed": {}}}, {"key": "v_68->v_74", "source": "v_68", "target": "v_74", "attributes": {"id": "e_80", "name": "E-G", "source": "v_68", "target": "v_74", "displayed": {}}}, {"key": "v_65->v_70", "source": "v_65", "target": "v_70", "attributes": {"id": "e_82", "name": "A-C", "source": "v_70", "target": "v_65", "displayed": {}}}]}'
        ) as Partial<SerializedGraph>;

        const graphing = ref<InstanceType<typeof GraphingSection> | null>(null);
        const graphControl = ref<InstanceType<typeof GraphControl> | null>(
            null
        );

        return {
            graphData,
            graphing,
            graphControl,
        };
    },
});
</script>
