export type GraphObjectType =
    | 'Node'
    | 'Edge'
    | 'DataEdge'
    | 'MultiEdge'
    | 'MultiDataEdge';

export type PythonObjectType =
    | 'Number'
    | 'String'
    | 'List'
    | 'Tuple'
    | 'Deque'
    | 'None'
    | 'Set'
    | 'Mapping'
    | 'Sequence'
    | 'Object';

export type SpecialObjectType = 'Init' | 'Ref';

export type ObjectType = GraphObjectType | PythonObjectType | SpecialObjectType;

export type ObjectIdentifierSeparator = '\u200b';

export type ObjectIdentifierType =
    `${string}${ObjectIdentifierSeparator}${string}`;

export interface CompositionalObjectIdentityType {
    type: ObjectType;
    color: string;
    repr: string;
    attributes?: {
        graphId: string;
        [key: string]: string | number;
    };
    pythonId: number;
}

export interface RecordType {
    line: number;
    variables?: Record<ObjectIdentifierType, CompositionalObjectIdentityType>;
    accesses?: CompositionalObjectIdentityType[];
    variableOrders?: string[]; // this is not supported for now
    stdout?: string[];
}

export type RecordArrayType = RecordType[];

export interface BreakPointType {
    [key: number]: string;
    // the key is the line number,
    // and the value is the corresponding tag for the breakpoint
}

export interface ResultMetaType {
    version: string;
    breakpoints: BreakPointType;
}
