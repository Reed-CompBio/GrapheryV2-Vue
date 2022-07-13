import {
    isEdgeType,
    isGraphObjectType,
    isInitType,
    isLinearContainerType,
    isNodeType,
    isPairContainerType,
    isRefType,
    isSingularType,
} from 'src/types/execution-types';
import { watch, computed, reactive, ref } from 'vue';
import { useGraphBus } from 'src/components/mixins/controller/graph-bus';

import type {
    CompositionalObjectIdentityType,
    InitType,
    LinearContainerType,
    ObjectType,
    PairContainerRepr,
    RefType,
    SingularType,
} from 'src/types/execution-types';
import type { ComputedRef, Ref } from 'vue';

const graphBus = useGraphBus();

type HighlightStatusType =
    | 'highlight-error'
    | 'highlight-on'
    | 'highlight-off'
    | 'highlight-key-on'
    | 'highlight-value-on';

export interface VariableInfo<T extends ObjectType = ObjectType> {
    stack: [
        CompositionalObjectIdentityType,
        ...CompositionalObjectIdentityType[]
    ];
    stackLabels: [string, ...string[]];
    baseLabel: ComputedRef<string>;
    fullLabel: ComputedRef<string>;
    toggled: Ref<number>;
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
    isGraphObject: ComputedRef<boolean>;
    isNodeObject: ComputedRef<boolean>;
    isEdgeObject: ComputedRef<boolean>;
    stackBottom: ComputedRef<boolean>;
    typeIcon: ComputedRef<string>;
    highlightStatus: ComputedRef<HighlightStatusType>;
    highlightToggleIcon: ComputedRef<string>;
    toggleHighlight: () => void;
    get typeDescription(): string;
    pushStack: (
        value:
            | {
                  variable: CompositionalObjectIdentityType;
                  label: string;
              }
            | {
                  refId: number;
                  label: string;
              }
    ) => void;
    popStack: () => void;
    requestHighlight: () => void;
}

export class VariableInfoWrapper implements VariableInfo {
    stack: [
        CompositionalObjectIdentityType,
        ...CompositionalObjectIdentityType[]
    ];
    stackLabels: [string, ...string[]];
    baseLabel: ComputedRef<string>;
    fullLabel: ComputedRef<string>;
    toggled: Ref<number>;
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
    isGraphObject: ComputedRef<boolean>;
    isNodeObject: ComputedRef<boolean>;
    isEdgeObject: ComputedRef<boolean>;
    stackBottom: ComputedRef<boolean>;
    typeIcon: ComputedRef<string>;
    highlightStatus: ComputedRef<HighlightStatusType>;
    highlightToggleIcon: ComputedRef<string>;

    constructor(
        variable: CompositionalObjectIdentityType,
        label: string,
        defaultToggled = 1
    ) {
        this.stack = reactive([variable]);
        this.stackLabels = reactive([label]);
        this.baseLabel = computed(() => label);
        this.fullLabel = computed(() => this.stackLabels.join(''));

        this.toggled = ref(defaultToggled);
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
                return (
                    (<{ length: number }>this.variable.value.repr).length === 0
                );
            }
        });
        this.isGraphObject = computed(() => {
            return isGraphObjectType(this.variable.value);
        });
        this.isNodeObject = computed(() => isNodeType(this.variable.value));
        this.isEdgeObject = computed(() => isEdgeType(this.variable.value));
        this.stackBottom = computed<boolean>(() => this.stack.length === 1);
        this.typeIcon = computed(() => {
            return getTypeIcon(this.variable.value.type);
        });
        this.highlightStatus = computed(() => {
            if (this.isSingular.value || this.isLinearContainer.value) {
                if (this.toggled.value) {
                    return 'highlight-on';
                } else {
                    return 'highlight-off';
                }
            } else if (this.isPairContainer.value) {
                switch (this.toggled.value) {
                    case 1:
                        return 'highlight-key-on';
                    case 2:
                        return 'highlight-value-on';
                    case 0:
                        return 'highlight-off';
                }
            }
            return 'highlight-error';
        });
        this.highlightToggleIcon = computed(() => {
            switch (this.highlightStatus.value) {
                case 'highlight-on':
                    return 'mdi-lightbulb-on-10';
                case 'highlight-off':
                    return 'mdi-lightbulb-off-outline';
                case 'highlight-key-on':
                    return 'mdi-alpha-k';
                case 'highlight-value-on':
                    return 'mdi-alpha-v';
                default:
                    return 'mdi-lightbulb-alert-outline';
            }
        });

        watch(this.highlightStatus, () => {
            this.handleHighlight();
        });
    }

    get typeDescription() {
        return getObjectTypeDescription(this.variable.value.type);
    }

    pushStack(
        value:
            | { variable: CompositionalObjectIdentityType; label: string }
            | { refId: number; label: string }
    ) {
        this.stackLabels.push(value.label);

        if ('variable' in value) {
            this.stack.push(value.variable);
        } else {
            let variable: CompositionalObjectIdentityType | undefined;
            for (let i = this.stack.length - 1; i >= 0; i++) {
                if (this.stack[i].pythonId === value.refId) {
                    variable = this.stack[i];
                    break;
                }
            }
            if (!variable) {
                throw Error(
                    'The reference system went wrong since referenced object cannot be found'
                );
            }

            this.stack.push(variable);
        }
    }
    popStack() {
        if (!this.stackBottom.value) {
            this.stack.pop();
            this.stackLabels.pop();
        }
    }

    toggleHighlight() {
        const factor =
            this.isSingular.value || this.isLinearContainer.value
                ? 2
                : this.isPairContainer.value
                ? 3
                : 1;
        this.toggled.value = (this.toggled.value + 1) % factor;
    }

    handleHighlight() {
        if (!this.variable.value) {
            return;
        }

        if (this.isEdgeObject.value || this.isNodeObject.value) {
            const eventType =
                this.highlightStatus.value === 'highlight-on'
                    ? 'add-highlight'
                    : 'remove-highlight';

            graphBus.emit(eventType, {
                variable: this.variable.value,
            });
        } else if (this.isLinearContainer.value) {
            const eventType =
                this.highlightStatus.value === 'highlight-on'
                    ? 'add-highlight'
                    : 'remove-highlight';
            for (const element of this.variable.value
                .repr as CompositionalObjectIdentityType[]) {
                graphBus.emit(eventType, { variable: element });
            }
        } else if (this.isPairContainer.value) {
        }
    }
    requestHighlight() {
        this.handleHighlight();
    }
}

export const INVALID_PYTHON_ID = -1;

export const BAD_REFERENCE_OBJECT: CompositionalObjectIdentityType<'Init'> = {
    type: 'Init',
    repr: 'BAD ELEMENT',
    color: '#ea1e1e',
    pythonId: INVALID_PYTHON_ID,
} as const;

export enum SingularTypeIconMapping {
    'Number' = 'mdi-numeric',
    'String' = 'mdi-alphabetical',
    'Node' = 'mdi-ray-vertex',
    'Edge' = 'mdi-ray-start-end',
    'DataEdge' = 'mdi-ray-start-end',
    'MultiEdge' = 'mdi-ray-start-end',
    'MultiDataEdge' = 'mdi-ray-start-end',
    'None' = 'mdi-selection-ellipse',
    'Object' = 'mdi-iframe-variable-outline',
}

export enum LinearContainerTypeIconMapping {
    'UserList' = 'mdi-code-brackets',
    'List' = 'mdi-code-brackets',
    'Tuple' = 'mdi-code-parentheses',
    'NamedTuple' = 'mdi-code-parenthese',
    'Deque' = 'mdi-arrow-collapse-vertical',
    'Set' = 'mdi-set-center',
    'Sequence' = 'mdi-playlist-minus',
}

export enum PairContainerTypeIconMapping {
    'UserDict' = 'mdi-code-braces',
    'Counter' = 'mdi-counter',
    'Mapping' = 'mdi-code-braces',
}

export enum SpecialObjectTypeIconMapping {
    'Init' = 'mdi-help-circle-outline',
    'Ref' = 'mdi-swap-vertical-variant',
}

export const TYPE_ICON_MAPPING = {
    ...SingularTypeIconMapping,
    ...LinearContainerTypeIconMapping,
    ...PairContainerTypeIconMapping,
    ...SpecialObjectTypeIconMapping,
};

type TYPE_ICON_MAPPING = typeof TYPE_ICON_MAPPING;

export function getTypeIcon(type: ObjectType) {
    return TYPE_ICON_MAPPING[type] as string;
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
    UserList: 'This is a user defined List',
    List: 'This is a list of objects.',
    Tuple: 'This is a tuple of objects.',
    NamedTuple: 'This is a named tuple',
    Deque: 'This is a deque of objects.',
    None: 'This is a the special entity None.',
    Set: 'This is a set of objects.',
    UserDict: 'This is a user defined dictionary',
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
