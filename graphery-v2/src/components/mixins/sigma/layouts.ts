import ForceSupervisor from 'graphology-layout-force/worker';
import { ref } from 'vue';

import type { ForceLayoutSupervisorParameters } from 'graphology-layout-force/worker';
import FA2Layout from 'graphology-layout-forceatlas2/worker';

import type { ForceAtlas2SynchronousLayoutParameters } from 'graphology-layout-forceatlas2';
import type { Ref } from 'vue';
import type Graph from 'graphology';
import type { Attributes } from 'graphology-types';

export interface LayoutType<T> {
    supervisor: T | null;
    start: () => void;
    stop: () => void;
    toggle: () => void;
    isRunning: boolean;
}

abstract class LayoutBase<T> implements LayoutType<T> {
    supervisor: T | null;

    abstract start(): void;
    abstract stop(): void;

    toggle() {
        if (this.supervisor) {
            this.stop();
        } else {
            this.start();
        }
    }

    constructor() {
        this.supervisor = null;
    }

    get isRunning() {
        return !!this.supervisor;
    }
    set isRunning(_) {
        this.toggle();
    }
}

export interface LayoutCollection {
    forceLayout: CustomForceSupervisor;
    forceAtlas: CustomForceAtlas;
}

class CustomForceSupervisor<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes
> extends LayoutBase<ForceSupervisor> {
    graph: Graph;
    params?: ForceLayoutSupervisorParameters<N, E>;

    constructor(graph: Graph, params?: ForceLayoutSupervisorParameters<N, E>) {
        super();
        this.graph = graph;
        this.params = params;
    }

    start() {
        this.supervisor = new ForceSupervisor<N, E>(this.graph, this.params);
        this.supervisor.start();
    }

    stop() {
        this.supervisor?.kill();
        this.supervisor = null;
    }
}

class CustomForceAtlas<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes
> extends LayoutBase<FA2Layout> {
    graph: Graph;
    params?: ForceAtlas2SynchronousLayoutParameters<N, E>;

    constructor(
        graph: Graph,
        params?: ForceAtlas2SynchronousLayoutParameters<N, E>
    ) {
        super();
        this.graph = graph;
        this.params = params;
    }

    start() {
        this.supervisor = new FA2Layout<N, E>(this.graph, this.params);
        this.supervisor.start();
    }

    stop() {
        this.supervisor?.kill();
        this.supervisor = null;
    }
}

const layouts = ref<Partial<LayoutCollection>>({});

export function initGraphLayouts(
    graph: Graph,
    settings?: {
        forceLayout?: ForceLayoutSupervisorParameters;
        forceAtlas?: ForceAtlas2SynchronousLayoutParameters;
    }
): Ref<LayoutCollection> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    layouts.value.forceLayout = new CustomForceSupervisor(
        graph,
        settings?.forceLayout
    );
    layouts.value.forceAtlas = new CustomForceAtlas(
        graph,
        settings?.forceAtlas
    );

    return layouts as unknown as Ref<LayoutCollection>;
}

export function useGraphLayouts(): Ref<LayoutCollection> {
    return layouts as unknown as Ref<LayoutCollection>;
}
