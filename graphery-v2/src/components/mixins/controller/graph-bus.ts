import { markRaw } from 'vue';
import mitt from 'mitt';
import type { EventType } from 'mitt';

export interface HighLightProtocol {
    id: string;
    highlightColor: string[] | Set<string> | string;
}

export interface EventDefTypes extends Record<EventType, unknown> {
    'clear-highlight': undefined;
    'replace-highlight': HighLightProtocol[];
    'remove-highlight': HighLightProtocol;
    'add-highlight': HighLightProtocol;
}

export const bus = markRaw(mitt<EventDefTypes>());

export function useGraphBus() {
    return bus;
}
