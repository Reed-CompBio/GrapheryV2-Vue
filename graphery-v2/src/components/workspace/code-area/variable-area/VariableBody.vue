<template>
    <div class="var-display">
        <div
            class="var-display-singular"
            v-if="info.isSingular.value || info.isInit.value"
        >
            <SingularElement :info="info" />
        </div>
        <div
            class="var-display-linear-container"
            v-if="info.isLinearContainer.value"
        >
            <LinearContainer :info="info" />
        </div>
        <div
            class="var-display-pair-container"
            v-if="info.isPairContainer.value"
        >
            <PairContainer :info="info" />
        </div>
        <div class="var-display-init" v-if="info.isInit">
            <InitElement :info="info" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingularElement from 'components/workspace/code-area/variable-area/SingularElement.vue';
import LinearContainer from 'components/workspace/code-area/variable-area/LinearContainer.vue';
import PairContainer from 'components/workspace/code-area/variable-area/PairContainer.vue';
import InitElement from 'components/workspace/code-area/variable-area/InitElement.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    components: {
        PairContainer,
        LinearContainer,
        SingularElement,
        InitElement,
    },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
