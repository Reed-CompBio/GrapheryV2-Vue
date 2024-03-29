<template>
    <div id="graph-container" class="full-height"></div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    markRaw,
    onMounted,
    reactive,
    watch,
} from 'vue';
import Graph from 'graphology';
import { initSigma, useSigma } from 'components/mixins/sigma/instance';
import { initGraphLayouts } from 'components/mixins/sigma/layouts';
import { useGraphBus } from 'components/mixins/controller/graph-bus';

import type { Ref } from 'vue';
import type Sigma from 'sigma';
import type { PropType } from 'vue';
import type { SpecialHighlightSettings } from 'components/mixins/sigma/sigma-highlight';
import type { SerializedGraph } from 'graphology-types';
import type { GraphNodeAttributeType } from 'components/mixins/sigma/instance';
import { isEdgeType, isNodeType } from 'src/types/execution-types';
import type { HighLightProtocol } from 'components/mixins/controller/graph-bus';

type GraphType = Graph<Partial<GraphNodeAttributeType>>;

type SigmaInfo = {
    sigma: Sigma | undefined;
};

function graphToolBoxCreator(graph: GraphType, sigma: Ref<Sigma | undefined>) {
    return {
        addVariableHighlight(value: HighLightProtocol) {
            let highlightColor: Set<string> | undefined;
            const variable = value.variable;
            const color = value.color || variable.color;

            if (isNodeType(variable)) {
                const nodeId = variable.attributes?.key;

                highlightColor = graph.getNodeAttribute(
                    nodeId,
                    'highlightColor'
                );

                if (!highlightColor) {
                    graph.setNodeAttribute(
                        nodeId,
                        'highlightColor',
                        (highlightColor = new Set())
                    );
                    // always set node to highlighted
                    graph.setNodeAttribute(nodeId, 'highlighted', true);
                }
            } else if (isEdgeType(variable)) {
                const edgeKey = graph.edge(
                    variable.repr.source.attributes?.key,
                    variable.repr.target.attributes?.key
                );
                highlightColor = graph.getEdgeAttribute(
                    edgeKey,
                    'highlightColor'
                );
                if (!highlightColor) {
                    graph.setEdgeAttribute(
                        edgeKey,
                        'highlightColor',
                        (highlightColor = new Set())
                    );
                    // always set node to highlighted
                    graph.setEdgeAttribute(edgeKey, 'highlighted', true);
                }
            } else {
                return;
            }

            highlightColor.add(color);
        },
        removeVariableHighlight(value: HighLightProtocol) {
            let highlightColor;
            const variable = value.variable;
            const color = value.color || variable.color;

            if (isNodeType(variable)) {
                const nodeId = variable.attributes?.key;
                highlightColor = graph.getNodeAttribute(
                    nodeId,
                    'highlightColor'
                );
            } else if (isEdgeType(variable)) {
                const edgeKey = graph.edge(
                    variable.repr.source.attributes?.key,
                    variable.repr.target.attributes?.key
                );
                highlightColor = graph.getEdgeAttribute(
                    edgeKey,
                    'highlightColor'
                );
            }

            if (highlightColor) {
                if (typeof color === 'string') {
                    highlightColor.delete(color);
                }
            }
        },
        cleanHighlightGraph() {
            graph.nodes().forEach((item) => {
                const highlightColor = graph.getNodeAttribute(
                    item,
                    'highlightColor'
                );
                highlightColor?.clear();
            });
            graph.edges().forEach((item) => {
                const highlightColor = graph.getEdgeAttribute(
                    item,
                    'highlightColor'
                );
                highlightColor?.clear();
            });
        },
        clearGraph() {
            graph.clear();
        },
        importGraph(data: string | Partial<SerializedGraph>) {
            this.clearGraph();
            if (typeof data === 'string') {
                graph.import(JSON.parse(data));
            } else {
                graph.import(data);
            }
        },
    };
}

export default defineComponent({
    props: {
        settings: {
            type: Object as PropType<Partial<SpecialHighlightSettings>>,
            default: undefined,
        },
        graphJson: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        // graph object
        const graph = markRaw(new Graph());
        // sigma container
        const sigmaInfo = reactive<SigmaInfo>({
            sigma: undefined,
        });

        // sigma instance
        const sigma = computed(() => sigmaInfo.sigma as Sigma | undefined);

        // graph tools
        const toolBox = markRaw(graphToolBoxCreator(graph, sigma));

        // TODO: force layout performance issue
        const layouts = initGraphLayouts(graph);
        layouts.value.forceLayout.toggle();
        // layouts.value.forceAtlas.toggle();

        onMounted(() => {
            // load sigma when the element is mounted
            initSigma(
                graph,
                document.getElementById('graph-container') as HTMLElement,
                props.settings
            );

            sigmaInfo.sigma = useSigma();

            if (props.graphJson) {
                toolBox.importGraph(props.graphJson);
            }
        });

        watch(
            () => props.graphJson,
            (newVal) => {
                console.debug('import new graph from', newVal);
                if (typeof newVal === 'string') {
                    toolBox.importGraph(newVal);
                } else {
                    toolBox.clearGraph();
                }
            }
        );

        const eventBus = useGraphBus();

        eventBus.on('clear-highlight', () => {
            toolBox.cleanHighlightGraph();
        });

        eventBus.on('add-highlight', (protocol) => {
            toolBox.addVariableHighlight(protocol);
        });

        eventBus.on('remove-highlight', (protocol) => {
            toolBox.removeVariableHighlight(protocol);
        });

        eventBus.on('replace-highlight', (protocols) => {
            for (const protocol of protocols) {
                eventBus.emit('remove-highlight', protocol);
                eventBus.emit('add-highlight', protocol);
            }
        });

        return {
            sigmaInfo,
            sigma,
            graph,
            toolBox,
        };
    },
});
</script>
