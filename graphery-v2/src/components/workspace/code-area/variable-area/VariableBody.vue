<template>
    <div class="var-body">
        <div v-if="info.isInit" class="var-body-init">
            <InitElement :info="info" />
        </div>
        <div v-else-if="info.isEdgeObject" class="var-body-edge">
            <EdgeElement :info="info" />
        </div>
        <div v-else-if="info.isSingular" class="var-body-singular">
            <ElementWrapper :info="info" :parent="info" />
        </div>
        <div
            v-else-if="info.isLinearContainer"
            class="var-body-linear-container"
        >
            <LinearContainer :info="info" />
        </div>
        <div v-else-if="info.isPairContainer" class="var-body-pair-container">
            <PairContainer :info="info" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ElementWrapper from 'components/workspace/code-area/variable-area/ElementWrapper.vue';
import LinearContainer from 'components/workspace/code-area/variable-area/LinearContainer.vue';
import PairContainer from 'components/workspace/code-area/variable-area/PairContainer.vue';
import InitElement from 'components/workspace/code-area/variable-area/InitElement.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';
import EdgeElement from './EdgeElement.vue';

export default defineComponent({
    components: {
        PairContainer,
        LinearContainer,
        ElementWrapper,
        InitElement,
        EdgeElement,
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
    padding: 8px 3px

.var-element-iterable
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: aut
</style>
