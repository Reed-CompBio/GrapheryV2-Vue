import {
    isInitType,
    isLinearContainerType,
    isPairContainerType,
    isRefType,
    isSingularType,
    LINEAR_CONTAINER_TYPES,
    PAIR_CONTAINER_TYPES,
    SINGULAR_TYPES,
} from 'src/types/execution-types';
import { computed } from 'vue';

import type {
    CompositionalObjectIdentityType,
    InitType,
    LinearContainerType,
    ObjectType,
    PairContainerRepr,
    RefType,
    SingularType,
} from 'src/types/execution-types';
import type { ComputedRef } from 'vue';

export interface VariableInfo<T extends ObjectType = ObjectType> {
    stack: [
        CompositionalObjectIdentityType,
        ...CompositionalObjectIdentityType[]
    ];
    stackLabels: [string, ...string[]];
    baseLabel: ComputedRef<string>;
    fullLabel: ComputedRef<string>;
    toggled: number;
    variable: ComputedRef<
        CompositionalObjectIdentityType<
            VariableInfo['isSingular']['value'] extends true
                ? SingularType
                : VariableInfo['isLinearContainer']['value'] extends true
                ? LinearContainerType
                : VariableInfo['isPairContainer']['value'] extends true
                ? PairContainerRepr
                : VariableInfo['isInit']['value'] extends true
                ? InitType
                : VariableInfo['isRef']['value'] extends true
                ? RefType
                : T
        >
    >;
    isSingular: ComputedRef<boolean>;
    isLinearContainer: ComputedRef<boolean>;
    isPairContainer: ComputedRef<boolean>;
    isInit: ComputedRef<boolean>;
    isRef: ComputedRef<boolean>;
    isEmpty: ComputedRef<boolean>;
    stackBottom: ComputedRef<boolean>;
    typeIcon: ComputedRef<string>;
    highlightToggleIcon: ComputedRef<string>;
    get typeDescription(): string;
    pushStack: (target: number) => void;
    popStack: () => void;
}

export class VariableInfoWrapper implements VariableInfo {
    stack: [
        CompositionalObjectIdentityType,
        ...CompositionalObjectIdentityType[]
    ];
    stackLabels: [string, ...string[]];
    baseLabel: ComputedRef<string>;
    fullLabel: ComputedRef<string>;
    toggled: number;
    variable: ComputedRef<
        CompositionalObjectIdentityType<
            VariableInfo['isSingular']['value'] extends true
                ? SingularType
                : VariableInfo['isLinearContainer']['value'] extends true
                ? LinearContainerType
                : VariableInfo['isPairContainer']['value'] extends true
                ? PairContainerRepr
                : VariableInfo['isInit']['value'] extends true
                ? InitType
                : VariableInfo['isRef']['value'] extends true
                ? RefType
                : ObjectType
        >
    >;
    isSingular: ComputedRef<boolean>;
    isLinearContainer: ComputedRef<boolean>;
    isPairContainer: ComputedRef<boolean>;
    isInit: ComputedRef<boolean>;
    isRef: ComputedRef<boolean>;
    isEmpty: ComputedRef<boolean>;
    stackBottom: ComputedRef<boolean>;
    typeIcon: ComputedRef<string>;
    highlightToggleIcon: ComputedRef<string>;

    constructor(variable: CompositionalObjectIdentityType, label: string) {
        this.stack = [variable];
        this.stackLabels = [label];
        this.baseLabel = computed(() => label);
        this.fullLabel = computed(() => this.stackLabels.join(''));

        this.toggled = 0;
        this.variable = computed(() => {
            // const ele = this.stack.at(-1);
            return this.stack[this.stack.length - 1];
        });
        this.isSingular = computed(() => isSingularType(this.variable.value));
        this.isLinearContainer = computed(() =>
            isLinearContainerType(this.variable.value)
        );
        this.isPairContainer = computed(() =>
            isPairContainerType(this.variable.value)
        );
        this.isInit = computed(() => isInitType(this.variable.value));
        this.isRef = computed(() => isRefType(this.variable.value));
        this.isEmpty = computed(() => {
            if (
                this.isSingular.value ||
                this.isRef.value ||
                this.isEmpty.value
            ) {
                return false;
            } else {
                return this.variable.value.repr.length === 0;
            }
        });
        this.stackBottom = computed<boolean>(() => this.stack.length === 1);
        this.typeIcon = computed(() => {
            return getTypeIcon(this.variable.value.type);
        });
        this.highlightToggleIcon = computed(() => {
            if (this.isSingular.value || this.isLinearContainer.value) {
                if (this.toggled) {
                    return 'mdi-lightbulb';
                } else {
                    return 'mdi-lightbulb-off-outline';
                }
            } else if (this.isPairContainer.value) {
                switch (this.toggled) {
                    case 1:
                        return 'mdi-alpha-k';
                    case 2:
                        return 'mdi-alpha-v';
                    case 0:
                        return 'mdi-lightbulb-off-outline';
                }
            }
            return 'mdi-close-circle-outline';
        });
    }

    get typeDescription() {
        return getObjectTypeDescription(this.variable.value.type);
    }

    pushStack(target: number) {
        let variable: CompositionalObjectIdentityType;

        if (this.isPairContainer.value) {
            variable = <CompositionalObjectIdentityType>(
                (<PairContainerRepr[]>this.variable.value.repr).find(
                    (val) => val.key.pythonId === target
                )?.value
            );
            this.stackLabels.push(`.${target}`);
        } else if (this.isLinearContainer.value) {
            variable = (<CompositionalObjectIdentityType[]>(
                this.variable.value.repr
            ))[target];
            this.stackLabels.push(`[${target}]`);
        } else {
            throw new Error(
                `Cannot push stack for ${this.variable.value.type} with target ${target}`
            );
        }

        if (isRefType(variable)) {
            variable = this.stack.find(
                (v) => v.pythonId === variable.pythonId
            ) as CompositionalObjectIdentityType;
            this.stack.push(variable);
        }
    }
    popStack() {
        if (!this.stackBottom.value) {
            this.stack.pop();
            this.stackLabels.pop();
        }
    }
}

export const INVALID_PYTHON_ID = -1;

export const BAD_REFERENCE_OBJECT: CompositionalObjectIdentityType<'Init'> = {
    type: 'Init',
    repr: 'BAD ELEMENT',
    color: '#ea1e1e',
    pythonId: INVALID_PYTHON_ID,
} as const;

export const SINGULAR_TYPE_ICONS = [
    'mdi-numeric',
    'mdi-alphabetical',
    'mdi-ray-vertex',
    'mdi-ray-start-end',
    'mdi-ray-start-end', // TODO: replace icon to indicate different types of edges
    'mdi-ray-start-end',
    'mdi-ray-start-end',
    'mdi-selection-ellipse',
    'mdi-iframe-variable-outline',
] as const;

export const SINGULAR_TYPE_ICON_MAPPING = Object.fromEntries(
    SINGULAR_TYPES.map((value, i) => [value, SINGULAR_TYPE_ICONS[i]])
) as Readonly<{
    Number: 'mdi-numeric';
    String: 'mdi-alphabetical';
    Node: 'mdi-ray-vertex';
    Edge: 'mdi-ray-start-end';
    DataEdge: 'mdi-ray-start-end';
    MultiEdge: 'mdi-ray-start-end';
    MultiDataEdge: 'mdi-ray-start-end';
    None: 'mdi-selection-ellipse';
    Object: 'mdi-iframe-variable-outline';
}>; // TODO this is stupid. Is there a better way to do this?

export const LINEAR_CONTAINER_TYPE_ICON = [
    'mdi-code-brackets',
    'mdi-code-parentheses',
    'mdi-arrow-collapse-vertical',
    'mdi-set-center',
    'mdi-playlist-minus',
] as const;

export const LINEAR_CONTAINER_TYPE_ICON_MAPPING = Object.fromEntries(
    LINEAR_CONTAINER_TYPES.map((value, i) => [
        value,
        LINEAR_CONTAINER_TYPE_ICON[i],
    ])
) as Readonly<{
    List: 'mdi-code-brackets';
    Tuple: 'mdi-code-parentheses';
    Deque: 'mdi-arrow-collapse-vertical';
    Set: 'mdi-set-center';
    Sequence: 'mdi-playlist-minus';
}>;

export const PAIR_CONTAINER_TYPE_ICON = [
    'mdi-counter',
    'mdi-code-braces',
] as const;

export const PAIR_CONTAINER_TYPE_ICON_MAPPING = Object.fromEntries(
    PAIR_CONTAINER_TYPES.map((value, i) => [value, PAIR_CONTAINER_TYPE_ICON[i]])
) as Readonly<{
    Counter: 'mdi-counter';
    Mapping: 'mdi-code-braces';
}>;

export const TYPE_ICON_MAPPING = {
    ...SINGULAR_TYPE_ICON_MAPPING,
    ...LINEAR_CONTAINER_TYPE_ICON_MAPPING,
    ...PAIR_CONTAINER_TYPE_ICON_MAPPING,
    Init: 'mdi-help-circle-outline',
    Ref: 'mdi-swap-vertical-variant',
} as const;

export function getTypeIcon(type: ObjectType) {
    return TYPE_ICON_MAPPING[type];
}

// TODO: i18n
export const OBJECT_DESCRIPTION = {
    Node: 'This is a node object in the graph.',
    Edge: 'This is a edge object in the graph.',
    DataEdge: 'This is a edge object carrying its attributes.',
    MultiEdge: 'This is a edge object in the multi graph.',
    MultiDataEdge:
        'This is a edge object carrying its attributes in the multi graph.',
    Number: 'This is a number, either a float or an integer.',
    String: 'This is a string.',
    List: 'This is a list of objects.',
    Tuple: 'This is a tuple of objects.',
    Deque: 'This is a deque of objects.',
    None: 'This is a the special entity None.',
    Set: 'This is a set of objects.',
    Counter: 'This is a counter object.',
    Mapping: 'This is a mapping of objects.',
    Sequence: 'This is a sequence of objects.',
    Object: 'This is a (custom) object.',
    Init: "This is a variable placeholder for some object that's not yet initialized.",
    Ref: 'This is a reference to an object.',
} as const;

export function getObjectTypeDescription(type: ObjectType) {
    return OBJECT_DESCRIPTION[type];
}
