import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from 'src/utils/graphql-client';

export default boot(({ app }) => {
    // something to do
    app.provide(DefaultApolloClient, apolloClient);
});
