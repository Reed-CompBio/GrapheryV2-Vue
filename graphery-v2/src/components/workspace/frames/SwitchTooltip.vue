<template>
    <q-tooltip
        class="text-body1"
        :self="self"
        :anchor="anchor"
        :hide-delay="hideDelay"
    >
        {{ displayText }}
    </q-tooltip>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import type { PropType } from 'vue';
import type { QTooltipProps } from 'quasar';

export default defineComponent({
    props: {
        text: { type: String },
        translate: {
            type: Boolean,
        },
        anchor: {
            type: String as PropType<QTooltipProps['anchor']>,
            default: 'bottom middle',
        },
        self: {
            type: String as PropType<QTooltipProps['self']>,
            default: 'top middle',
        },
        hideDelay: { type: Number, default: 0 },
    },
    setup(props) {
        const displayText = computed(() => {
            if (props.translate) {
                const { t } = useI18n();
                return t(props.text ?? '');
            }
            return props.text;
        });
        return { displayText };
    },
});
</script>
