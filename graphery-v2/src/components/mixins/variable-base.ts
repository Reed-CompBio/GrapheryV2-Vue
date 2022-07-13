import {
    GraphEdgeType,
    GraphNodeType,
    isEdgeType,
    isGraphObjectType,
    isInitType,
    isLinearContainerType,
    isNodeType,
    isPairContainerType,
    isRefType,
    isSingularType,
} from 'src/types/execution-types';
import { watch, reactive, ref } from 'vue';
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
import type { Ref } from 'vue';
import { isNode } from 'graphql/language/ast';

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
    get baseLabel(): string;
    get fullLabel(): string;
    toggled: Ref<number>;
    get variable(): CompositionalObjectIdentityType<
        VariableInfo['isNodeObject'] extends true
            ? GraphNodeType
            : VariableInfo['isEdgeObject'] extends true
            ? GraphEdgeType
            : VariableInfo['isSingular'] extends true
            ? SingularType
            : VariableInfo['isLinearContainer'] extends true
            ? LinearContainerType
            : VariableInfo['isPairContainer'] extends true
            ? PairContainerRepr
            : VariableInfo['isInit'] extends true
            ? InitType
            : VariableInfo['isRef'] extends true
            ? RefType
            : T
    >;
    get isSingular(): boolean;
    get isLinearContainer(): boolean;
    get isPairContainer(): boolean;
    get isInit(): boolean;
    get isRef(): boolean;
    get isEmpty(): boolean;
    get isGraphObject(): boolean;
    get isNodeObject(): boolean;
    get isEdgeObject(): boolean;
    get stackBottom(): boolean;
    get typeIcon(): string;
    get highlightStatus(): HighlightStatusType;
    get highlightToggleIcon(): string;
    get typeDescription(): string;
    toggleHighlight: () => void;
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
    get baseLabel(): string {
        return this.stackLabels[0];
    }
    get fullLabel(): string {
        return this.stackLabels.join('');
    }
    toggled: Ref<number>;
    get isSingular(): boolean {
        return isSingularType(this.variable);
    }
    get isLinearContainer(): boolean {
        return isLinearContainerType(this.variable);
    }
    get isPairContainer(): boolean {
        return isPairContainerType(this.variable);
    }
    get isInit(): boolean {
        return isInitType(this.variable);
    }
    get isRef(): boolean {
        return isRefType(this.variable);
    }
    get isEmpty(): boolean {
        if (
            this.isEdgeObject ||
            this.isNodeObject ||
            this.isSingular ||
            this.isRef
        ) {
            return false;
        } else {
            return (<{ length: number }>this.variable.repr).length === 0;
        }
    }
    get isGraphObject(): boolean {
        return isGraphObjectType(this.variable);
    }
    get isNodeObject(): boolean {
        return isNodeType(this.variable);
    }
    get isEdgeObject(): boolean {
        return isEdgeType(this.variable);
    }
    get stackBottom(): boolean {
        return this.stack.length === 1;
    }
    get typeIcon(): string {
        return getTypeIcon(this.variable.type);
    }
    get highlightStatus(): HighlightStatusType {
        if (this.isSingular || this.isLinearContainer) {
            if (this.toggled.value) {
                return 'highlight-on';
            } else {
                return 'highlight-off';
            }
        } else if (this.isPairContainer) {
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
    }
    get highlightToggleIcon(): string {
        switch (this.highlightStatus) {
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
    }

    get variable() {
        return this.stack[this.stack.length - 1];
    }

    constructor(
        variable: CompositionalObjectIdentityType,
        label: string,
        defaultToggled = 1
    ) {
        this.stack = reactive([variable]);
        this.stackLabels = reactive([label]);
        this.toggled = ref(defaultToggled);

        watch(
            () => this.highlightStatus,
            () => {
                this.handleHighlight();
            }
        );
    }

    get typeDescription() {
        return getObjectTypeDescription(this.variable.type);
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
        if (!this.stackBottom) {
            this.stack.pop();
            this.stackLabels.pop();
        }
    }

    toggleHighlight() {
        const factor =
            this.isSingular || this.isLinearContainer
                ? 2
                : this.isPairContainer
                ? 3
                : 1;
        this.toggled.value = (this.toggled.value + 1) % factor;
    }

    handleHighlight(variable?: CompositionalObjectIdentityType) {
        variable = variable ?? this.variable;

        if (!variable) {
            return;
        }

        if (isEdgeType(variable) || isNode(variable)) {
            const eventType =
                this.highlightStatus === 'highlight-on'
                    ? 'add-highlight'
                    : 'remove-highlight';

            graphBus.emit(eventType, {
                variable: variable,
                color: this.variable.color,
            });
        } else if (isLinearContainerType(variable)) {
            for (const element of variable.repr as CompositionalObjectIdentityType[]) {
                this.handleHighlight(element);
            }
        } else if (isPairContainerType(variable)) {
        }
    }
    requestHighlight() {
        this.handleHighlight();
    }

    updateBase(variable: CompositionalObjectIdentityType) {
        this.stack = [variable];
        while (this.stackLabels.length !== 1) {
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
