import mitt from 'mitt';
import type { EventType } from 'mitt';
import { markRaw } from 'vue';

export interface EventDefTypes extends Record<EventType, unknown> {
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
    'toggle-editor-lock': undefined;
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

export function useHeadquarterBus() {
    return bus;
}
