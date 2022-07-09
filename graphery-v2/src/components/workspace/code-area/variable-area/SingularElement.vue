<template>
    <div class="var-singular-element-wrapper">
        <ElementWrapper :info="info" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ElementWrapper from 'components/workspace/code-area/variable-area/ElementWrapper.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    components: { ElementWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
