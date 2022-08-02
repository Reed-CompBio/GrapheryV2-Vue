<template>
    <div class="full-size">
        <!--   Left and Right splitter    -->
        <FullHeightSplitter v-model="leftRightSplitterPos">
            <template #before>
                <!--       Top and Down splitter         -->
                <FullHeightSplitter v-model="upDownSplitterPos" horizontal>
                    <template #before>
                        <GraphDisplay :storage="headquarterStorage" />
                    </template>
                    <template #after>
                        <CodeDisplay :storage="headquarterStorage" />
                    </template>
                </FullHeightSplitter>
            </template>
            <template #after>
                <TextDisplay :storage="headquarterStorage" />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import TextDisplay from 'components/workspace/text-area/TextDisplay.vue';
import { useStorageBus } from 'components/mixins/controller/storage-bus';
import { useRoute } from 'vue-router';
import { useHeadquarterStorage } from 'stores/headquarter/headquarter-storage';

export default defineComponent({
    components: {
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
        const headquarterStorage = useHeadquarterStorage();
        bus.emit('fetch-tutorial', {
            url: route.params.url as string,
        });

        return {
            leftRightSplitterPos,
            upDownSplitterPos,
            headquarterStorage,
        };
    },
});
</script>
