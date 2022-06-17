<template>
    <div id="graph-container" class="full-height"></div>
</template>

<script lang="ts">
import { defineComponent, markRaw, onMounted, ref } from 'vue';
import Graph from 'graphology';
import type Sigma from 'sigma';
import ForceSupervisor from 'graphology-layout-force/worker';

import type { PropType } from 'vue';
import type { SpecialHighlightSettings } from 'components/mixins/sigma/sigma-highlight';
import type { SerializedGraph } from 'graphology-types';
import { initSigma, useSigma } from 'components/mixins/sigma/instance';

type SigmaInfo = {
    sigma: Sigma | undefined;
    draggedNode: string | undefined;
    isDragging: boolean;
};

export default defineComponent({
    props: {
        graphData: {
            type: Object as PropType<Partial<SerializedGraph>>,
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
        if (props.graphData) {
            // import graph from props
            graph.import(props.graphData);
        } else {
            // otherwise load the default graph
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
                highlightColor: new Set([
                    '#763C28',
                    '#F54021',
                    '#955F20',
                    '#E4A010',
                ]),
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

        // force layout
        const forceLayout = ref<ForceSupervisor>(
            new ForceSupervisor(graph, {
                isNodeFixed: (_, attr) => attr.highlighted,
            })
        );
        function toggleForceLayout() {
            if (forceLayout.value?.isRunning()) {
                forceLayout.value?.stop();
            } else {
                forceLayout.value?.start();
            }
        }
        toggleForceLayout();

        // sigma.js
        const sigmaInfo = ref<SigmaInfo>({
            sigma: undefined,
            draggedNode: undefined,
            isDragging: false,
        });

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

        return { sigmaInfo, graph };
    },
});
</script>
