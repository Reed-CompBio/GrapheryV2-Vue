<template>
    <q-header class="q-px-xs">
        <!--    TODO change the color in dark mode    -->
        <q-toolbar>
            <!-- TODO Make it clickable -->

            <q-toolbar-title id="site-name-section" class="q-ml-lg">
                <router-link :to="{ name: 'Home' }" style="color: inherit">
                    {{ siteName }}
                </router-link>
            </q-toolbar-title>

            <div v-if="$q.screen.gt.sm">
                <!-- page buttons -->
                <q-btn
                    v-for="button in buttons"
                    :key="button.name"
                    flat
                    :to="{ name: button.name }"
                    class="q-ml-sm"
                    size="16px"
                    exact
                >
                    {{ t(`nav.${button.name}`) }}
                </q-btn>
            </div>
            <div id="language-switcher">
                <LangSelector :change-callback="changeLang" />
            </div>
            <q-btn v-if="$q.screen.lt.md" flat round dense size="20px">
                <q-icon name="mdi-menu" @click="showDrawer" />
            </q-btn>
        </q-toolbar>
    </q-header>
</template>

<script lang="ts">
import LangSelector from 'components/layout/LangSelector.vue';

import type { WritableComputedRef } from 'vue';
import { defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAVIGATION_BUTTONS, SITE_NAME } from 'src/utils/vars';

export default defineComponent({
    name: 'PageHeader',
    components: { LangSelector },
    setup() {
        const drawerState = inject(
            'drawerState'
        ) as WritableComputedRef<boolean>;
        function showDrawer() {
            drawerState.value = true;
        }

        const currentLang = inject(
            'currentLang'
        ) as WritableComputedRef<string>;
        function changeLang(lang: string) {
            currentLang.value = lang;
        }

        return {
            siteName: SITE_NAME,
            buttons: NAVIGATION_BUTTONS,
            showDrawer,
            changeLang,
            t: useI18n().t,
        };
    },
});
</script>

<style lang="sass">
#site-name-section
  font-family: 'Amiri', serif
  text-transform: uppercase
  font-size: 28px
  padding-top: 5px
.bg-header
  background: #870400
</style>
