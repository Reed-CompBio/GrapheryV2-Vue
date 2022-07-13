<template>
    <div class="var-header">
        <div class="var-header-wrapper">
            <div class="var-header-left">
                <q-btn
                    :flat="info.stackBottom.value"
                    :outline="!info.stackBottom.value"
                    dense
                    :size="buttonSize"
                    :disable="info.stackBottom.value"
                    icon="mdi-backburger"
                    @click="backAction"
                ></q-btn>
            </div>
            <div class="var-header-center">
                <div class="row justify-center">
                    <div class="var-header-title" :style="titleStyle">
                        <code>
                            {{ info.fullLabel.value }}
                        </code>
                    </div>
                </div>
            </div>
            <div class="var-header-right">
                <div class="row justify-right no-wrap">
                    <q-btn
                        :flat="info.isInit.value"
                        :outline="!info.isInit.value"
                        dense
                        :disable="info.isInit.value"
                        :size="buttonSize"
                        :icon="info.highlightToggleIcon.value"
                        @click="highlightAction"
                    ></q-btn>
                    <q-btn
                        flat
                        dense
                        :size="buttonSize"
                        :icon="info.typeIcon.value"
                        @click="typeButtonClickHandler"
                    >
                        <SwitchTooltip :text="info.typeDescription" />
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';
import { useQuasar } from 'quasar';
import SwitchTooltip from '../../frames/SwitchTooltip.vue';

const buttonSize = 'sm' as const;
const titleColorAlpha = 60 as const;

export default defineComponent({
    components: { SwitchTooltip },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
    setup(props) {
        const { notify } = useQuasar();
        function backAction() {
            props.info.popStack();
        }
        function highlightAction() {
            props.info.toggleHighlight();
        }
        function typeButtonClickHandler() {
            notify({
                message: props.info.typeDescription,
                type: 'info',
            });
        }
        const titleStyle = computed(() => ({
            'background-color': `${props.info.variable.value.color}${titleColorAlpha}`,
        }));
        return {
            backAction,
            buttonSize,
            highlightAction,
            typeButtonClickHandler,
            titleStyle,
        };
    },
});
</script>

<style lang="sass">
.var-header-wrapper
    display: grid
    grid-template-columns: 1fr 97fr 2fr
    grid-gap: 8px
    justify-items: center
    padding: 5px 8px

    .var-header-left
        margin-right: auto

    .var-header-right
        margin-left: auto

    .var-header-title
        padding: 0 5px
        border-radius: 5px
</style>
