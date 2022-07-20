<template>
    <q-page :style-fn="QPageStyleFn">
        <router-view />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QPageStyleFn, useQPageStyle } from 'components/mixins/qpage-height';

export default defineComponent({
    setup() {
        const fullStyle = useQPageStyle();
        return { QPageStyleFn, fullStyle };
    },
});
</script>
