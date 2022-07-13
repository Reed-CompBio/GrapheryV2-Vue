<template>
    <div class="var-variable-wrapper">
        <div
            v-if="
                wrappedInfo.isLinearContainer.value ||
                wrappedInfo.isPairContainer.value ||
                wrappedInfo.isRef.value
            "
            class="var-variable-wrapper-ref-repr"
        >
            <q-btn outline dense :label="refAbbrString">
                <!-- TODO: i18n -->
                <SwitchTooltip />
            </q-btn>
        </div>
        <div v-else class="var-variable-wrapper-singular-repr">
            <code>{{ wrappedInfo.variable.value.repr }}</code>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import SwitchTooltip from 'components/workspace/frames/SwitchTooltip.vue';
import { VariableInfoWrapper } from 'components/mixins/variable-base';

import type { PropType } from 'vue';
import type { VariableInfo } from 'components/mixins/variable-base';
import type { CompositionalObjectIdentityType } from 'src/types/execution-types';

const REF_ABBR_STRING = '...';

export default defineComponent({
    components: { SwitchTooltip },
    props: {
        info: {
            type: Object as PropType<
                VariableInfo | CompositionalObjectIdentityType
            >,
            required: true,
        },
        index: {
            type: Number as PropType<number | string>,
            default: -1,
        },
    },
    setup(props) {
        return {
            refAbbrString: REF_ABBR_STRING,
            wrappedInfo: computed(() => {
                if (props.info instanceof VariableInfoWrapper) {
                    return props.info;
                } else {
                    return new VariableInfoWrapper(
                        props.info as CompositionalObjectIdentityType,
                        ''
                    );
                }
            }),
        };
    },
});
</script>

<style lang="sass">
.var-variable-wrapper
    font-size: 1.2rem
</style>
