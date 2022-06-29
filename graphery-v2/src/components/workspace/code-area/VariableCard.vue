<template>
    <q-card> </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { CompositionalObjectIdentityType } from 'src/types/execution-types';
import type { PropType } from 'vue';

export default defineComponent({
    props: {
        variable: {
            type: Object as PropType<CompositionalObjectIdentityType>,
            default: null,
        },
    },
    setup() {
        return {};
    },
});
</script>
