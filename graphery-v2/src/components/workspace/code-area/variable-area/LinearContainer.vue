<template>
    <div class="var-linear-container-wrapper">
        <div v-if="info.isEmpty" class="var-empty-linear-container">
            <ElementWrapper :info="info" :parent="info" />
        </div>
        <div v-else class="var-linear-container var-element-iterable">
            <div
                v-for="(element, index) in repr"
                :key="index"
                class="var-linear-container-element"
            >
                <ElementWrapper
                    :info="element"
                    :parent="info"
                    :index="linearIndexFormatter(element, index)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ElementWrapper from 'components/workspace/code-area/variable-area/ElementWrapper.vue';
import { isSubscriptable } from 'src/types/execution-types';

import type { VariableInfo } from 'components/mixins/variable-base';
import type { PropType } from 'vue';
import type {
    CompositionalObjectIdentityType,
    LinearContainerType,
} from 'src/types/execution-types';

export default defineComponent({
    components: { ElementWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo<LinearContainerType>>,
            required: true,
        },
    },
    setup(props) {
        const repr = computed<CompositionalObjectIdentityType[]>(
            () => props.info.variable.repr
        );

        function linearIndexFormatter(
            variable: CompositionalObjectIdentityType,
            index: number
        ) {
            if (isSubscriptable(variable)) {
                return `[${index}]`;
            } else {
                return `|${index}|`;
            }
        }

        return { repr, linearIndexFormatter };
    },
});
</script>
