<template>
    <div class="var-body">
        <div v-if="info.isInit.value" class="var-body-init">
            <InitElement :info="info" />
        </div>
        <div v-if="info.isSingular.value" class="var-body-singular">
            <SingularElement :info="info" />
        </div>
        <div
            v-if="info.isLinearContainer.value"
            class="var-body-linear-container"
        >
            <LinearContainer :info="info" />
        </div>
        <div v-if="info.isPairContainer.value" class="var-body-pair-container">
            <PairContainer :info="info" />
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

<style lang="sass">
@use 'src/css/quasar.variables' as vars

.var-body
    min-height: vars.$variable-body-min-height
    text-align: center
    display: flex
    justify-content: center
    align-items: center
</style>
