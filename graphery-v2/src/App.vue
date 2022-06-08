<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent, ref, computed, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { SITE_NAME, NAVIGATION_BUTTONS } from 'src/utils/vars';
import { getScreenSizes } from 'components/mixins/screen-sizes';

export default defineComponent({
    name: 'App',
    setup() {
        const i18n = useI18n();
        const currentLang = computed({
            get() {
                return i18n.locale.value;
            },
            set(lang: string) {
                i18n.locale.value = lang;
            },
        });

        const _drawerState = ref(false);
        const drawerState = computed({
            get() {
                return _drawerState.value;
            },
            set(state: boolean) {
                _drawerState.value = state;
            },
        });

        provide('currentLang', currentLang);
        provide('drawerState', drawerState);

        getScreenSizes();

        return {
            SITE_NAME,
            NAVIGATION_BUTTONS,
            drawerState,
            currentLang,
        };
    },
});
</script>
