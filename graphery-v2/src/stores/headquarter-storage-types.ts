import type { GraphDescriptionType, TutorialType } from 'src/types/api-types';
import type { RecordType } from 'src/types/execution-types';

export interface HeadquarterStorageType {
    currentCodeId: string | null;
    currentGraphAnchorId: string | null;
    tutorialContent: TutorialType | null;
    graphContent: GraphDescriptionType | null;
}

export interface StepInfoType {
    currentStep: number;
    breakpoints: Set<number>;
    stepRecord?: Required<RecordType>;
}
