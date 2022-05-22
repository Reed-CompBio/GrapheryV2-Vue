import { provide, inject, computed, reactive } from 'vue';
import type { UnwrapNestedRefs, ComputedRef } from 'vue';
import { useQuasar } from 'quasar';

export interface ScreenSizes {
    smallAndLarger: ComputedRef<boolean>;
    mediumAndLarger: ComputedRef<boolean>;
    largeAndLarger: ComputedRef<boolean>;
    smallAndLower: ComputedRef<boolean>;
    mediumAndLower: ComputedRef<boolean>;
    largeAndLower: ComputedRef<boolean>;
}

const _SCREEN_SIZES_KEY = '__ScreenSizes';

/**
 * Constructs a collection of readable screen sizes
 * This application has three split points, small, medium, and large
 * The following values can be used instead of q.screen
 *
 * This function uses provide/inject and is intended to be used
 * in the root component of the application.
 *
 * `useScreenSizes` is the injection pair
 *
 * @returns the size collection
 */
export function getScreenSizes(): UnwrapNestedRefs<ScreenSizes> {
    const screen = useQuasar().screen;

    const sizes = reactive({
        // enlarge
        smallAndLarger: computed(() => screen.gt.xs),
        mediumAndLarger: computed(() => screen.gt.sm),
        largeAndLarger: computed(() => screen.gt.md),
        // shrink
        smallAndLower: computed(() => screen.lt.md),
        mediumAndLower: computed(() => screen.lt.lg),
        largeAndLower: computed(() => screen.lt.xl),
    });

    provide(_SCREEN_SIZES_KEY, sizes);

    return sizes;
}

export function useScreenSizes() {
    return inject(_SCREEN_SIZES_KEY)
}
