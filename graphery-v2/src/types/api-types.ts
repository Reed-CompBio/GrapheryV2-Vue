// https://transform.tools/graphql-to-typescript
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** Date with time (isoformat) */
    DateTime: string;
    /** A JSON object or string */
    JSONType: string;
    UUID: string;
};

export type CodeType = {
    __typename?: 'CodeType';
    code: Scalars['String'];
    createdTime: Scalars['DateTime'];
    executionResult?: Maybe<ExecutionResultType>;
    executionResults: Array<ExecutionResultType>;
    id: Scalars['UUID'];
    modifiedTime: Scalars['DateTime'];
    name: Scalars['String'];
    tutorialAnchor: TutorialAnchorType;
};

export type CodeTypeExecutionResultArgs = {
    graphAnchorId: Scalars['UUID'];
};

export type ErrorType = {
    __typename?: 'ErrorType';
    message: Scalars['String'];
    traceback: Scalars['String'];
};

export type ExecutionResultType = {
    __typename?: 'ExecutionResultType';
    code: CodeType;
    createdTime: Scalars['DateTime'];
    graphAnchor: GraphAnchorType;
    id: Scalars['UUID'];
    modifiedTime: Scalars['DateTime'];
    resultJson: Scalars['JSONType'];
    resultJsonMeta: Scalars['JSONType'];
};

export type GraphAnchorType = {
    __typename?: 'GraphAnchorType';
    anchorName: Scalars['String'];
    createdTime: Scalars['DateTime'];
    defaultOrder: Scalars['Int'];
    executionResult?: Maybe<ExecutionResultType>;
    executionResults: Array<ExecutionResultType>;
    graph?: Maybe<GraphType>;
    graphDescription?: Maybe<GraphDescriptionType>;
    graphDescriptions: Array<GraphDescriptionType>;
    id: Scalars['UUID'];
    itemStatus: Status;
    modifiedTime: Scalars['DateTime'];
    tags: Array<TagAnchorType>;
    tutorialAnchors: Array<OrderedGraphAnchorType>;
    uploads: Array<UploadsType>;
    url: Scalars['String'];
};

export type GraphAnchorTypeExecutionResultArgs = {
    codeId: Scalars['UUID'];
};

export type GraphAnchorTypeGraphDescriptionArgs = {
    lang?: LangCode;
};

export type GraphDescriptionType = {
    __typename?: 'GraphDescriptionType';
    authors: Array<UserType>;
    createdTime: Scalars['DateTime'];
    descriptionMarkdown: Scalars['String'];
    graphAnchor: GraphAnchorType;
    id: Scalars['UUID'];
    itemStatus: Status;
    langCode: Scalars['String'];
    modifiedTime: Scalars['DateTime'];
    title: Scalars['String'];
};

export type GraphType = {
    __typename?: 'GraphType';
    createdTime: Scalars['DateTime'];
    graphAnchor: GraphAnchorType;
    graphJson: Scalars['JSONType'];
    id: Scalars['UUID'];
    itemStatus: Status;
    makers: Array<UserType>;
    modifiedTime: Scalars['DateTime'];
};

export type InfoType = {
    __typename?: 'InfoType';
    result: Scalars['JSONType'];
};

export type Mutation = {
    __typename?: 'Mutation';
    executionRequest: ResponseType;
    login?: Maybe<UserType>;
    logout: Scalars['Boolean'];
    mutateCode: CodeType;
    mutateGraph: GraphType;
    mutateGraphAnchor: GraphAnchorType;
    mutateGraphDescription: GraphDescriptionType;
    mutateTag?: Maybe<TagType>;
    mutateTagAnchor?: Maybe<TagAnchorType>;
    mutateTutorial: TutorialType;
    mutateTutorialAnchor: TutorialAnchorType;
    register?: Maybe<UserType>;
};

export type MutationExecutionRequestArgs = {
    request: RequestType;
};

export type MutationLoginArgs = {
    password: Scalars['String'];
    username: Scalars['String'];
};

export type MutationMutateCodeArgs = {
    data: CodeMutationType;
    op: OperationType;
};

export type MutationMutateGraphArgs = {
    data: GraphMutationType;
    op: OperationType;
};

export type MutationMutateGraphAnchorArgs = {
    data: GraphAnchorMutationType;
    op: OperationType;
};

export type MutationMutateGraphDescriptionArgs = {
    data: GraphDescriptionMutationType;
    op: OperationType;
};

export type MutationMutateTagArgs = {
    data: TagMutationType;
    op: OperationType;
};

export type MutationMutateTagAnchorArgs = {
    data: TagAnchorMutationType;
    op: OperationType;
};

export type MutationMutateTutorialArgs = {
    data: TutorialMutationType;
    op: OperationType;
};

export type MutationMutateTutorialAnchorArgs = {
    data: TutorialAnchorMutationType;
    op: OperationType;
};

export type MutationRegisterArgs = {
    data: UserMutationType;
    recaptchaToken?: Maybe<Scalars['String']>;
};

export type OrderedGraphAnchorType = {
    __typename?: 'OrderedGraphAnchorType';
    createdTime: Scalars['DateTime'];
    graphAnchor: GraphAnchorType;
    id: Scalars['UUID'];
    modifiedTime: Scalars['DateTime'];
    order: Scalars['Int'];
    tutorialAnchor: TutorialAnchorType;
};

export type Query = {
    __typename?: 'Query';
    code?: Maybe<CodeType>;
    graph?: Maybe<GraphType>;
    graphAnchors: Array<GraphAnchorType>;
    graphContent?: Maybe<GraphDescriptionType>;
    me?: Maybe<UserType>;
    tagAnchors: Array<TagAnchorType>;
    tutorialAnchors: Array<TutorialAnchorType>;
    tutorialContent?: Maybe<TutorialType>;
};

export type QueryCodeArgs = {
    codeId: Scalars['UUID'];
};

export type QueryGraphArgs = {
    anchorId: Scalars['UUID'];
};

export type QueryGraphAnchorsArgs = {
    filters?: Maybe<GraphAnchorFilter>;
};

export type QueryGraphContentArgs = {
    anchorId?: Maybe<Scalars['UUID']>;
    lang?: LangCode;
    url?: Maybe<Scalars['String']>;
};

export type QueryTagAnchorsArgs = {
    filters?: Maybe<TagAnchorFilter>;
};

export type QueryTutorialAnchorsArgs = {
    filters?: Maybe<TutorialAnchorFilter>;
};

export type QueryTutorialContentArgs = {
    lang?: LangCode;
    url: Scalars['String'];
};

export type ResponseType = {
    __typename?: 'ResponseType';
    errors?: Maybe<Array<ErrorType>>;
    info?: Maybe<InfoType>;
};

export type TagAnchorType = {
    __typename?: 'TagAnchorType';
    anchorName: Scalars['String'];
    createdTime: Scalars['DateTime'];
    graphAnchors: Array<GraphAnchorType>;
    id: Scalars['UUID'];
    itemStatus: Status;
    modifiedTime: Scalars['DateTime'];
    tags: Array<TagType>;
    tutorialAnchors: Array<TutorialAnchorType>;
};

export type TagType = {
    __typename?: 'TagType';
    createdTime: Scalars['DateTime'];
    description: Scalars['String'];
    id: Scalars['UUID'];
    itemStatus: Status;
    langCode: Scalars['String'];
    modifiedTime: Scalars['DateTime'];
    name: Scalars['String'];
    tagAnchor: TagAnchorType;
};

export type TutorialAnchorType = {
    __typename?: 'TutorialAnchorType';
    anchorName: Scalars['String'];
    code?: Maybe<CodeType>;
    createdTime: Scalars['DateTime'];
    graphAnchors: Array<GraphAnchorType>;
    id: Scalars['UUID'];
    itemStatus: Status;
    modifiedTime: Scalars['DateTime'];
    rank: Scalars['String'];
    tagAnchors: Array<TagAnchorType>;
    tutorials: Array<TutorialType>;
    uploads: Array<UploadsType>;
    url: Scalars['String'];
};

export type TutorialType = {
    __typename?: 'TutorialType';
    abstract: Scalars['String'];
    authors: Array<UserType>;
    contentMarkdown: Scalars['String'];
    createdTime: Scalars['DateTime'];
    id: Scalars['UUID'];
    itemStatus: Status;
    langCode: Scalars['String'];
    modifiedTime: Scalars['DateTime'];
    title: Scalars['String'];
    tutorialAnchor: TutorialAnchorType;
};

export type UploadsType = {
    __typename?: 'UploadsType';
    createdTime: Scalars['DateTime'];
    graphAnchors: Array<GraphAnchorType>;
    id: Scalars['UUID'];
    modifiedTime: Scalars['DateTime'];
    name: Scalars['String'];
    tutorialAnchors: Array<TutorialAnchorType>;
};

export type UserType = {
    __typename?: 'UserType';
    createdTime: Scalars['DateTime'];
    displayedName: Scalars['String'];
    email: Scalars['String'];
    graphDescriptions: Array<GraphDescriptionType>;
    graphs: Array<GraphAnchorType>;
    id: Scalars['UUID'];
    isStaff: Scalars['Boolean'];
    modifiedTime: Scalars['DateTime'];
    role: Scalars['Int'];
    tutorials: Array<TutorialAnchorType>;
    username: Scalars['String'];
};

export enum LangCode {
    AF = 'AF',
    AR = 'AR',
    ARDZ = 'AR_DZ',
    AST = 'AST',
    AZ = 'AZ',
    BE = 'BE',
    BG = 'BG',
    BN = 'BN',
    BR = 'BR',
    BS = 'BS',
    CA = 'CA',
    CS = 'CS',
    CY = 'CY',
    DA = 'DA',
    DE = 'DE',
    DSB = 'DSB',
    EL = 'EL',
    EN = 'EN',
    ENAU = 'EN_AU',
    ENGB = 'EN_GB',
    EO = 'EO',
    ES = 'ES',
    ESAR = 'ES_AR',
    ESCO = 'ES_CO',
    ESMX = 'ES_MX',
    ESNI = 'ES_NI',
    ESVE = 'ES_VE',
    ET = 'ET',
    EU = 'EU',
    FA = 'FA',
    FI = 'FI',
    FR = 'FR',
    FY = 'FY',
    GA = 'GA',
    GD = 'GD',
    GL = 'GL',
    HE = 'HE',
    HI = 'HI',
    HR = 'HR',
    HSB = 'HSB',
    HU = 'HU',
    HY = 'HY',
    IA = 'IA',
    ID = 'ID',
    IG = 'IG',
    IO = 'IO',
    IS = 'IS',
    IT = 'IT',
    JA = 'JA',
    KA = 'KA',
    KAB = 'KAB',
    KK = 'KK',
    KM = 'KM',
    KN = 'KN',
    KO = 'KO',
    KY = 'KY',
    LB = 'LB',
    LT = 'LT',
    LV = 'LV',
    MK = 'MK',
    ML = 'ML',
    MN = 'MN',
    MR = 'MR',
    MY = 'MY',
    NB = 'NB',
    NE = 'NE',
    NL = 'NL',
    NN = 'NN',
    OS = 'OS',
    PA = 'PA',
    PL = 'PL',
    PT = 'PT',
    PTBR = 'PT_BR',
    RO = 'RO',
    RU = 'RU',
    SK = 'SK',
    SL = 'SL',
    SQ = 'SQ',
    SR = 'SR',
    SRLATN = 'SR_LATN',
    SV = 'SV',
    SW = 'SW',
    TA = 'TA',
    TE = 'TE',
    TG = 'TG',
    TH = 'TH',
    TK = 'TK',
    TR = 'TR',
    TT = 'TT',
    UDM = 'UDM',
    UK = 'UK',
    UR = 'UR',
    UZ = 'UZ',
    VI = 'VI',
    ZHHANS = 'ZH_HANS',
    ZHHANT = 'ZH_HANT',
}

export enum OperationType {
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
}

export enum Status {
    AUTOSAVE = 'AUTOSAVE',
    CLOSED = 'CLOSED',
    DRAFT = 'DRAFT',
    PRIVATE = 'PRIVATE',
    PUBLISHED = 'PUBLISHED',
    REVIEWING = 'REVIEWING',
    TRASH = 'TRASH',
}

export type CodeMutationType = {
    code?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    name?: Maybe<Scalars['String']>;
    tutorialAnchor?: Maybe<TutorialAnchorMutationType>;
};

export type DatetimeFilterLookup = {
    contains?: Maybe<Scalars['DateTime']>;
    endsWith?: Maybe<Scalars['DateTime']>;
    exact?: Maybe<Scalars['DateTime']>;
    gt?: Maybe<Scalars['DateTime']>;
    gte?: Maybe<Scalars['DateTime']>;
    iContains?: Maybe<Scalars['DateTime']>;
    iEndsWith?: Maybe<Scalars['DateTime']>;
    iExact?: Maybe<Scalars['DateTime']>;
    iRegex?: Maybe<Scalars['String']>;
    iStartsWith?: Maybe<Scalars['DateTime']>;
    inList?: Maybe<Array<Scalars['DateTime']>>;
    isNull?: Maybe<Scalars['Boolean']>;
    lt?: Maybe<Scalars['DateTime']>;
    lte?: Maybe<Scalars['DateTime']>;
    range?: Maybe<Array<Scalars['DateTime']>>;
    regex?: Maybe<Scalars['String']>;
    startsWith?: Maybe<Scalars['DateTime']>;
};

export type DjangoModelFilterInput = {
    pk: Scalars['ID'];
};

export type GraphAnchorFilter = {
    anchorName?: Maybe<StrFilterLookup>;
    createdTime?: Maybe<DatetimeFilterLookup>;
    id?: Maybe<UuidFilterLookup>;
    itemStatus?: Maybe<Status>;
    modifiedTime?: Maybe<DatetimeFilterLookup>;
    url?: Maybe<StrFilterLookup>;
};

export type GraphAnchorMutationType = {
    anchorName?: Maybe<Scalars['String']>;
    defaultOrder?: Maybe<Scalars['Int']>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    tagAnchors?: Maybe<Array<Maybe<TagAnchorMutationType>>>;
    tutorialAnchors?: Maybe<Array<Maybe<OrderedTutorialAnchorBindingType>>>;
    url?: Maybe<Scalars['String']>;
};

export type GraphDescriptionMutationType = {
    authors?: Maybe<Array<Maybe<UserMutationType>>>;
    descriptionMarkdown?: Maybe<Scalars['String']>;
    graphAnchor?: Maybe<GraphAnchorMutationType>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    langCode?: Maybe<Scalars['String']>;
    title?: Maybe<Scalars['String']>;
};

export type GraphMutationType = {
    graphAnchor?: Maybe<GraphAnchorMutationType>;
    graphJson?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    makers?: Maybe<Array<Maybe<UserMutationType>>>;
};

export type OrderedGraphAnchorBindingType = {
    graphAnchor: GraphAnchorMutationType;
    order?: Maybe<Scalars['Int']>;
};

export type OrderedTutorialAnchorBindingType = {
    order?: Maybe<Scalars['Int']>;
    tutorialAnchor: TutorialAnchorMutationType;
};

export type RequestOptionType = {
    floatPrecision?: Maybe<Scalars['Int']>;
    inputList?: Maybe<Array<Scalars['String']>>;
    randSeed?: Maybe<Scalars['Int']>;
};

export type RequestType = {
    code: Scalars['String'];
    graph: Scalars['String'];
    options?: Maybe<RequestOptionType>;
    version: Scalars['String'];
};

export type StrFilterLookup = {
    contains?: Maybe<Scalars['String']>;
    endsWith?: Maybe<Scalars['String']>;
    exact?: Maybe<Scalars['String']>;
    gt?: Maybe<Scalars['String']>;
    gte?: Maybe<Scalars['String']>;
    iContains?: Maybe<Scalars['String']>;
    iEndsWith?: Maybe<Scalars['String']>;
    iExact?: Maybe<Scalars['String']>;
    iRegex?: Maybe<Scalars['String']>;
    iStartsWith?: Maybe<Scalars['String']>;
    inList?: Maybe<Array<Scalars['String']>>;
    isNull?: Maybe<Scalars['Boolean']>;
    lt?: Maybe<Scalars['String']>;
    lte?: Maybe<Scalars['String']>;
    range?: Maybe<Array<Scalars['String']>>;
    regex?: Maybe<Scalars['String']>;
    startsWith?: Maybe<Scalars['String']>;
};

export type TagAnchorFilter = {
    anchorName?: Maybe<StrFilterLookup>;
    createdTime?: Maybe<DatetimeFilterLookup>;
    id?: Maybe<UuidFilterLookup>;
    itemStatus?: Maybe<Status>;
    modifiedTime?: Maybe<DatetimeFilterLookup>;
    tags?: Maybe<DjangoModelFilterInput>;
};

export type TagAnchorMutationType = {
    anchorName?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
};

export type TagMutationType = {
    description?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    langCode?: Maybe<Scalars['String']>;
    name?: Maybe<Scalars['String']>;
    tagAnchor?: Maybe<TagAnchorMutationType>;
};

export type TutorialAnchorFilter = {
    anchorName?: Maybe<StrFilterLookup>;
    createdTime?: Maybe<DatetimeFilterLookup>;
    id?: Maybe<UuidFilterLookup>;
    itemStatus?: Maybe<Status>;
    modifiedTime?: Maybe<DatetimeFilterLookup>;
    rank?: Maybe<StrFilterLookup>;
    tutorials?: Maybe<TutorialFilter>;
    url?: Maybe<StrFilterLookup>;
};

export type TutorialAnchorMutationType = {
    anchorName?: Maybe<Scalars['String']>;
    graphAnchors?: Maybe<Array<Maybe<OrderedGraphAnchorBindingType>>>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    tagAnchors?: Maybe<Array<Maybe<TagAnchorMutationType>>>;
    url?: Maybe<Scalars['String']>;
};

export type TutorialFilter = {
    abstract?: Maybe<StrFilterLookup>;
    authors?: Maybe<UserFilter>;
    contentMarkdown?: Maybe<StrFilterLookup>;
    createdTime?: Maybe<DatetimeFilterLookup>;
    id?: Maybe<UuidFilterLookup>;
    itemStatus?: Maybe<Status>;
    langCode?: Maybe<StrFilterLookup>;
    modifiedTime?: Maybe<DatetimeFilterLookup>;
    title?: Maybe<StrFilterLookup>;
    tutorialAnchor?: Maybe<TutorialAnchorFilter>;
};

export type TutorialMutationType = {
    abstract?: Maybe<Scalars['String']>;
    authors?: Maybe<Array<Maybe<UserMutationType>>>;
    contentMarkdown?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    itemStatus?: Maybe<Status>;
    langCode?: Maybe<Scalars['String']>;
    title?: Maybe<Scalars['String']>;
    tutorialAnchor?: Maybe<TutorialAnchorMutationType>;
};

export type UuidFilterLookup = {
    contains?: Maybe<Scalars['UUID']>;
    endsWith?: Maybe<Scalars['UUID']>;
    exact?: Maybe<Scalars['UUID']>;
    gt?: Maybe<Scalars['UUID']>;
    gte?: Maybe<Scalars['UUID']>;
    iContains?: Maybe<Scalars['UUID']>;
    iEndsWith?: Maybe<Scalars['UUID']>;
    iExact?: Maybe<Scalars['UUID']>;
    iRegex?: Maybe<Scalars['String']>;
    iStartsWith?: Maybe<Scalars['UUID']>;
    inList?: Maybe<Array<Scalars['UUID']>>;
    isNull?: Maybe<Scalars['Boolean']>;
    lt?: Maybe<Scalars['UUID']>;
    lte?: Maybe<Scalars['UUID']>;
    range?: Maybe<Array<Scalars['UUID']>>;
    regex?: Maybe<Scalars['String']>;
    startsWith?: Maybe<Scalars['UUID']>;
};

export type UserFilter = {
    displayedName?: Maybe<StrFilterLookup>;
};

export type UserMutationType = {
    displayedName?: Maybe<Scalars['String']>;
    email?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['UUID']>;
    inMailingList?: Maybe<Scalars['Boolean']>;
    newPassword?: Maybe<Scalars['String']>;
    password?: Maybe<Scalars['String']>;
    username?: Maybe<Scalars['String']>;
};
