import config from '~/service/config';

export default function ({ $axios }, inject) {
  const api = $axios.create(config);

  // interceptors

  // inject in $root and context
  // https://nuxtjs.org/docs/directory-structure/plugins/#inject-in-root--context
  inject('api', api);
}
