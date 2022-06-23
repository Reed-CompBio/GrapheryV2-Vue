import type { GraphAnchor, Tutorial } from 'src/types/tutorial-types';

export interface HeadquarterStorageType {
    currentCodeId: string | null;
    currentGraphId: string | null;
    tutorialContent: Tutorial | null;
    graphContent: GraphAnchor | null;
}

export interface StepInfoType {
    currentStep: number;
    breakpoints: number[];
}

export interface CSVType {
    locked: boolean;
}
