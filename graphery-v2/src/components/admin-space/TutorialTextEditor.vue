<template>
    <div class="tutorial-markdown-editor full-height">
        <FullHeightSplitter v-model="splitterPos">
            <template #before>
                <MonacoEditor />
            </template>
            <template #after>
                <MarkdownDisplay />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import MarkdownDisplay from 'components/workspace/text-area/MarkdownDisplay.vue';

export default defineComponent({
    components: { MarkdownDisplay, MonacoEditor, FullHeightSplitter },
    setup() {
        const splitterPos = ref(50);
        return { splitterPos };
    },
});
</script>
