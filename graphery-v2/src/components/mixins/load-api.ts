import { apolloClient } from 'src/utils/graphql-client';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@apollo/client';

export class APILoader<T extends Record<string, undefined>> {
    query: DocumentNode | TypedDocumentNode;
    static API_CLIENT = apolloClient;

    constructor(query: DocumentNode | TypedDocumentNode) {
        this.query = query;
    }

    async load(payload: T | undefined = undefined) {
        // TODO: finish loader
        const csrfToken = ''; // replace this with csrfToken
        return await APILoader.API_CLIENT.query({
            query: this.query,
            variables: payload as T,
            context: {
                'X-CSRFToken': csrfToken,
            },
        });
    }
}
