import ForceSupervisor from 'graphology-layout-force/worker';
import { computed, ref } from 'vue';

import type { ForceLayoutSupervisorParameters } from 'graphology-layout-force/worker';
import type { Ref, WritableComputedRef } from 'vue';
import type Graph from 'graphology';
import type { Attributes } from 'graphology-types';

export interface LayoutType<T> {
    instance: T;
    toggle: () => void;
    isRunning: WritableComputedRef<boolean>;
}

export interface LayoutCollection {
    forceLayout: LayoutType<CustomForceSupervisor>;
}

class CustomForceSupervisor<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes
> {
    graph: Graph;
    params?: ForceLayoutSupervisorParameters<N, E>;
    supervisor: Ref<ForceSupervisor | undefined>;

    constructor(graph: Graph, params?: ForceLayoutSupervisorParameters<N, E>) {
        this.graph = graph;
        this.params = params;
        this.supervisor = ref<ForceSupervisor | undefined>(undefined);
    }

    start() {
        this.supervisor.value = new ForceSupervisor<N, E>(
            this.graph,
            this.params
        );
        this.supervisor.value.start();
    }

    stop() {
        this.supervisor.value?.kill();
        this.supervisor.value = undefined;
    }
}

const layouts = ref<Partial<LayoutCollection>>({});

export function initGraphLayouts(graph: Graph): Ref<LayoutCollection> {
    const forceLayout: LayoutType<CustomForceSupervisor> = {
        instance: new CustomForceSupervisor(graph),
        toggle() {
            if (forceLayout.instance.supervisor.value) {
                forceLayout.instance.stop();
            } else {
                forceLayout.instance.start();
            }
        },
        isRunning: computed({
            get() {
                return !!forceLayout.instance.supervisor.value;
            },
            set() {
                forceLayout.toggle();
            },
        }),
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    layouts.value.forceLayout = forceLayout;

    return layouts as unknown as Ref<LayoutCollection>;
}

export function useGraphLayouts(): Ref<LayoutCollection> {
    return layouts as unknown as Ref<LayoutCollection>;
}
