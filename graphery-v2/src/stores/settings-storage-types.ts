import type { editor } from 'monaco-editor';

export interface EditorSettings
    extends Partial<editor.IStandaloneEditorConstructionOptions> {
    theme?: 'vs-dark' | 'vs';
    localExecutionPort: number;
}
