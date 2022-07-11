import mitt from 'mitt';
import type { EventType } from 'mitt';
import { markRaw } from 'vue';
/**
 * <event>Success is used to indicate if an event is successfully executed or not
 * The type is boolean | undefined and there could be three possible states
 * When it's undefined, it means the event has not been finished
 *      it's false, it means the event has failed
 *      it's true, it means the event is successfully executed
 *
 * Each event has two callbacks, one on failed and the other one on success
 */
export interface CallbackProtocol<T extends () => void = () => void> {
    fetchSuccess?: boolean;
    fetchFailedCall?: T;
    fetchSuccessCall?: T;
}

export interface CallbackInput<T extends () => void = () => void> {
    state?: CallbackProtocol<T>;
}

export interface EventDefTypes extends Record<EventType, unknown> {
    // graph
    'fetch-graph': {
        graphAnchorId?: string;
        codeAnchorId?: string;
    } & CallbackInput;
    'fetched-graph': { anchorId?: string } & Required<CallbackInput>;
    'load-graph-anchor': string;
    // code
    'fetch-code': { codeId?: string; graphAnchorId?: string } & CallbackInput;
    'fetched-code': { codeId?: string } & Required<CallbackInput>;
    'load-code': string;
    // tutorial content
    'fetch-tutorial': { url: string; lang?: string } & CallbackInput;
    'fetched-tutorial': { anchorId?: string } & Required<CallbackInput>;
    'reset-states': undefined;
}

export type EventTypes = keyof EventDefTypes;

export const bus = markRaw(mitt<EventDefTypes>());

export function useStorageBus() {
    return bus;
}
