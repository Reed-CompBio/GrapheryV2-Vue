<template>
    <q-card>
        <VariableCardHeader :info="info" />
        <q-separator />
        <VariableDisplay :info="info" />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VariableCardHeader from 'components/workspace/code-area/variable-area/VariableCardHeader.vue';
import VariableDisplay from 'components/workspace/code-area/variable-area/VariableBody.vue';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';

export default defineComponent({
    components: { VariableDisplay, VariableCardHeader },
    props: {
        info: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
});
</script>
