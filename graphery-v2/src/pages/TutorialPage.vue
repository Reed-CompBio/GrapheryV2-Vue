<template>
    <div class="full-size">
        <!--   Left and Right splitter    -->
        <FullHeightSplitter v-model="leftRightSplitterPos">
            <template v-slot:before>
                <FullHeightSplitter v-model="upDownSplitterPos" horizontal>
                    <template v-slot:before>
                        <p>up</p>
                    </template>
                    <template v-slot:after>
                        <p>down</p>
                    </template>
                </FullHeightSplitter>
            </template>
            <template v-slot:after>
                <div>
                    <p>Right Panel</p>
                </div>
            </template>
        </FullHeightSplitter>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FullHeightSplitter from 'components/workspace/FullHeightSplitter.vue';

export default defineComponent({
    components: { FullHeightSplitter },
    setup() {
        const leftRightSplitterPos = ref(50);
        const upDownSplitterPos = ref(50);

        return {
            leftRightSplitterPos,
            upDownSplitterPos,
        };
    },
});
</script>
