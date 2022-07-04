<template>
    <div class="var-header">
        <div class="var-header-wrapper row justify-center">
            <div class="var-header-left">
                <q-btn
                    :flat="info.stackBottom.value"
                    :outline="!info.stackBottom.value"
                    dense
                    :size="buttonSize"
                    :disable="info.stackBottom.value"
                    icon="mdi-backburger"
                    @click="emitBackAction"
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
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVariableBus } from 'components/mixins/controller/variable-bus';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

const buttonSize = 'md' as const;

export default defineComponent({
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
    setup(props) {
        const bus = useVariableBus();

        function emitBackAction() {
            bus.emit('prop-var-stack', props.info.baseLabel);
        }

        function highlightAction() {
            // TODO
            return null;
        }

        function typeButtonClickHandler() {
            // TODO
            return null;
        }

        return {
            emitBackAction,
            buttonSize,
            highlightAction,
            typeButtonClickHandler,
        };
    },
});
</script>
