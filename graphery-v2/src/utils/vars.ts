export const SITE_NAME = 'Graphery';

export const NAVIGATION_BUTTONS = [
    { name: 'Home', icon: 'mdi-home-circle' },
    { name: 'Tutorials', icon: 'mdi-newspaper-variant' },
    { name: 'Graphs', icon: 'mdi-graph' },
    { name: 'About', icon: 'mdi-clipboard-account-outline' },
    { name: 'Account', icon: 'mdi-account-circle' },
    { name: 'Settings', icon: 'mdi-cog' },
];

export const HEADER_SIZE = 50;
export const MENU_HEADER_SIZE = 56;

const PROD_BASE_URL = 'https://api-graphery.reedcompbio.org';
const DEV_BASE_URL = 'http://localhost:8000';
export const BASE_URL = `${
    process.env.NODE_ENV === 'production' ? PROD_BASE_URL : DEV_BASE_URL
}/graphql/sync`;

export const LOCAL_EXECUTION_URL = 'http://localhost';
