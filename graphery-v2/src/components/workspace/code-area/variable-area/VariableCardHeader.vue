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
                    <div>
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
import { defineComponent } from 'vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';
import { useQuasar } from 'quasar';
import SwitchTooltip from '../../frames/SwitchTooltip.vue';

const buttonSize = 'sm' as const;

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
        return {
            backAction,
            buttonSize,
            highlightAction,
            typeButtonClickHandler,
        };
    },
});
</script>

<style lang="sass">
.var-header-wrapper
    display: grid
    grid-template-columns: 1fr auto 1fr
    grid-gap: 8px
    justify-items: center
    padding: 4px 0

    .var-header-left
        margin-right: auto

    .var-header-right
        margin-left: auto
</style>
