import type { GraphDescriptionType, TutorialType } from 'src/types/api-types';
import type { RecordType } from 'src/types/execution-types';

export interface HeadquarterStorageType {
    currentCodeId: string | null;
    currentGraphAnchorId: string | null;
    tutorialContent: TutorialType | null;
    graphContent: GraphDescriptionType | null;
    state: {
        loadingTutorial: null | boolean;
        loadingGraph: null | boolean;
        loadingCode: null | boolean;
    };
}

export interface StepInfoType {
    currentStep: number;
    breakpoints: Set<number>;
    stepRecord: Omit<RecordType, 'line'>;
}
