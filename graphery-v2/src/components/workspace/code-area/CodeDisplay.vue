<template>
    <div class="full-height">
        <WorkspaceHeadquarter :storage="storage" :style="barStyle" />
        <FullHeightSplitter v-model="pos" :style="editorStyle">
            <template #before>
                <MonacoEditor :storage="storage" />
            </template>
            <template #after>
                <VariableDisplay :storage="storage" />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import WorkspaceHeadquarter from './WorkspaceHeadquarter.vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import MonacoEditor from 'components/workspace/code-area/MonacoEditor.vue';
import VariableDisplay from 'components/workspace/code-area/variable-area/VariableDisplay.vue';
import type { PropType } from 'vue';
import type { StateTree, Store } from 'pinia';
import { ICodeGetters, IStateGetters } from 'src/stores/store-interfaces';

export default defineComponent({
    components: {
        VariableDisplay,
        MonacoEditor,
        FullHeightSplitter,
        WorkspaceHeadquarter,
    },
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

        const appBarSize = '32px';
        const barStyle = computed(() => ({
            height: appBarSize,
        }));
        const editorStyle = computed(() => ({
            height: `calc(100% - ${appBarSize}) !important`,
        }));

        return {
            pos,
            barStyle,
            editorStyle,
        };
    },
});
</script>
