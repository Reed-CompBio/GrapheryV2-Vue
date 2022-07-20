<template>
    <q-tabs
        v-model="tabModel"
        :inline-label="inlineLabels"
        :shrink="shrink"
        dense
    >
        <q-tab
            v-for="(tab, index) in tabSelection"
            :key="index"
            :label="tab.label"
            :name="tab.name"
            :icon="tab.icon"
            :tabindex="index"
        />
    </q-tabs>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';

interface ITabSelection {
    label: string;
    name: string;
    icon?: string;
}

export default defineComponent({
    props: {
        tabSelection: {
            type: Object as PropType<ITabSelection[]>,
            default: undefined,
        },
        modelValue: {
            type: String,
            default: '',
        },
        inlineLabels: {
            type: Boolean,
            default: true,
        },
        shrink: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const tabModel = computed({
            get() {
                return props.modelValue;
            },
            set(v) {
                ctx.emit('update:modelValue', v);
            },
        });

        return { tabModel };
    },
});
</script>
