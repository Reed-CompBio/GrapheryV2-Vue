import type { CodeType, GraphAnchorType, GraphType } from 'src/types/api-types';
import type { RecordType } from 'src/types/execution-types';

export interface IGraphGetters {
    currentGraphAnchor: GraphAnchorType;
    graphAnchors: GraphAnchorType[];
    isLoadingGraph: boolean;
    currentGraph: GraphType;
}

export interface IStateGetters {
    currentStepRecord: RecordType;
}

export interface ICodeGetters {
    currentCode: CodeType;
    currentLine: number;
}
