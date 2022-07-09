<template>
    <q-card>
        <VariableCardHeader :info="info" />
        <q-separator />
        <VariableBody :info="info" />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VariableCardHeader from 'components/workspace/code-area/variable-area/VariableCardHeader.vue';
import VariableBody from 'components/workspace/code-area/variable-area/VariableBody.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    components: { VariableBody, VariableCardHeader },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
