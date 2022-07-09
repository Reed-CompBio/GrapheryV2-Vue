<template>
    <div class="init-element-wrapper">
        <p>
            {{
                info.variable.value.repr
                    ? info.variable.value.repr
                    : 'Not Initialized Yet'
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
    height: 75px
    display: flex
    justify-content: center
    align-items: center
    font-size: 1.2em
    color: #999
    p
        margin: auto
</style>
