<template>
    <div class="var-pair-container-wrapper">
        <div v-if="info.isEmpty.value" class="var-pair-container-empty">
            <VariableWrapper :info="info" />
        </div>
        <div v-else class="var-pair-container">
            <div
                class="var-pair-container-element"
                v-for="(element, index) in repr"
                :key="index"
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
import type { PairContainerType } from 'src/types/execution-types';

export default defineComponent({
    components: { VariableWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo<PairContainerType>>,
            required: true,
        },
    },
    setup(props) {
        return {
            repr: computed(() => props.info.variable.value.repr),
        };
    },
});
</script>
