<template>
    <div id="editor-panel" class="full-height">
        <div :id="editorID" class="full-height"></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, reactive } from 'vue';
import type { PropType, ComputedRef } from 'vue';
import type monaco from 'monaco-editor';
import { debounce } from 'quasar';

function initEditor(editorId: string, info: EditorInfo) {
    return import('monaco-editor').then((monacoEditor) => {
        const anchorEle = document.getElementById(editorId);
        if (anchorEle) {
            const { options } = info;
            info.editor = markRaw(
                monacoEditor.editor[
                    info.isDiffEditor ? 'createDiffEditor' : 'create'
                ](anchorEle, {
                    fontSize: options?.fontSize,
                    foldingStrategy: 'indentation', // fold text by indentation
                    automaticLayout: true, // auto resize
                    overviewRulerBorder: false, // scroll bar no boarder
                    scrollBeyondLastLine: false, // remove blank space at the end of the editor
                    readOnly: options?.readOnly,
                    theme: options?.theme ? 'vs-dark' : 'vs',
                    language: options?.language ?? 'python',
                    wordWrap: options?.wordWrap,
                    minimap: options?.minimap,
                    glyphMargin: true,
                    value: 'var = "test value"',
                })
            );
        }

        return info;
    });
}

interface EditorInfo<T extends boolean = boolean> {
    isDiffEditor?: T;
    editor?: T extends true
        ? monaco.editor.IStandaloneDiffEditor
        : monaco.editor.IStandaloneCodeEditor;
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
    diffEditorOriginal?: string;
}

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
    setup(props, ctx) {
        const _editorID = 'monaco-editor';
        const info = reactive<EditorInfo>({
            options: { ...props.options },
            isDiffEditor: props.isDiffEditor,
            diffEditorOriginal: props.original,
        });

        type EditorComputedRef<T extends EditorInfo = EditorInfo> = ComputedRef<
            T['isDiffEditor'] extends true
                ? monaco.editor.IStandaloneDiffEditor
                : monaco.editor.IStandaloneCodeEditor | undefined
        >;

        const editorInstance = computed(() => info.editor) as EditorComputedRef;

        initEditor(_editorID, info).then(() => {
            if (!info.isDiffEditor) {
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
