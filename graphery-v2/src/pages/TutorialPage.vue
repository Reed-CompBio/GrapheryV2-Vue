<template>
    <div class="full-size">
        <!--   Left and Right splitter    -->
        <FullHeightSplitter v-model="leftRightSplitterPos">
            <template v-slot:before>
                <!--       Top and Down splitter         -->
                <FullHeightSplitter v-model="upDownSplitterPos" horizontal>
                    <template v-slot:before>
                        <GraphDisplay />
                    </template>
                    <template v-slot:after>
                        <div class="full-height" style="overflow: hidden">
                            <!-- TODO fix this height of monaco -->
                            <WorkspaceHeadquarter />
                            <MonacoEditor />
                        </div>
                    </template>
                </FullHeightSplitter>
            </template>
            <template v-slot:after>
                <TextDisplay :info="tutorialTextResult" />
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, markRaw, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/frames/FullHeightSplitter.vue';
import TextDisplay from 'components/workspace/text-area/TextDisplay.vue';
import WorkspaceHeadquarter from 'components/workspace/code-area/WorkspaceHeadquarter.vue';
import { APILoader } from 'components/mixins/load-api';
import { gql } from 'graphql-tag';

export default defineComponent({
    components: {
        WorkspaceHeadquarter,
        GraphDisplay: defineAsyncComponent(
            () => import('components/workspace/graph-area/GraphDisplay.vue')
        ),
        MonacoEditor: defineAsyncComponent(
            () => import('components/workspace/code-area/MonacoEditor.vue')
        ),
        FullHeightSplitter,
        TextDisplay,
    },
    setup() {
        const leftRightSplitterPos = ref(50);
        const upDownSplitterPos = ref(50);

        const loader = markRaw(
            new APILoader(gql`
                query {
                    tutorialContent(
                        filters: {
                            tutorialAnchor: {
                                id: {
                                    exact: "47404139-7fdb-438d-9f58-fdc77cf04303"
                                }
                            }
                        }
                    ) {
                        tutorialAnchor {
                            itemStatus
                            rank
                        }
                        title
                        abstract
                        authors {
                            displayedName
                        }
                        itemStatus
                        contentMarkdown
                        modifiedTime
                    }
                }
            `)
        );

        loader.load().then((res) => {
            console.log(res);
            tutorialTextResult.value = res;
        });
        const tutorialTextResult = ref({});

        return {
            leftRightSplitterPos,
            upDownSplitterPos,
            tutorialTextResult,
            loader,
        };
    },
});
</script>
