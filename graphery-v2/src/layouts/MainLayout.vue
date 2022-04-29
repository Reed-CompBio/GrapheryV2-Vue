<template>
    <q-layout view="hHh lpR fFf">
        <PageHeader></PageHeader>
        <q-ajax-bar color="grey" size="5px"></q-ajax-bar>
        <q-page-container>
            <router-view />
        </q-page-container>
        <NavigationDrawer v-if="$q.screen.lt.md"></NavigationDrawer>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { useMeta } from 'quasar';
import { MetaOptions } from 'quasar/dist/types/meta';
import PageHeader from 'components/layout/PageHeader.vue';

const NavigationDrawer = defineAsyncComponent(
    () => import('components/layout/NavigationDrawer.vue')
);

const metaData: MetaOptions = {
    title: 'Main',
    titleTemplate: (title) => `${title} | Graphery`,
};

export default defineComponent({
    name: 'MainLayout',

    components: {
        PageHeader,
        NavigationDrawer,
    },

    setup() {
        useMeta(metaData);

        {
            // console info
            console.log(
                '%c' +
                    ' o-o               o                 \n' +
                    'o                  |                 \n' +
                    '|  -o o-o  oo o-o  O--o o-o o-o o  o \n' +
                    "o   | |   | | |  | |  | |-' |   |  | \n" +
                    ' o-o  o   o-o-O-o  o  o o-o o   o--O \n' +
                    '              |                    | \n' +
                    '              o                 o--o ',
                'color: #A70E16'
            );
            console.log('Welcome to Graphery, a graph tutorial website');
            console.log('GitHub: https://github.com/FlickerSoul/Graphery');
        }

        return {};
    },
});
</script>
