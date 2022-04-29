<template>
    <q-btn-dropdown
        flat
        dense
        icon="mdi-translate"
        :label="showHeader ? currentLang.value : null"
    >
        <q-list>
            <q-item
                v-for="lang in availableLocales"
                :key="lang"
                clickable
                v-close-popup
                @click="changeCallback(lang)"
            >
                <q-item-section thumbnail class="q-px-sm">
                    <q-icon
                        v-if="currentLang.value === lang"
                        color="primary"
                        name="keyboard_arrow_right"
                    />
                    <q-icon v-else color="primary" name="mdi-blank" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="lang-label">{{ lang }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, inject } from 'vue';

export default defineComponent({
    props: ['changeCallback', 'showHeader'],
    setup() {
        const { availableLocales } = useI18n();
        const currentLang = inject('currentLang');

        return {
            availableLocales,
            currentLang,
        };
    },
});
</script>

<style lang="sass">
.lang-label
  text-align: center
  text-transform: uppercase
  font-weight: bold
</style>
