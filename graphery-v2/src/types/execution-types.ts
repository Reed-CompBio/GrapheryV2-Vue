export const GRAPH_NODE_TYPES = ['Node'] as const;
export type GraphNodeType = typeof GRAPH_NODE_TYPES[number];
export function isNodeType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<GraphNodeType> {
    return (GRAPH_NODE_TYPES as ReadonlyArray<string>).includes(variable.type);
}

export const GRAPH_EDGE_TYPES = [
    'Edge',
    'DataEdge',
    'MultiEdge',
    'MultiDataEdge',
] as const;
export type GraphEdgeType = typeof GRAPH_EDGE_TYPES[number];
export function isEdgeType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<GraphEdgeType> {
    return (GRAPH_EDGE_TYPES as ReadonlyArray<string>).includes(variable.type);
}

export const GRAPH_OBJECT_TYPES = [
    ...GRAPH_NODE_TYPES,
    ...GRAPH_EDGE_TYPES,
] as const;
export type GraphObjectType = typeof GRAPH_OBJECT_TYPES[number];
export function isGraphObjectType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<GraphObjectType> {
    return (GRAPH_OBJECT_TYPES as ReadonlyArray<string>).includes(
        variable.type
    );
}

export const PYTHON_OBJECT_TYPES = [
    'Number',
    'String',
    'List',
    'UserList',
    'Tuple',
    'Deque',
    'None',
    'Set',
    'UserDict',
    'Counter',
    'Mapping',
    'Sequence',
    'Object',
] as const;
export type PythonObjectType = typeof PYTHON_OBJECT_TYPES[number];

export const SINGULAR_TYPES = [
    'Number',
    'String',
    ...GRAPH_OBJECT_TYPES,
    'None',
    'Object',
] as const;
export type SingularType = typeof SINGULAR_TYPES[number];
export function isSingularType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<SingularType> {
    return (SINGULAR_TYPES as ReadonlyArray<string>).includes(variable.type);
}

export const SUBSCRIPTABLE_LINEAR_CONTAINER_TYPES = [
    'List',
    'UserList',
    'Tuple',
    'Deque',
    'Sequence',
] as const;

export const NON_SUBSCRIPTABLE_LINEAR_CONTAINER_TYPES = ['Set'] as const;
export const LINEAR_CONTAINER_TYPES = [
    ...SUBSCRIPTABLE_LINEAR_CONTAINER_TYPES,
    ...NON_SUBSCRIPTABLE_LINEAR_CONTAINER_TYPES,
];
export type LinearContainerType = typeof LINEAR_CONTAINER_TYPES[number];
export function isLinearContainerType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<LinearContainerType> {
    return (LINEAR_CONTAINER_TYPES as ReadonlyArray<string>).includes(
        variable.type
    );
}

export function isSubscriptable(
    variable: CompositionalObjectIdentityType
): boolean {
    return (<ReadonlyArray<string>>(
        SUBSCRIPTABLE_LINEAR_CONTAINER_TYPES
    )).includes(variable.type);
}

export const PAIR_CONTAINER_TYPES = ['UserDict', 'Counter', 'Mapping'] as const;
export type PairContainerType = typeof PAIR_CONTAINER_TYPES[number];
export function isPairContainerType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<PairContainerType> {
    return (PAIR_CONTAINER_TYPES as ReadonlyArray<string>).includes(
        variable.type
    );
}
export type PairContainerRepr = {
    key: CompositionalObjectIdentityType;
    value: CompositionalObjectIdentityType;
};

export const SPECIAL_OBJECT_TYPES = ['Init', 'Ref'] as const;
export type SpecialObjectType = typeof SPECIAL_OBJECT_TYPES[number];
export type InitType = typeof SPECIAL_OBJECT_TYPES[0];
export type RefType = typeof SPECIAL_OBJECT_TYPES[1];

export function isSpecialObjectType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<SpecialObjectType> {
    return (SPECIAL_OBJECT_TYPES as ReadonlyArray<string>).includes(
        variable.type
    );
}
export function isInitType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<InitType> {
    return variable.type === 'Init';
}

export function isRefType(
    variable: CompositionalObjectIdentityType
): variable is CompositionalObjectIdentityType<RefType> {
    return variable.type === 'Ref';
}

export const OBJECT_TYPES = [
    ...GRAPH_OBJECT_TYPES,
    ...PYTHON_OBJECT_TYPES,
    ...SPECIAL_OBJECT_TYPES,
] as const;
export type ObjectType = typeof OBJECT_TYPES[number];

export const ObjectIdentifierSeparator = '\u200b@' as const;

export type ObjectIdentifierType =
    `${string}${typeof ObjectIdentifierSeparator}${string}`;

export type EdgeRepr = {
    source: CompositionalObjectIdentityType<GraphNodeType>;
    target: CompositionalObjectIdentityType<GraphNodeType>;
    is_directed?: boolean;
};

export interface CompositionalObjectIdentityType<
    T extends ObjectType = ObjectType
> {
    type: T;
    color: string;
    repr: T extends GraphEdgeType
        ? EdgeRepr
        : T extends SingularType
        ? string
        : T extends LinearContainerType
        ? CompositionalObjectIdentityType[]
        : T extends PairContainerType
        ? PairContainerRepr[]
        : T extends SpecialObjectType
        ? string // TODO: undefined or string?
        : never;
    attributes?: T extends GraphObjectType
        ? {
              key: string;
              [key: string]: string | number;
          }
        : undefined;
    pythonId: number;
}

export interface RecordType {
    line: number;
    variables?: Record<string, CompositionalObjectIdentityType>;
    accesses?: CompositionalObjectIdentityType[];
    variableOrders?: string[]; // this is not supported for now
    stdout?: string; // TODO make this into string
}

export interface InitRecordType extends RecordType {
    line: number;
    variables: Record<
        typeof ObjectIdentifierSeparator,
        CompositionalObjectIdentityType<'Init'>
    >;
    accesses: [];
    variableOrders: [];
    stdout: '';
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
