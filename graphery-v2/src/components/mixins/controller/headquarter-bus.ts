import mitt from 'mitt';
import type { EventType } from 'mitt';
import { markRaw } from 'vue';

export interface HighLightProtocol {
    id: string;
    highlight?: boolean;
    highlightColor: Iterable<string>;
}

export interface EventDefTypes extends Record<EventType, unknown> {
    // behind the scene
    'replace-highlight': HighLightProtocol[];
    'remove-highlight': HighLightProtocol;
    'add-highlight': HighLightProtocol;
    'fetch-graph': { graphAnchorId?: string; codeAnchorId?: string };
    'fetch-code': { codeId?: string; graphAnchorId?: string };
    'fetch-tutorial': { url: string; lang?: string };
    'load-graph-anchor': string;
    'load-code': string;
    'reset-states': undefined;
    // breakpoint jumping
    'jump-forward': undefined;
    'jump-backward': undefined;
    'add-breakpoint': number;
    'remove-breakpoint': number;
    // stepping
    'next-step': undefined;
    'previous-step': undefined;
    'step-changed-to': number | null;
    // executing
    'execute-remotely': undefined;
    'execute-locally': undefined;
    // editor change
    'toggle-editorLock': undefined;
    'copy-editor-code': undefined;
    'paste-editor-code': undefined;
    'toggle-var-list': undefined;
    'toggle-settings': undefined;
    // workspace vcs
    'toggle-vcs-list': undefined;
    'save-current-to-vcs': undefined;
}

export type EventTypes = keyof EventDefTypes;

export const bus = markRaw(mitt<EventDefTypes>());

export function useBus() {
    return bus;
}
