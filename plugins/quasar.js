import Vue from 'vue';
import {
  Quasar,
  QPage,
  QBtn,
  QToolbarTitle,
  QToolbar,
  QCard,
  QCardSection,
  QPageContainer,
  QDrawer,
  QLayout,
  QList,
  QHeader,
  QItemLabel,
  QIcon,
  QItemSection,
  QItem,
} from 'quasar';

const quasarUserOptions = {
  components: {
    QPage,
    QBtn,
    QToolbarTitle,
    QToolbar,
    QCard,
    QCardSection,
    QPageContainer,
    QList,
    QLayout,
    QDrawer,
    QHeader,
    QItemLabel,
    QIcon,
    QItemSection,
    QItem,
  },
  plugins: {},
};
Vue.use(Quasar, quasarUserOptions);
