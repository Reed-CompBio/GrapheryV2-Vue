import { ApolloError } from '@apollo/client';

export interface UUIDMixin {
    id: string;
}

export interface TimeDateMixin {
    createdTime: string;
    modifiedTime: string;
}

export enum ItemStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    REVIEWING = 'REVIEWING',
    PRIVATE = 'PRIVATE',
    TRASH = 'TRASH',
    AUTOSAVE = 'AUTOSAVE',
    CLOSED = 'CLOSED',
}

export interface StatusMixin {
    itemStatus: ItemStatus;
}

export enum LangCode {
    EN = 'EN',
    // for more language codes,
    // please refer to https://docs.djangoproject.com/en/dev/topics/i18n/
}

export interface LangMixin {
    langCode: LangCode;
}

export interface RankMixin {
    rank: string;
}

export interface User {
    displayedName: string;
}

export interface TagAnchor extends UUIDMixin, TimeDateMixin, StatusMixin {
    anchorName: string;
    tags: Tag[];
    tutorialAnchors: TutorialAnchor[];
    graphAnchors: GraphAnchor[];
}

export interface Tag extends UUIDMixin, TimeDateMixin, StatusMixin, LangMixin {
    name: string;
    tagAnchor: TagAnchor;
    description: string;
}

export interface TutorialAnchor
    extends UUIDMixin,
        TimeDateMixin,
        StatusMixin,
        RankMixin {
    url: string;
    anchorName: string;
    tagAnchors: [TagAnchor];
    tutorials: [Tutorial];
    graphAnchors: [GraphAnchor];
    code: Code;
    uploads: [Upload];
}

export interface Tutorial
    extends UUIDMixin,
        TimeDateMixin,
        StatusMixin,
        LangMixin {
    tutorialAnchor: TutorialAnchor;
    authors: [User];
    title: string;
    abstract: string;
    contentMarkdown: string;
}

export interface GraphAnchor extends UUIDMixin, TimeDateMixin, StatusMixin {
    url: string;
    anchorName: string;
    tags: [TagAnchor];
    defaultOrder: number;
    tutorialAnchors: [TutorialAnchor];
    graph: Graph;
    graphDescription: [GraphDescription];
    executionResults: [ExecutionResult];
    uploads: [Upload];
}

export interface Graph extends UUIDMixin, TimeDateMixin, StatusMixin {
    graphAnchor: GraphAnchor;
    graphJson: string;
    makers: [User];
}

export interface GraphDescription
    extends UUIDMixin,
        TimeDateMixin,
        StatusMixin,
        LangMixin {
    graphAnchor: GraphAnchor;
    authors: [User];
    title: string;
    descriptionMarkdown: string;
}

export interface Code extends UUIDMixin, TimeDateMixin {
    name: string;
    code: string;
    tutorialAnchor: TutorialAnchor;
    executionResults: [ExecutionResult];
}

export interface ExecutionResult extends UUIDMixin, TimeDateMixin {
    code: Code;
    graphAnchor: GraphAnchor;
    resultJson: string;
    resultJsonMeta: string;
}

export interface Upload extends UUIDMixin, TimeDateMixin {
    name: string;
    tutorialAnchors: [TutorialAnchor];
    graphAnchors: [GraphAnchor];
}

export interface GraphQLLoadingType<N extends string, T> {
    loading: boolean;
    data: Record<N, T>;
    errors?: object[];
    error: ApolloError;
}
