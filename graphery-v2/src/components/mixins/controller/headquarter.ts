import mitt from 'mitt';
import type { EventType } from 'mitt';
import { markRaw } from 'vue';

export interface HighLightProtocol {
    id: string;
    highlight?: boolean;
    highlightColor: Iterable<string>;
}

export interface EventTypes extends Record<EventType, unknown> {
    // behind the scene
    replaceHighlight: HighLightProtocol[];
    removeHighlight: HighLightProtocol;
    addHighlight: HighLightProtocol;
    // breakpoint jumping
    jumpForward: undefined;
    jumpBackward: undefined;
    // stepping
    nextStep: undefined;
    previousStep: undefined;
    stepChangedTo: number;
    // executing
    executeRemotely: undefined;
    executeLocally: undefined;
    // editor change
    toggleEditorLock: undefined;
    copyCode: undefined;
    pasteCode: undefined;
    toggleVarList: undefined;
    toggleSettings: undefined;
    // workspace csv
    toggleSavesList: undefined;
    saveCurrent: undefined;
}

export const bus = markRaw(mitt<EventTypes>());

export function useBus() {
    return bus;
}
