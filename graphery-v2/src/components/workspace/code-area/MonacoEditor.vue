<template>
    <div id="editor-panel" class="full-height">
        <div :id="editorID" class="full-height"></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import type { PropType, ComputedRef } from 'vue';
import type monaco from 'monaco-editor';
import { debounce } from 'quasar';
import { StateTree, Store, storeToRefs } from 'pinia';
import {
    EditorInfo,
    getEditorInfo,
    initEditor,
} from 'src/components/mixins/editor-base';
import { useSettingsStorage } from 'stores/settings/settings-storage';
import { CodeType } from 'src/types/api-types';

const DEFAULT_EDITOR_ID = 'monaco-editor';

export default defineComponent({
    props: {
        options: {
            type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
            default: undefined,
        },
        value: {
            type: String,
            default: '',
        },
        debounceWait: {
            type: Number,
            default: 200,
        },
        editorId: {
            type: String,
            default: DEFAULT_EDITOR_ID,
        },
        storage: {
            type: Object as PropType<
                Store<
                    string,
                    StateTree,
                    { currentCode: CodeType; currentLine: number }
                >
            >,
            default: undefined,
        },
    },
    emits: { 'update:modelValue': String },
    setup(props, ctx) {
        const info = ref(getEditorInfo());

        type EditorComputedRef<T extends EditorInfo = EditorInfo> = ComputedRef<
            T['isDiffEditor'] extends true
                ? monaco.editor.IStandaloneDiffEditor
                : monaco.editor.IStandaloneCodeEditor | undefined
        >;

        const editorInstance = computed(
            () => info.value?.editor
        ) as EditorComputedRef;

        if (props.storage) {
            const { currentCode, currentLine } = storeToRefs(props.storage);
            watch(currentCode, (newVal) => {
                if (info.value && newVal) {
                    info.value?.editor?.getModel()?.setValue(newVal.code);
                }
            });
            watch(currentLine, (newVal) => {
                info.value?.moveToLine(newVal);
            });
        }

        const { editor } = storeToRefs(useSettingsStorage());

        watch(editor, (newVal) => {
            editorInstance.value?.updateOptions(newVal);
        });

        onMounted(() => {
            const editorElement = document.getElementById(
                props.editorId
            ) as HTMLElement;
            console.assert(editorElement !== null);

            info.value = initEditor(
                editorElement,
                props.options,
                props.editorId !== DEFAULT_EDITOR_ID
            );

            if (info.value) {
                const editor =
                    editorInstance.value as monaco.editor.IStandaloneCodeEditor;
                editor.getModel()?.onDidChangeContent(
                    debounce((editorEvent) => {
                        ctx.emit('update:modelValue', {
                            content: editor.getValue(),
                            event: editorEvent,
                        });
                    }, props.debounceWait)
                );

                if (props.storage) {
                    if (props.storage.currentCode.code) {
                        editor
                            .getModel()
                            ?.setValue(props.storage.currentCode.code);
                    }
                }
            }
        });

        return {
            editorID: props.editorId,
            editorInfo: info,
            editorInstance,
        };
    },
});
</script>

<style lang="sass">
@import 'src/css/editor'
</style>
