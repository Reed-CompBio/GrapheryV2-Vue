<template>
    <div id="graph-container" class="full-height"></div>
</template>

<script lang="ts">
import { defineComponent, markRaw, onMounted, ref } from 'vue';
import Graph from 'graphology';
import Sigma from 'sigma';
import ForceSupervisor from 'graphology-layout-force/worker';

import type { PropType } from 'vue';
import type { SpecialHighlightSettings } from 'components/mixins/sigma/sigma-highlight';
import { SerializedGraph } from 'graphology-types';
import { initSigma, useSigma } from 'components/mixins/sigma/instance';

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
        const sigma = ref<Sigma | undefined>();

        onMounted(() => {
            // load sigma when the element is mounted
            initSigma(
                graph,
                document.getElementById('graph-container') as HTMLElement,
                props.settings
            );

            sigma.value = useSigma();

            // temp click event
            sigma.value?.on('clickNode', (e) => {
                graph.setNodeAttribute(e.node, 'highlighted', true);
            });
        });

        return { sigma, graph, toggleForceLayout };
    },
});
</script>
