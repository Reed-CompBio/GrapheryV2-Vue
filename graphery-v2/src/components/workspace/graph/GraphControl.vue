<template>
    <div id="graph-control-wrapper" :class="vertical ? 'col' : 'row'">
        <div v-for="button in buttons" :key="button.icon">
            <q-btn :icon="button.icon" @click="button.callBack" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSigmaCamera } from 'components/mixins/sigma/instance';

export default defineComponent({
    props: {
        vertical: {
            type: Boolean,
            default: false,
        },
        animationDuration: {
            type: Number,
            default: 200,
        },
        zoomFactor: {
            type: Number,
            default: 1.5,
        },
    },
    setup(props) {
        const { zoomIn, zoomOut } = useSigmaCamera({
            factor: props.zoomFactor,
            duration: props.animationDuration,
        });

        const buttons = [
            {
                icon: 'mdi-plus-thick',
                callBack: () => zoomIn(),
            },
            {
                icon: 'mdi-minus-thick',
                callBack: () => zoomOut(),
            },
        ];
        return {
            buttons,
        };
    },
});
</script>
