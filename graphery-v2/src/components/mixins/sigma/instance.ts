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

export function initSigma(
    graph: Graph,
    container: HTMLElement,
    settings: Partial<SpecialHighlightSettings> = SPECIAL_HIGHLIGHT_DEFAULT_SETTINGS
) {
    sigma = new Sigma(graph, container, settings as Settings);
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
