<template>
    <div id="graph-control-wrapper" :class="vertical ? 'col' : 'row'">
        <div
            v-for="button in buttons"
            :key="button.icon"
            class="graph-control-button-wrapper"
        >
            <q-btn
                :icon="button.icon"
                @click="button.callBack"
                rounded
                outline
                size="sm"
            />
        </div>
        <div class="graph-control-button-wrapper">
            <q-btn icon="mdi-cog-outline" rounded outline size="sm">
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
import { defineComponent } from 'vue';
import { useSigmaCamera } from 'components/mixins/sigma/instance';
import { toKebabCase } from 'src/utils/utils';

import type { PropType } from 'vue';
import type GraphingSection from 'components/workspace/graph/GraphingSection.vue';
import { useQuasar } from 'quasar';
import saveAsPNG from 'components/mixins/sigma/save-as-png';
import { useGraphLayouts } from 'components/mixins/sigma/layouts';

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
            type: Object as PropType<InstanceType<typeof GraphingSection>>,
        },
    },
    setup(props) {
        const { zoomIn, zoomOut, reset } = useSigmaCamera({
            factor: props.zoomFactor,
            duration: props.animationDuration,
        });

        const { notify } = useQuasar();

        const buttons = [
            {
                icon: 'mdi-plus-thick',
                callBack: () => zoomIn(),
            },
            {
                icon: 'mdi-minus-thick',
                callBack: () => zoomOut(),
            },
            {
                icon: toKebabCase('mdiArrowLeftRightBoldOutline'),
                callBack: () => reset(),
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
                            message:
                                'Fail To Copy Graph Serialization Due To Lack Of Browser Support',
                        });
                    }
                },
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
                                message: 'Copied Graph Image',
                            });
                        },
                        () => {
                            notify({
                                type: 'negative',
                                message: 'Failed To Copy Graph Image',
                            });
                        }
                    );
                },
            },
        ];

        const layouts = useGraphLayouts();

        return {
            buttons,
            layouts,
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
