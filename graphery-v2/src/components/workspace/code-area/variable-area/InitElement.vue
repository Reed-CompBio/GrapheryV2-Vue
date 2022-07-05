<template>
    <div></div>
</template>

<script lang="ts">
import type { VariableInfo } from 'components/mixins/variable-base';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
