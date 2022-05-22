<template>
    <div>
        <MaterialCover :cover-title="pageName" />
        <q-page class="page">
            <div class="container q-mx-auto">
                <div class="content-container-wrapper">
                    <router-view></router-view>
                </div>
            </div>
        </q-page>
        <PageFooter></PageFooter>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import MaterialCover from 'components/layout/MaterialCover.vue';
import { useRoute } from 'vue-router';
import { useMeta } from 'quasar';

const PageFooter = defineAsyncComponent(
    () => import('components/layout/PageFooter.vue')
);
export default defineComponent({
    components: {
        MaterialCover,
        PageFooter,
    },
    setup() {
        const { name, meta } = useRoute();

        if (meta.pageMetaData) {
            useMeta(meta.pageMetaData);
        }

        return { pageName: name as string };
    },
});
</script>

<style lang="sass" scoped>
@use "../css/quasar.variables" as vars

.page
  clear: both
  // cooperate with Material Cover
  top: -8rem

.page
  @media (max-width: $breakpoint-xs-max)
    padding-left: 0
    padding-right: 0
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    padding-left: 32px
    padding-right: 32px
  @media (min-width: $breakpoint-lg-min)
    padding-left: 64px
    padding-right: 64px

.container
  min-height: inherit
  max-width: vars.$material-page-max-width
  box-shadow: rgba(0, 0, 0, 0.25) 0 25px 50px -12px

.body--light .container
  background-color: #ffffff
.body--dark .container
  background-color: #272727

.content-container-wrapper
  display: flex
  flex-direction: column
  min-height: 100%

.container
  @media (max-width: $breakpoint-xs-max)
    padding: 16px 7% 50px
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    margin-bottom: 24px
    padding: 16px 6% 50px
  @media (min-width: $breakpoint-lg-min)
    margin-bottom: 24px
    padding: 16px 0 50px

.content-container-wrapper
  margin: 0 auto
  max-width: 900px
</style>
