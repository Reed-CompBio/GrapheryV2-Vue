import { RecordArrayType } from './execution-types';

export interface RequestType {
    code: string;
    graph: string;
    version: string;
    options: RequestOptions;
}

export interface RequestOptions {
    randSeed: number;
    floatPrecision: number;
    inputList: string[];
}

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
    randSeed: 42,
    floatPrecision: 4,
    inputList: [],
};

export type ErrMsgType = { message: string; traceback: string };

export type ResponseInfoType = { result: RecordArrayType; [key: string]: any };

export interface ResponseObjectType {
    info?: ResponseInfoType | null;
    errors?: ErrMsgType | null;
}

export interface SuccessfulResponseObjectType extends ResponseObjectType {
    info: ResponseInfoType;
    errors: null;
}

export interface ErrorResponseObjectType extends ResponseObjectType {
    info: null;
    errors: ErrMsgType;
}
