<template>
    <FullHeightSplitter v-model="pos">
        <template v-slot:before>
            <MonacoEditor />
        </template>
        <template v-slot:after>
            <VariableDisplay />
        </template>
    </FullHeightSplitter>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import VariableDisplay from 'components/workspace/code-area/variable-area/VariableDisplay.vue';

export default defineComponent({
    components: { VariableDisplay, MonacoEditor, FullHeightSplitter },
    setup() {
        const pos = ref(0.8);
        return {
            pos,
        };
    },
});
</script>
