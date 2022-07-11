import monaco, { editor } from 'monaco-editor';
import { markRaw } from 'vue';

export function initEditor(
    editorElement: HTMLElement,
    isDiffEditor = false,
    options?: editor.IStandaloneEditorConstructionOptions
) {
    editorInfo = new EditorInfoContainer(editorElement, isDiffEditor, options);
    return editorInfo;
}

export interface DecorationState {
    breakpointDecoration: Map<number, string[]>;
    moveDecoration: string[];
}

export type DecorationOptions = Record<
    keyof DecorationState,
    editor.IModelDecorationOptions
>;

export interface EditorInfo<T extends boolean = boolean> {
    isDiffEditor?: T;
    editor?: editor.IStandaloneCodeEditor;
    diffEditor?: editor.IStandaloneDiffEditor;
    options?: editor.IStandaloneEditorConstructionOptions;
    diffEditorOriginal?: string;
    decorationState: DecorationState;
    decorationOptions: DecorationOptions;
}

export class EditorInfoContainer<T extends boolean = boolean>
    implements EditorInfo<T>
{
    isDiffEditor?: T;
    editor?: editor.IStandaloneCodeEditor;
    diffEditor?: editor.IStandaloneDiffEditor;
    options?: editor.IStandaloneEditorConstructionOptions;
    diffEditorOriginal?: string;
    decorationState: DecorationState;
    decorationOptions: DecorationOptions;

    constructor(
        editorElement: HTMLElement,
        isDiffEditor: T,
        editorOptions?: editor.IStandaloneEditorConstructionOptions
    ) {
        this.options = editorOptions;
        this.isDiffEditor = isDiffEditor;
        this.decorationState = {
            breakpointDecoration: new Map(),
            moveDecoration: [],
        };
        this.decorationOptions = {
            breakpointDecoration: {},
            moveDecoration: {},
        };

        if (this.isDiffEditor) {
            this.diffEditor = markRaw(
                editor.createDiffEditor(editorElement, {
                    fontSize: this.options?.fontSize,
                    foldingStrategy: 'indentation', // fold text by indentation
                    automaticLayout: true, // auto resize
                    overviewRulerBorder: false, // scroll bar no boarder
                    scrollBeyondLastLine: false, // remove blank space at the end of the editor
                    readOnly: this.options?.readOnly,
                    theme: this.options?.theme ? 'vs-dark' : 'vs',
                    wordWrap: this.options?.wordWrap,
                    minimap: this.options?.minimap,
                    glyphMargin: true,
                })
            );
        } else {
            this.editor = markRaw(
                editor.create(editorElement, {
                    fontSize: this.options?.fontSize,
                    foldingStrategy: 'indentation', // fold text by indentation
                    automaticLayout: true, // auto resize
                    overviewRulerBorder: false, // scroll bar no boarder
                    scrollBeyondLastLine: false, // remove blank space at the end of the editor
                    readOnly: this.options?.readOnly,
                    theme: this.options?.theme ? 'vs-dark' : 'vs',
                    language: this.options?.language ?? 'python',
                    wordWrap: this.options?.wordWrap,
                    minimap: this.options?.minimap,
                    glyphMargin: true,
                    value: '# Hello there :)',
                })
            );
        }
    }

    _initCodeEditorEvents(codeEditor: editor.IStandaloneCodeEditor) {
        codeEditor.onMouseDown((event) => {
            if (
                event.target.type === editor.MouseTargetType.GUTTER_LINE_NUMBERS
            ) {
                const line_no: number = event.target.position.lineNumber;
                this.toggleBreakpiont(line_no);
            }
        });
    }

    // https://github.com/microsoft/vscode/blob/380ad48e3240676b48d96343f8ad565d4fea8063/src/vs/editor/common/model/textModel.ts#L1817
    moveToLine(line: number) {
        if (this.editor) {
            const newDecoration = this.generateDecoration(
                'moveDecoration',
                line
            );
            this.decorationState['moveDecoration'] =
                this.editor.deltaDecorations(
                    this.decorationState['moveDecoration'],
                    newDecoration ? [newDecoration] : []
                );
        }
    }

    toggleBreakpiont(line: number) {
        if (this.editor) {
            const oldDec =
                this.decorationState['breakpointDecoration'].get(line);

            if (oldDec === undefined) {
                const newDec = this.generateDecoration(
                    'breakpointDecoration',
                    line
                );

                this.decorationState['breakpointDecoration'].set(
                    line,
                    this.editor.deltaDecorations([], newDec ? [newDec] : [])
                );
            } else {
                this.decorationState['breakpointDecoration'].set(
                    line,
                    this.editor.deltaDecorations(oldDec, [])
                );
                this.decorationState['breakpointDecoration'].delete(line);
            }
        }
    }

    generateDecoration(
        type: keyof DecorationState,
        line: number,
        options?: editor.IDecorationOptions
    ): editor.IModelDeltaDecoration | null {
        if (this.editor) {
            return {
                range: new monaco.Range(line, 1, line, 1),
                options: { ...this.decorationOptions[type], ...options },
            };
        } else return null;
    }

    focusToLine(line: number, scrollType?: editor.ScrollType) {
        if (this.editor) {
            this.editor.revealLine(line, scrollType);
        }
    }
}

let editorInfo: EditorInfoContainer | null = null;

export function getEditorInfo() {
    return editorInfo;
}
