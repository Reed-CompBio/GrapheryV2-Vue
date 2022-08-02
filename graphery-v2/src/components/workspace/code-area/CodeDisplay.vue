<template>
    <FullHeightSplitter v-model="pos">
        <template #before>
            <MonacoEditor :storage="headquarterStorage" />
        </template>
        <template #after>
            <VariableDisplay />
        </template>
    </FullHeightSplitter>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import VariableDisplay from 'components/workspace/code-area/variable-area/VariableDisplay.vue';
import { useHeadquarterStorage } from 'src/stores/headquarter/headquarter-storage';

export default defineComponent({
    components: { VariableDisplay, MonacoEditor, FullHeightSplitter },
    setup() {
        const pos = ref(80);
        const headquarterStorage = useHeadquarterStorage();
        return {
            pos,
            headquarterStorage,
        };
    },
});
</script>
