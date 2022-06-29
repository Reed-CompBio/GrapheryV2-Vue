<template>
    <div id="graph-container" class="full-height"></div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, onMounted, ref, watch } from 'vue';
import Graph from 'graphology';
import { initSigma, useSigma } from 'components/mixins/sigma/instance';
import { initGraphLayouts } from 'components/mixins/sigma/layouts';
import { useHeadquarterStorage } from 'src/stores/headquarter-storage';
import { storeToRefs } from 'pinia';
import { useHeadquarterBus } from 'src/components/mixins/controller/headquarter-bus';

import type { Ref } from 'vue';
import type Sigma from 'sigma';
import type { PropType } from 'vue';
import type { SpecialHighlightSettings } from 'components/mixins/sigma/sigma-highlight';
import type { SerializedGraph } from 'graphology-types';
import type { GraphNodeAttributeType } from 'components/mixins/sigma/instance';

type GraphType = Graph<Partial<GraphNodeAttributeType>>;

type SigmaInfo = {
    sigma: Sigma | undefined;
    draggedNode: string | undefined;
    isDragging: boolean;
};

function initDefaultGraph(graph: GraphType) {
    graph.addNode('n1', {
        x: 0,
        y: 0,
        size: 10,
        highlightColor: new Set(['#59351F']),
        // color: chroma.random().hex(),
    });
    graph.addNode('n2', {
        x: -5,
        y: 5,
        size: 10,
        highlightColor: new Set(['#763C28', '#F54021', '#955F20', '#E4A010']),
        // color: chroma.random().hex(),
    });
    graph.addNode('n3', {
        x: 5,
        y: 5,
        size: 10,
        highlightColor: new Set(['#FF2301', '#D53032', '#2F4538']),
        // color: chroma.random().hex(),
    });
    graph.addNode('n4', {
        x: 0,
        y: 10,
        size: 10,
        highlightColor: new Set(['#063971', '#FF7514']),
        // color: chroma.random().hex(),
    });
    graph.addEdge('n1', 'n2');
    graph.addEdge('n2', 'n4');
    graph.addEdge('n4', 'n3');
    graph.addEdge('n3', 'n1');
}

function graphToolBoxCreator(graph: GraphType, sigma: Ref<Sigma | undefined>) {
    return {
        addHighlight(nodeId: string, color: string | string[] | Set<string>) {
            let highlightColor = graph.getNodeAttribute(
                nodeId,
                'highlightColor'
            );
            if (!highlightColor) {
                highlightColor = new Set();
                graph.setNodeAttribute(
                    nodeId,
                    'highlightColor',
                    highlightColor
                );
            }
            if (typeof color === 'string') {
                highlightColor.add(color);
            } else {
                color.forEach(highlightColor.add, highlightColor);
            }
        },
        removeHighlight(
            nodeId: string,
            color: string | string[] | Set<string>
        ) {
            const highlightColor = graph.getNodeAttribute(
                nodeId,
                'highlightColor'
            );
            if (highlightColor) {
                if (typeof color === 'string') {
                    highlightColor.delete(color);
                } else {
                    color.forEach(highlightColor.delete, highlightColor);
                }
            }
        },
        cleanHighlightGraph() {
            graph.nodes().forEach((item) => {
                const highlightColor = graph.getNodeAttribute(
                    item,
                    'highlightColor'
                );
                if (highlightColor) {
                    this.removeHighlight(item, highlightColor);
                }
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
        graphData: {
            type: Object as PropType<Partial<SerializedGraph> | string>,
            default: undefined,
        },
        settings: {
            type: Object as PropType<Partial<SpecialHighlightSettings>>,
            default: undefined,
        },
    },
    setup(props) {
        // graph object
        const graph = markRaw(new Graph());
        // sigma container
        const sigmaInfo = ref<SigmaInfo>({
            sigma: undefined,
            draggedNode: undefined,
            isDragging: false,
        });

        // sigma instance
        const sigma = computed(
            () => sigmaInfo.value.sigma as Sigma | undefined
        );

        // graph tools
        const toolBox = markRaw(graphToolBoxCreator(graph, sigma));

        // init data
        if (props.graphData) {
            // import graph from props
            toolBox.importGraph(props.graphData);
        } else {
            // otherwise load the default graph
            initDefaultGraph(graph);
        }
        // watch prop graph data change and import if change happens
        watch(
            () => props.graphData,
            (newVal) => {
                toolBox.clearGraph();
                if (newVal) {
                    toolBox.importGraph(newVal);
                }
            }
        );

        const layouts = initGraphLayouts(graph);
        layouts.value.forceLayout.toggle();

        onMounted(() => {
            // load sigma when the element is mounted
            initSigma(
                graph,
                document.getElementById('graph-container') as HTMLElement,
                props.settings
            );

            sigmaInfo.value.sigma = useSigma();

            // dragging
            {
                sigmaInfo.value.sigma?.on('downNode', (e) => {
                    sigmaInfo.value.isDragging = true;
                    sigmaInfo.value.draggedNode = e.node;
                });

                sigmaInfo.value.sigma
                    ?.getMouseCaptor()
                    .on('mousemovebody', (e) => {
                        if (
                            !sigmaInfo.value.isDragging ||
                            !sigmaInfo.value.draggedNode
                        )
                            return;

                        const pos = sigmaInfo.value.sigma?.viewportToGraph(e);

                        if (pos) {
                            graph.setNodeAttribute(
                                sigmaInfo.value.draggedNode,
                                'x',
                                pos.x
                            );
                            graph.setNodeAttribute(
                                sigmaInfo.value.draggedNode,
                                'y',
                                pos.y
                            );
                        }

                        e.preventSigmaDefault();
                        e.original.preventDefault();
                        e.original.stopPropagation();
                    });

                sigmaInfo.value.sigma?.getMouseCaptor().on('mouseup', () => {
                    sigmaInfo.value.isDragging = false;
                    sigmaInfo.value.draggedNode = undefined;
                });

                sigmaInfo.value.sigma?.getMouseCaptor().on('mousedown', () => {
                    if (sigmaInfo.value.sigma?.getCustomBBox()) {
                        sigmaInfo.value.sigma?.setCustomBBox(
                            sigmaInfo.value.sigma?.getBBox()
                        );
                    }
                });
            }
        });

        const storage = useHeadquarterStorage();

        const { currentGraph } = storeToRefs(storage);

        watch(currentGraph, (newVal) => {
            if (newVal && newVal.graphJson) {
                toolBox.importGraph(newVal.graphJson);
            } else {
                toolBox.clearGraph();
            }
        });

        const eventBus = useHeadquarterBus();

        eventBus.on('clear-highlight', () => {
            toolBox.cleanHighlightGraph();
        });

        eventBus.on('add-highlight', (protocol) => {
            toolBox.addHighlight(protocol.id, protocol.highlightColor);
        });

        eventBus.on('remove-highlight', (protocol) => {
            toolBox.removeHighlight(protocol.id, protocol.highlightColor);
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
