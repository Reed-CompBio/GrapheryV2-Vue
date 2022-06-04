<template>
    <q-page :style-fn="QPageStyleFn">
        <router-view></router-view>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QPageStyleFn } from 'components/mixins/qpage-height';

export default defineComponent({
    setup() {
        return {
            QPageStyleFn,
        };
    },
});
</script>
