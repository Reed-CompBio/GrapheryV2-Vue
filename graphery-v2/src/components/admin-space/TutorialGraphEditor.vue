<template>
    <div class="full-height">
        <FullHeightSplitter v-model="splitterPos">
            <template #before>
                <FullHeightSplitter v-model="splitterPos" horizontal>
                    <template #before>
                        <GraphDisplay />
                    </template>
                    <template #after>
                        <MarkdownDisplay doc-id="graph-abstract-text" />
                    </template>
                </FullHeightSplitter>
            </template>
            <template #after>
                <MonacoEditor editor-id="monaco-graph-editor" />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import GraphDisplay from 'components/workspace/graph-area/GraphDisplay.vue';
import MarkdownDisplay from 'components/workspace/text-area/MarkdownDisplay.vue';

export default defineComponent({
    components: {
        MarkdownDisplay,
        FullHeightSplitter,
        MonacoEditor,
        GraphDisplay,
    },
    setup() {
        return { splitterPos: ref(50) };
    },
});
</script>
