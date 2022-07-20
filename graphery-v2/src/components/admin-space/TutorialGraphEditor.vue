<template>
    <div class="full-height">
        <FullHeightSplitter v-model="splitterPos" vertical>
            <template #before>
                <GraphDisplay />
            </template>
            <template #after>
                <MonacoEditor />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import GraphDisplay from 'components/workspace/graph-area/GraphDisplay.vue';

export default defineComponent({
    components: { FullHeightSplitter, MonacoEditor, GraphDisplay },
    setup() {
        return { splitterPos: ref(50) };
    },
});
</script>
