<template>
    <q-splitter
        v-model="splitterPos"
        :style="heightStyle"
        :before-class="beforeClass"
        :after-class="afterClass"
        :separator-class="separatorClassS"
        :horizontal="horizontal"
    >
        <template #before>
            <slot name="before" />
        </template>
        <template #separator>
            <SplitterSeparator :horizontal="horizontal" />
        </template>
        <template #after>
            <slot name="after" />
        </template>
    </q-splitter>
</template>
<script lang="ts">
import SplitterSeparator from './SplitterSeparator.vue';
import { computed, defineComponent, PropType } from 'vue';
import { useQPageStyle } from 'components/mixins/qpage-height';

export default defineComponent({
    components: { SplitterSeparator },
    props: {
        horizontal: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: Number,
            default: 50,
        },
        beforeClass: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        separatorClass: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        afterClass: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    },
    emits: { 'update:modelValue': Number },
    setup(props, ctx) {
        const splitterPos = computed({
            get() {
                return props.modelValue;
            },
            set(n) {
                ctx.emit('update:modelValue', n);
            },
        });

        const heightStyle = useQPageStyle();

        const separatorClassS = computed(() => {
            return [
                props.horizontal
                    ? 'resizable-h-splitter-separator'
                    : 'resizable-v-splitter-separator',
                ...props.separatorClass,
            ];
        });

        return {
            splitterPos,
            separatorClassS,
            heightStyle,
        };
    },
});
</script>

<style lang="sass">
$splitter-line-width: 10px

.resizable-h-splitter-separator
    height: $splitter-line-width !important

.resizable-v-splitter-separator
    width: $splitter-line-width !important
</style>
