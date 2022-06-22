import type { GraphAnchor, Tutorial } from 'src/types/tutorial-types';

export interface HeadquarterStorageType {
    currentCodeId: string | null;
    currentGraphId: string | null;
    tutorialContent: Tutorial | null;
    graphContent: GraphAnchor | null;
}
