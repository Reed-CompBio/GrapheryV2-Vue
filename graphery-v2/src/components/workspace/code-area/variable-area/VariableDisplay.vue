<template>
    <div class="var-display">
        <div
            class="var-display-singular"
            v-if="info.isSingular.value || info.isInit.value"
        ></div>
        <div
            class="var-display-linear-container"
            v-if="info.isLinearContainer.value"
        ></div>
        <div
            class="var-display-pair-container"
            v-if="info.isPairContainer.value"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
