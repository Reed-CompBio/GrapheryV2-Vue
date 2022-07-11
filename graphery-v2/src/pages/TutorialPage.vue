<template>
    <div class="full-size">
        <!--   Left and Right splitter    -->
        <FullHeightSplitter v-model="leftRightSplitterPos">
            <template #before>
                <!--       Top and Down splitter         -->
                <FullHeightSplitter v-model="upDownSplitterPos" horizontal>
                    <template #before>
                        <GraphDisplay />
                    </template>
                    <template #after>
                        <div class="full-height">
                            <WorkspaceHeadquarter />
                            <CodeDisplay :style="editorStyle" />
                        </div>
                    </template>
                </FullHeightSplitter>
            </template>
            <template #after>
                <TextDisplay />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import TextDisplay from 'components/workspace/text-area/TextDisplay.vue';
import WorkspaceHeadquarter from 'components/workspace/code-area/WorkspaceHeadquarter.vue';
import { useStorageBus } from 'components/mixins/controller/storage-bus';
import { useRoute } from 'vue-router';
import { useHeadquarterStorage } from 'src/stores/headquarter-storage';

export default defineComponent({
    components: {
        WorkspaceHeadquarter,
        GraphDisplay: defineAsyncComponent(
            () => import('components/workspace/graph-area/GraphDisplay.vue')
        ),
        CodeDisplay: defineAsyncComponent(
            () => import('components/workspace/code-area/CodeDisplay.vue')
        ),
        FullHeightSplitter,
        TextDisplay,
    },
    setup() {
        const leftRightSplitterPos = ref(50);
        const upDownSplitterPos = ref(50);

        const bus = useStorageBus();
        const route = useRoute();
        useHeadquarterStorage();
        bus.emit('fetch-tutorial', {
            url: route.params.url as string,
        });

        const appBarSize = '32px';
        const editorStyle = computed(() => ({
            height: `calc(100% - ${appBarSize}) !important`,
        }));

        return {
            leftRightSplitterPos,
            upDownSplitterPos,
            editorStyle,
        };
    },
});
</script>
