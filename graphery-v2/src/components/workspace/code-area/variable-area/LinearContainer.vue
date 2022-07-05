<template>
    <div class="var-linear-container-wrapper">
        <div v-if="info.isEmpty.value" class="var-empty-linear-container">
            <VariableWrapper :info="info" />
        </div>
        <div v-else class="var-linear-container">
            <div
                v-for="(element, index) in repr"
                :key="index"
                class="var-linear-container-element"
            >
                <VariableWrapper :info="element" :index="index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import VariableWrapper from 'components/workspace/code-area/variable-area/VariableWrapper.vue';

import type { VariableInfo } from 'components/mixins/variable-base';
import type { PropType } from 'vue';
import type {
    CompositionalObjectIdentityType,
    LinearContainerType,
} from 'src/types/execution-types';

export default defineComponent({
    components: { VariableWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo<LinearContainerType>>,
            required: true,
        },
    },
    setup(props) {
        const repr = computed<CompositionalObjectIdentityType[]>(
            () => props.info.variable.value.repr
        );
        return { repr };
    },
});
</script>
