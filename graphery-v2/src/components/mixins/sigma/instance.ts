import Sigma from 'sigma';
import { computed } from 'vue';
import { SPECIAL_HIGHLIGHT_DEFAULT_SETTINGS } from 'components/mixins/sigma/sigma-highlight';
import type { SpecialHighlightNodeDisplayData } from 'components/mixins/sigma/sigma-highlight';

import type Graph from 'graphology';
import type { SpecialHighlightSettings } from 'components/mixins/sigma/sigma-highlight';
import type { Settings } from 'sigma/settings';
import type { AnimateOptions } from 'sigma/utils/animate';
import type { CameraState } from 'sigma/types';

let sigma: Sigma | undefined = undefined;

export interface GraphNodeAttributeType
    extends SpecialHighlightNodeDisplayData {
    weight?: number;
}

const draggedNodeSupport: { draggedNode?: unknown; isDragging: boolean } = {
    draggedNode: undefined,
    isDragging: false,
};

export function initSigma(
    graph: Graph,
    container: HTMLElement,
    settings: Partial<SpecialHighlightSettings> = SPECIAL_HIGHLIGHT_DEFAULT_SETTINGS
) {
    sigma = new Sigma(graph, container, settings as Settings);

    sigma.on('enterNode', (e) => {
        graph.setNodeAttribute(e.node, 'hovered', true);
    });

    sigma.on('leaveNode', (e) => {
        if (draggedNodeSupport.isDragging || draggedNodeSupport.draggedNode) {
            graph.setNodeAttribute(e.node, 'hovered', false);
        }
    });

    // dragging
    sigma.on('downNode', (e) => {
        draggedNodeSupport.isDragging = true;
        draggedNodeSupport.draggedNode = e.node;
    });

    sigma.getMouseCaptor().on('mousemovebody', (e) => {
        if (!draggedNodeSupport.isDragging || !draggedNodeSupport.draggedNode)
            return;

        const pos = sigma?.viewportToGraph(e);

        if (pos) {
            graph.setNodeAttribute(draggedNodeSupport.draggedNode, 'x', pos.x);
            graph.setNodeAttribute(draggedNodeSupport.draggedNode, 'y', pos.y);
        }

        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
    });

    sigma.getMouseCaptor().on('mouseup', () => {
        draggedNodeSupport.isDragging = false;
        draggedNodeSupport.draggedNode = undefined;
    });

    sigma.getMouseCaptor().on('mousedown', () => {
        if (sigma?.getCustomBBox()) {
            sigma?.setCustomBBox(sigma?.getBBox());
        }
    });
}

export function useSigma() {
    return sigma;
}

const sigmaCamera = computed(() => {
    return sigma?.getCamera();
});

export type CameraOptions = Partial<AnimateOptions> & { factor: number };

export function useSigmaCamera(options?: CameraOptions) {
    const zoomIn = (ops?: CameraOptions) => {
        sigmaCamera.value?.animatedZoom({ ...options, ...ops });
    };
    const zoomOut = (ops?: CameraOptions) => {
        sigmaCamera.value?.animatedUnzoom({ ...options, ...ops });
    };
    const reset = (ops?: CameraOptions) => {
        sigmaCamera.value?.animatedReset({ ...options, ...ops });
    };

    const goto = (state: Partial<CameraState>, ops?: CameraOptions) => {
        sigmaCamera.value?.animate(state, { ...options, ...ops });
    };

    const gotoNode = (nodeKey: string, ops?: CameraOptions) => {
        const nodeData = sigma?.getNodeDisplayData(nodeKey);
        if (nodeData) {
            sigmaCamera.value?.animate(nodeData, { ...options, ...ops });
        } else {
            console.error(`Node ${nodeKey} is not found`);
        }
    };

    return { zoomIn, zoomOut, reset, goto, gotoNode };
}
