<template>
    <div id="graph-wrapper" class="full-height">
        <Graphing />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { GraphAnchor } from 'src/types/tutorial-types';
import Graphing from 'components/workspace/GraphingSection.vue';

export default defineComponent({
    components: { Graphing },
    props: {
        graphInfos: {
            type: Object as PropType<GraphAnchor[]>,
            default: undefined,
        },
    },
    setup() {
        return {};
    },
});
</script>
