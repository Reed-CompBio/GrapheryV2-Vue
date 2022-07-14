<template>
    <q-card>
        <VariableCardHeader :info="wrappedInfo" />
        <q-separator />
        <VariableBody :info="wrappedInfo" />
    </q-card>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import VariableCardHeader from 'components/workspace/code-area/variable-area/VariableCardHeader.vue';
import VariableBody from 'components/workspace/code-area/variable-area/VariableBody.vue';

import type { PropType } from 'vue';
import { VariableInfoWrapper } from 'components/mixins/variable-base';
import { CompositionalObjectIdentityType } from 'src/types/execution-types';

export default defineComponent({
    components: { VariableBody, VariableCardHeader },
    props: {
        info: {
            type: Object as PropType<
                CompositionalObjectIdentityType & { label: string }
            >,
            required: true,
        },
    },
    setup(props) {
        const wrappedInfo = reactive(
            new VariableInfoWrapper(props.info, props.info.label)
        );

        watch(
            () => props.info,
            () => {
                wrappedInfo.updateBase(props.info);
                wrappedInfo.requestHighlight();
            }
        );

        return {
            wrappedInfo,
        };
    },
});
</script>
