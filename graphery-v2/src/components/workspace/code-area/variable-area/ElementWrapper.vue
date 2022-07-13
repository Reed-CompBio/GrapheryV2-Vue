<template>
    <div class="var-variable-wrapper">
        <div
            v-if="
                wrappedInfo.isLinearContainer ||
                wrappedInfo.isPairContainer ||
                wrappedInfo.isRef
            "
            class="var-variable-wrapper-ref-repr"
        >
            <q-btn outline dense :label="refAbbrString" @click="handleRef">
                <!-- TODO: i18n -->
                <SwitchTooltip text="go to reference" />
            </q-btn>
        </div>
        <div v-else class="var-variable-wrapper-singular-repr">
            <code>{{ wrappedInfo.variable.repr }}</code>
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
            type: String,
            default: '',
        },
        parent: {
            type: Object as PropType<VariableInfo>,
            required: true,
        },
    },
    setup(props) {
        const wrappedInfo = computed(() => {
            if (props.info instanceof VariableInfoWrapper) {
                return props.info;
            } else {
                return new VariableInfoWrapper(
                    props.info as CompositionalObjectIdentityType,
                    ''
                );
            }
        });

        function handleRef() {
            if (wrappedInfo.value.isRef) {
                props.parent.pushStack({
                    refId: wrappedInfo.value.variable.pythonId,
                    label: props.index,
                });
            } else {
                props.parent.pushStack({
                    variable: wrappedInfo.value.variable,
                    label: props.index,
                });
            }
        }

        return {
            handleRef,
            refAbbrString: REF_ABBR_STRING,
            wrappedInfo,
        };
    },
});
</script>

<style lang="sass">
.var-variable-wrapper
    font-size: 1.2rem
</style>
