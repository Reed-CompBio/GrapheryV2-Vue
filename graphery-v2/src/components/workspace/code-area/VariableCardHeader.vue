<template>
    <div class="var-header">
        <div class="var-header-wrapper row justify-center">
            <div class="var-header-left"></div>
            <div class="var-header-center"></div>
            <div class="var-header-right"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { CompositionalObjectIdentityType } from 'src/types/execution-types';

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
