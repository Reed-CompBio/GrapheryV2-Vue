import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { EditorSettings } from 'stores/settings/settings-storage-types';
import { useHeadquarterBus } from 'components/mixins/controller/headquarter-bus';
import { LOCAL_EXECUTION_URL } from 'src/utils/vars';

export const useSettingsStorage = defineStore('settings', () => {
    const editor = reactive<EditorSettings>({
        readOnly: false,
        localExecutionPort: 7590,
    });

    const eventBus = useHeadquarterBus();

    eventBus.on('toggle-editor-lock', () => {
        editor.readOnly = !editor.readOnly;
    });

    const localExecutionURL = computed(
        () => `${LOCAL_EXECUTION_URL}:${editor.localExecutionPort}/run`
    );

    return { editor, localExecutionURL };
});
