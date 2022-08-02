<template>
    <FullHeightSplitter v-model="pos">
        <template #before>
            <MonacoEditor :storage="storage" />
        </template>
        <template #after>
            <VariableDisplay :storage="storage" />
        </template>
    </FullHeightSplitter>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import VariableDisplay from 'components/workspace/code-area/variable-area/VariableDisplay.vue';
import type { PropType } from 'vue';
import type { StateTree, Store } from 'pinia';
import { ICodeGetters, IStateGetters } from 'src/stores/store-interfaces';

export default defineComponent({
    components: { VariableDisplay, MonacoEditor, FullHeightSplitter },
    props: {
        storage: {
            type: Object as PropType<
                Store<string, StateTree, IStateGetters & ICodeGetters>
            >,
            required: true,
        },
    },
    setup() {
        const pos = ref(80);
        return {
            pos,
        };
    },
});
</script>
