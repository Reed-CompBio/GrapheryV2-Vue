<template>
    <div id="graph-control-wrapper" :class="[vertical ? 'col' : 'row']">
        <div class="graph-control-button-wrapper row items-center">
            <q-btn
                rounded
                outline
                size="sm"
                icon="mdi-graph-outline"
                style="margin-right: 5px"
                @click="choice.changeChoosing()"
            >
                <q-tooltip anchor="top middle" self="bottom middle">
                    <!-- TODO i18n-->
                    Choose Graph
                </q-tooltip>
            </q-btn>
            <!-- TODO: i18n -->
            <q-select
                v-show="choice.choosing"
                v-model="choice.choosingWhich"
                outlined
                dense
                rounded
                label="Graph"
                :options="storage.graphAnchors"
                :map-options="true"
                :option-label="(x) => x.graphDescription.title"
                :loading="isLoadingGraph"
                :disable="isLoadingGraph"
                style="z-index: 2"
            />
        </div>
        <div
            v-for="button in buttons"
            :key="button.icon"
            class="graph-control-button-wrapper"
        >
            <q-btn
                :icon="button.icon"
                rounded
                outline
                size="sm"
                @click="button.callBack"
            >
                <q-tooltip anchor="center right" self="center left">
                    {{ button.tooltip }}
                </q-tooltip>
            </q-btn>
        </div>
        <div class="graph-control-button-wrapper">
            <q-btn icon="mdi-cog-outline" rounded outline size="sm">
                <q-tooltip>
                    <!-- TODO i18n -->
                    Settings
                </q-tooltip>
                <q-menu fit auto-close anchor="center right" self="center left">
                    <q-item>
                        <q-item-section no-wrap>
                            <q-item-label>Force Layout</q-item-label>
                        </q-item-section>
                        <q-item-section no-wrap side>
                            <q-toggle
                                v-model="layouts.forceLayout.isRunning"
                                :disable="!layouts.forceLayout"
                            />
                        </q-item-section>
                    </q-item>
                </q-menu>
            </q-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useSigmaCamera } from 'components/mixins/sigma/instance';
import { toKebabCase } from 'src/utils/utils';
import { useQuasar } from 'quasar';
import saveAsPNG from 'components/mixins/sigma/save-as-png';
import { useGraphLayouts } from 'components/mixins/sigma/layouts';
import { useHeadquarterStorage } from 'stores/headquarter-storage';
import { useStorageBus } from 'src/components/mixins/controller/storage-bus';
import { storeToRefs } from 'pinia';

import type { PropType } from 'vue';
import type GraphingSection from 'components/workspace/graph-area/GraphingSection.vue';
import type { GraphAnchorType } from 'src/types/api-types';

export default defineComponent({
    props: {
        vertical: {
            type: Boolean,
            default: true,
        },
        animationDuration: {
            type: Number,
            default: 200,
        },
        zoomFactor: {
            type: Number,
            default: 1.5,
        },
        graphing: {
            type: Object as PropType<InstanceType<
                typeof GraphingSection
            > | null>,
            default: null,
        },
    },
    setup(props) {
        const storage = useHeadquarterStorage();
        const eventBus = useStorageBus();

        const choice = ref({
            choosing: false,
            choosingWhich: computed({
                get() {
                    return storage.currentGraphAnchor;
                },
                set(anchorObj: GraphAnchorType | null) {
                    eventBus.emit('fetch-graph', {
                        graphAnchorId: anchorObj?.id,
                    });
                },
            }),
            changeChoosing() {
                this.choosing = !this.choosing;
            },
        });

        const { graphAnchors, isLoadingGraph } = storeToRefs(storage);
        if (graphAnchors) {
            console.debug('init graph anchors: ', graphAnchors);
            choice.value.choosingWhich = graphAnchors.value[0];
        }
        watch(graphAnchors, (val) => {
            console.debug('graph anchors changed: ', val);
            choice.value.choosingWhich = graphAnchors.value[0];
        });

        const { zoomIn, zoomOut, reset } = useSigmaCamera({
            factor: props.zoomFactor,
            duration: props.animationDuration,
        });

        const { notify } = useQuasar();

        const buttons = [
            {
                icon: 'mdi-plus-thick',
                callBack: () => zoomIn(),
                tooltip: 'Zoom In', // TODO: i18n
            },
            {
                icon: 'mdi-minus-thick',
                callBack: () => zoomOut(),
                tooltip: 'Zoom Out', // TODO: i18n
            },
            {
                icon: toKebabCase('mdiArrowLeftRightBoldOutline'),
                callBack: () => reset(),
                tooltip: 'Reset View', // TODO: i18n
            },
            {
                icon: toKebabCase('mdiFileMultipleOutline'),
                callBack: () => {
                    if (navigator && 'clipboard' in navigator) {
                        navigator.clipboard.writeText(
                            JSON.stringify(props.graphing?.graph.export())
                        );
                        notify({
                            type: 'positive',
                            // TODO: i18n
                            message: 'Copied The Graph Serialization',
                        });
                    } else {
                        notify({
                            type: 'negative',
                            // TODO: i18n
                            message:
                                'Fail To Copy Graph Serialization Due To Lack Of Browser Support',
                        });
                    }
                },
                tooltip: 'Copy Graph Serialization', // TODO: i18n
            },
            {
                icon: toKebabCase('mdiImageMultipleOutline'),
                callBack: () => {
                    const layers = ['edges', 'nodes', 'edgeLabels', 'labels'];

                    saveAsPNG(
                        props.graphing?.sigma,
                        layers,
                        () => {
                            notify({
                                type: 'positive',
                                // TODO: i18n
                                message: 'Copied Graph Image',
                            });
                        },
                        () => {
                            notify({
                                type: 'negative',
                                // TODO: i18n
                                message: 'Failed To Copy Graph Image',
                            });
                        }
                    );
                },
                tooltip: 'Copy Graph Image', // TODO: i18n
            },
        ];

        const layouts = useGraphLayouts();

        return {
            buttons,
            layouts,
            choice,
            storage,
            isLoadingGraph,
        };
    },
});
</script>

<style scoped lang="sass">
#graph-control-wrapper
    margin: 10px
    position: absolute
    z-index: 1

    .graph-control-button-wrapper
        margin-right: 5px
        margin-bottom: 5px
</style>
