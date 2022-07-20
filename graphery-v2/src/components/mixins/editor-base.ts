import { editor, Range } from 'monaco-editor';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useHeadquarterStorage } from 'stores/headquarter/headquarter-storage';
import { markRaw, watch } from 'vue';
import { useHeadquarterBus } from './controller/headquarter-bus';

const eventBus = useHeadquarterBus();

export function initEditor(
    editorElement: HTMLElement,
    options?: editor.IStandaloneEditorConstructionOptions,
    customEditorInfo?: boolean
) {
    if (customEditorInfo) {
        return new EditorInfoContainer(editorElement, options);
    } else {
        editorInfo = new EditorInfoContainer(editorElement, options);
        return editorInfo;
    }
}

export interface DecorationState {
    breakpointDecoration: Map<number, string[]>;
    breakpointHintDecoration: string[];
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
    editor?: editor.IStandaloneCodeEditor;
    options?: editor.IStandaloneEditorConstructionOptions;
    decorationState: DecorationState;
    decorationOptions: DecorationOptions;

    constructor(
        editorElement: HTMLElement,
        editorOptions?: editor.IStandaloneEditorConstructionOptions
    ) {
        this.options = editorOptions;
        this.decorationState = {
            breakpointDecoration: new Map(),
            breakpointHintDecoration: [],
            moveDecoration: [],
        };
        this.decorationOptions = {
            breakpointDecoration: {
                marginClassName: 'breakpoint-dot',
            },
            breakpointHintDecoration: {
                marginClassName: 'breakpoint-dot-hint',
            },
            moveDecoration: {
                isWholeLine: true,
                className: 'exec-line-content-box',
                linesDecorationsClassName: 'exec-line-pointer',
            },
        };

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
                lineDecorationsWidth:
                    this.options?.lineDecorationsWidth ?? '25px',
                glyphMargin: true,
                value: '# Hello there :)',
            })
        );

        this._initCodeEditorEvents();
    }

    _initCodeEditorEvents() {
        if (!this.editor) {
            return;
        }

        this.editor.onMouseDown((event) => {
            if (
                event.target.type === editor.MouseTargetType.GUTTER_GLYPH_MARGIN
            ) {
                const line_no: number = event.target.position.lineNumber;
                this.toggleBreakpiont(line_no);
            }
        });

        this.editor.onMouseMove((event) => {
            let showBreakpointHintAtLineNumber = -1;

            if (
                event.target.position &&
                event.target.type === editor.MouseTargetType.GUTTER_GLYPH_MARGIN
            ) {
                const data = event.target.detail;
                if (!data.isAfterLines) {
                    showBreakpointHintAtLineNumber =
                        event.target.position.lineNumber;
                }
            }

            this.handleBreakpintHint(showBreakpointHintAtLineNumber);
        });
        this.editor.onMouseLeave(() => {
            this.handleBreakpintHint(-1);
        });

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.editor?.focus();
            }
        });

        const { currentLine } = storeToRefs(useHeadquarterStorage());
        watch(currentLine, (newVal) => {
            this.moveToLine(newVal);
        });

        const { notify } = useQuasar();

        eventBus.on('copy-editor-code', () => {
            if ('clipboard' in navigator) {
                const text = this.editor?.getValue();
                if (text) {
                    const type = 'text/plain';
                    const blob = new Blob([text], { type });
                    navigator.clipboard
                        .write([new ClipboardItem({ [type]: blob })])
                        .then(
                            () => {
                                notify({
                                    type: 'positive',
                                    message: 'Copied code successfully',
                                });
                            },
                            () => {
                                notify({
                                    type: 'negative',
                                    message: 'Copying code failed',
                                });
                            }
                        );
                } else {
                    notify({
                        type: 'negative',
                        message: 'Copying code failed due to editor failure',
                    });
                }
            } else {
                notify({
                    type: 'negative',
                    message:
                        'Cannot copy code due to the lack of browser support',
                });
            }
        });
    }

    handleBreakpintHint(line: number) {
        if (this.editor) {
            this.decorationState['breakpointHintDecoration'] =
                this.editor.deltaDecorations(
                    this.decorationState['breakpointHintDecoration'],
                    line === -1
                        ? []
                        : [
                              this.generateDecoration(
                                  'breakpointHintDecoration',
                                  line
                              ) as editor.IModelDeltaDecoration,
                          ]
                );
        }
    }

    // delta decorations
    // https://github.com/microsoft/vscode/blob/380ad48e3240676b48d96343f8ad565d4fea8063/src/vs/editor/common/model/textModel.ts#L1817
    moveToLine(line: number) {
        if (this.editor) {
            if (
                line > 0 &&
                line < (this.editor.getModel()?.getLineCount() ?? 0)
            ) {
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
            this.focusAtLine(line);
        }
    }

    focusAtLine(line: number) {
        this.editor?.revealLine(line);
    }

    toggleBreakpiont(line: number) {
        if (this.editor) {
            const oldDec =
                this.decorationState['breakpointDecoration'].get(line);

            if (oldDec === undefined) {
                // add new breakpiont
                eventBus.emit('add-breakpoint', line);
                const newDec = this.generateDecoration(
                    'breakpointDecoration',
                    line
                );

                this.decorationState['breakpointDecoration'].set(
                    line,
                    this.editor.deltaDecorations([], newDec ? [newDec] : [])
                );
            } else {
                // remove new breawkpoint
                eventBus.emit('remove-breakpoint', line);
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
                range: new Range(line, 1, line, 1),
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
