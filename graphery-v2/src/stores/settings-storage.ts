import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { EditorSettings } from 'stores/settings-storage-types';
import { useHeadquarterBus } from 'components/mixins/controller/headquarter-bus';

export const useSettingsStorage = defineStore('settings', () => {
    const editor = reactive<EditorSettings>({
        readOnly: false,
    });

    const eventBus = useHeadquarterBus();

    eventBus.on('toggle-editor-lock', () => {
        editor.readOnly = !editor.readOnly;
    });

    return { editor };
});
