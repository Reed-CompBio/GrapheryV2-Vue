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

export interface CompositionalObjectIdentityType<
    T extends ObjectType = ObjectType
> {
    type: T;
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
    stdout?: string[]; // TODO make this into string
}

export interface InitRecordType extends RecordType {
    line: number;
    variables: Record<
        ObjectIdentifierSeparator,
        CompositionalObjectIdentityType<'Init'>
    >;
    accesses: [];
    variableOrders: [];
    stdout: [];
}

export type RecordArrayType = [InitRecordType, ...RecordType[]];

export type ChangableProperties<T extends keyof Omit<RecordType, 'line'>> = T;

export const CHANGABLE_PROPERTIES = new Set<
    ChangableProperties<'variables' | 'accesses' | 'stdout'>
>(['variables', 'accesses', 'stdout']);

export interface BreakPointType {
    [key: number]: string;
    // the key is the line number,
    // and the value is the corresponding tag for the breakpoint
}

export interface ResultMetaType {
    version: string;
    breakpoints: BreakPointType;
}
