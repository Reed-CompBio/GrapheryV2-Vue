<template>
    <div
        id="tutorial-text-section-wrapper"
        class="full-height"
        style="overflow: hidden"
    >
        <q-scroll-area
            id="tutorialTextScroll"
            ref="tutorial-text-scroll"
            class="fit"
        >
            <div id="tutorial-text-wrapper" v-if="showTutorial">
                <div id="tutorial-summary-wrapper" class="text-center">
                    <div id="tutorial-title-wrapper">
                        <h1 id="tutorial-title">
                            {{ tutorialData?.title }}
                        </h1>
                    </div>
                    <div id="tutorial-published-status">
                        <q-chip v-if="!tutorialPublished">
                            Tutorial Status:
                            {{ tutorialData?.tutorialAnchor.itemStatus }}
                        </q-chip>
                        <q-chip v-if="!translationPublished">
                            Translation Status:
                            {{ tutorialData?.itemStatus }}
                        </q-chip>
                    </div>
                    <div id="tutorial-rank-wrapper">
                        <q-chip>
                            Rank: {{ tutorialData?.tutorialAnchor.rank }}
                        </q-chip>
                    </div>
                    <div id="tutorial-authors-wrapper">
                        <q-chip
                            v-for="author in tutorialData?.authors"
                            :key="author.displayedName"
                        >
                            {{ author.displayedName }}
                        </q-chip>
                    </div>
                    <div id="tutorial-time-wrapper">
                        <q-chip>
                            Modified at:
                            {{ new Date(tutorialData?.modifiedTime) }}
                        </q-chip>
                    </div>
                    <div id="tutorial-abstract-wrapper">
                        <p>
                            {{ tutorialData?.abstract }}
                        </p>
                    </div>
                </div>
                <div id="tutorial-content-wrapper">
                    <MarkdownDisplay
                        :doc-id="tutorialData?.title"
                        :markdown-content="tutorialData?.contentMarkdown"
                    />
                </div>
                <div id="tutorial-license-wrapper">
                    <LicenseCard />
                </div>
            </div>
            <div id="tutorial-absent-wrapper" v-else>
                <q-inner-loading
                    showing
                    transition-show="fade"
                    transition-hide="fade"
                >
                    <div class="text-center">
                        <h2>Tutorial Text Is Missing</h2>
                        <div id="tutorial-text-loading" v-if="info?.loading">
                            <h3>Trying To Load</h3>
                            <q-spinner-pie size="64px" color="primary" />
                        </div>
                        <div
                            id="tutorial-text-failing"
                            v-if="info?.loading && (info.errors || info.error)"
                        >
                            <h3>Cannot Load Tutorial Text</h3>
                            <h3>
                                Please Try
                                <a href="javascript:window.location.reload()">
                                    Refreshing This Page
                                </a>
                            </h3>
                        </div>
                    </div>
                </q-inner-loading>
            </div>
        </q-scroll-area>
    </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue';
import { Status } from 'src/types/tutorial-types';

import type { PropType } from 'vue';
import type {
    GraphQLLoadingType,
    TutorialType,
} from 'src/types/tutorial-types';

const queryName = 'tutorialContent' as const;
type TutorialText = GraphQLLoadingType<typeof queryName, [TutorialType]>;

interface TutorialTextStyle {
    titleFont?: string;
    titleFontSize?: number;
    bodyFont?: string;
    bodyFontSize?: number;
}

export default defineComponent({
    components: {
        MarkdownDisplay: defineAsyncComponent(
            () => import('components/workspace/MarkdownDisplay.vue')
        ),
        LicenseCard: defineAsyncComponent(
            () => import('src/components/general/LicenseCard.vue')
        ),
    },
    props: {
        info: {
            type: Object as PropType<TutorialText | undefined>,
            default: undefined,
        },
        style: {
            type: Object as PropType<TutorialTextStyle>,
            default: undefined,
        },
    },
    setup(props) {
        const style = computed(() => {
            return { ...props.style };
        });
        // TODO: add separate styles for different sections, and add a general style for

        const tutorialData = computed<TutorialType | undefined>(() => {
            return props.info?.data
                ? props.info?.data[queryName][0]
                : undefined;
        });

        const tutorialPublished = computed(() => {
            return (
                tutorialData.value?.tutorialAnchor.itemStatus ===
                Status.PUBLISHED
            );
        });

        const translationPublished = computed(() => {
            return tutorialData.value?.itemStatus === Status.PUBLISHED;
        });

        const showTutorial = computed(() => {
            return tutorialData.value !== undefined;
        });

        return {
            tutorialStyle: style,
            showTutorial,
            tutorialData,
            tutorialPublished,
            translationPublished,
        };
    },
});
</script>

<style lang="sass">
#tutorial-text-wrapper
    padding: 15px

#tutorial-summary-wrapper
    margin: 1rem auto

#tutorial-title
    margin: 1rem auto 2rem

#tutorial-license-wrapper
    margin: 20px 0
</style>
