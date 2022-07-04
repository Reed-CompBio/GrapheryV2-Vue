<template>
    <div class="var-singular-element-wrapper">
        <VariableWrapper :info="info" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VariableWrapper from 'components/workspace/code-area/variable-area/VariableWrapper.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    components: { VariableWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
