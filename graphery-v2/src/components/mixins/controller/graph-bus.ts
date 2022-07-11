import { markRaw } from 'vue';
import mitt from 'mitt';
import type { EventType } from 'mitt';
import { CompositionalObjectIdentityType } from 'src/types/execution-types';

export interface HighLightProtocol {
    variable: CompositionalObjectIdentityType;
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
