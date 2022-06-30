<template>
    <div class="var-header">
        <div class="var-header-wrapper row justify-center">
            <div class="var-header-left">
                <q-btn
                    :flat="stackBottom"
                    :outline="!stackBottom"
                    dense
                    size="md"
                    :disable="stackBottom"
                    icon="mdi-backburger"
                    @click="emitBackAction"
                ></q-btn>
            </div>
            <div class="var-header-center"></div>
            <div class="var-header-right"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useVariableBus } from 'components/mixins/controller/variable-bus';

import type { PropType } from 'vue';
import type { CompositionalObjectIdentityType } from 'src/types/execution-types';
import type { VariableHeaderInfo } from 'components/mixins/variable-base';

export default defineComponent({
    props: {
        variable: {
            type: Object as PropType<CompositionalObjectIdentityType>,
            default: null,
        },
        info: {
            type: Object as PropType<VariableHeaderInfo>,
            required: true,
        },
    },
    setup(props) {
        const stackBottom = computed(() => props.info.depth === 0);
        const bus = useVariableBus();

        function emitBackAction() {
            bus.emit('prop-var-stack', props.info.name);
        }
        const toggleIcon = computed(() => {
            // if (
            //     isSingularElement(this.element) ||
            //     isLinearContainerElement(this.element)
            // ) {
            //     if (this.toggleState) {
            //         return 'mdi-lightbulb';
            //     } else {
            //         return 'mdi-lightbulb-off-outline';
            //     }
            // } else if (isPairContainerElement(this.element)) {
            //     switch (this.toggleState) {
            //         case 1:
            //             return 'mdi-alpha-k';
            //         case 2:
            //             return 'mdi-alpha-v';
            //         case 0:
            //             return 'mdi-lightbulb-off-outline';
            //     }
            // }
            // which should never happen
            return 'mdi-close-circle-outline';
        });
        return { stackBottom, emitBackAction, toggleIcon };
    },
});
</script>
