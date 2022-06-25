import type {
    GraphDescriptionType,
    TutorialType,
} from 'src/types/tutorial-types';

export interface HeadquarterStorageType {
    currentCodeId: string | null;
    currentGraphId: string | null;
    tutorialContent: TutorialType | null;
    graphContent: GraphDescriptionType | null;
}

export interface StepInfoType {
    currentStep: number;
    breakpoints: Set<number>;
}
