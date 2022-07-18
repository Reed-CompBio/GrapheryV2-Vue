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
import { storeToRefs } from 'pinia';
import { useHeadquarterStorage } from 'stores/headquarter/headquarter-storage';
import {
    EditorInfo,
    getEditorInfo,
    initEditor,
} from 'src/components/mixins/editor-base';
import { useSettingsStorage } from 'src/stores/settings-storage';

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
        isDiffEditor: {
            type: Boolean,
            default: false,
        },
        original: {
            type: String,
            default: undefined,
        },
        debounceWait: {
            type: Number,
            default: 200,
        },
    },
    emits: { 'update:modelValue': String },
    setup(props, ctx) {
        const _editorID = 'monaco-editor';
        const info = ref(getEditorInfo());

        type EditorComputedRef<T extends EditorInfo = EditorInfo> = ComputedRef<
            T['isDiffEditor'] extends true
                ? monaco.editor.IStandaloneDiffEditor
                : monaco.editor.IStandaloneCodeEditor | undefined
        >;

        const editorInstance = computed(
            () => info.value?.editor
        ) as EditorComputedRef;

        const { currentCode } = storeToRefs(useHeadquarterStorage());
        watch(currentCode, (newVal) => {
            if (info.value && !info.value.isDiffEditor && newVal) {
                info.value?.editor?.getModel()?.setValue(newVal.code);
            }
        });

        const { editor } = storeToRefs(useSettingsStorage());

        watch(editor, (newVal) => {
            editorInstance.value?.updateOptions(newVal);
        });

        onMounted(() => {
            const editorElement = document.getElementById(
                _editorID
            ) as HTMLElement;
            console.assert(editorElement !== null);

            info.value = initEditor(
                editorElement,
                props.isDiffEditor,
                props.options
            );

            if (info.value && !info.value.isDiffEditor) {
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

                if (currentCode.value) {
                    editor.getModel()?.setValue(currentCode.value.code);
                }
            }
        });

        return {
            editorID: _editorID,
            editorInfo: info,
            editorInstance,
        };
    },
});
</script>

<style lang="sass">
@import 'src/css/editor'
</style>
