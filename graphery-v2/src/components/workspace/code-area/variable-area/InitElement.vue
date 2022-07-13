<template>
    <div class="init-element-wrapper">
        <p>
            {{
                info.variable.repr ? info.variable.repr : 'Not Initialized Yet'
            }}
        </p>
    </div>
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

<style lang="sass">
.init-element-wrapper
    font-size: 1.2em
    color: #979797
    p
        margin: auto
</style>
