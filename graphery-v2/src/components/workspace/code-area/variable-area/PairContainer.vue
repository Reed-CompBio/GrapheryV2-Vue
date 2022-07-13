<template>
    <div class="var-pair-container-wrapper">
        <div v-if="info.isEmpty.value" class="var-pair-container-empty">
            <ElementWrapper :info="info" :parent="info" />
        </div>
        <div v-else class="var-pair-container var-element-iterable">
            <div
                v-for="(element, index) in repr"
                :key="index"
                class="var-pair-container-element"
            >
                <ElementWrapper
                    :info="element.key"
                    :parent="info"
                    :index="pairIndexFormatter(element.key.repr, 'key')"
                />
                <div class="var-pair-container-separator">
                    {{ keyValueSeparator }}
                </div>
                <ElementWrapper
                    :info="element.value"
                    :parent="info"
                    :index="pairIndexFormatter(element.key.repr, 'value')"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ElementWrapper from 'components/workspace/code-area/variable-area/ElementWrapper.vue';

import type { VariableInfo } from 'components/mixins/variable-base';
import type { PropType } from 'vue';
import type { PairContainerType } from 'src/types/execution-types';

export default defineComponent({
    components: { ElementWrapper },
    props: {
        info: {
            type: Object as PropType<VariableInfo<PairContainerType>>,
            required: true,
        },
    },
    setup(props) {
        function pairIndexFormatter(
            repr: string | object,
            type: 'key' | 'value'
        ) {
            if (type === 'key') {
                return `.key(${typeof repr === 'string' ? repr : '<object>'})`;
            } else {
                return `[${typeof repr === 'string' ? repr : '<object>'}]`;
            }
        }
        return {
            repr: computed(() => props.info.variable.value.repr),
            keyValueSeparator: ':',
            pairIndexFormatter,
        };
    },
});
</script>

<style lang="sass">
.var-pair-container-element
    display: grid
    grid-template-columns: 20fr 1fr 20fr
</style>
