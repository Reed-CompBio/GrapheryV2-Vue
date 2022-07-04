import { markRaw } from 'vue';
import mitt from 'mitt';
import type { EventType } from 'mitt';

export interface EventDefTypes extends Record<EventType, unknown> {
    'pop-var-stack': string;
    'push-var-stack': string;
    'adjust-var-order': { varId: string; order: number };
}

export const bus = markRaw(mitt<EventDefTypes>());

export function useVariableBus() {
    return bus;
}
