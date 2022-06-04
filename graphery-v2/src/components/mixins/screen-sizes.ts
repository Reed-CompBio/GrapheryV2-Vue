import { computed, reactive } from 'vue';
import { useQuasar } from 'quasar';

const { screen } = useQuasar();

const screenSizes = reactive({
    // enlarge
    smallAndLarger: computed(() => screen.gt.xs),
    mediumAndLarger: computed(() => screen.gt.sm),
    largeAndLarger: computed(() => screen.gt.md),
    // shrink
    smallAndLower: computed(() => screen.lt.md),
    mediumAndLower: computed(() => screen.lt.lg),
    largeAndLower: computed(() => screen.lt.xl),
});

/**
 * returns a collection of readable screen sizes
 * This application has three split points, small, medium, and large
 * The following values can be used instead of q.screen
 *
 * @returns the size collection
 */
export function useScreenSizes() {
    return screenSizes;
}
