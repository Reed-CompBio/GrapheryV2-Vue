<template>
    <div class="footer-wrapper">
        <div class="justify-between footer-container">
            <div class="left-section">
                <div class="logo flex no-wrap justify-start">
                    <div
                        v-for="(letter, index) in logoTextList"
                        :key="index"
                        class="logo-text"
                    >
                        {{ letter }}
                    </div>
                </div>
                <div class="icon-row">
                    <!-- TODO: The title of icon should go with i18n -->
                    <div class="github"></div>
                    <a
                        href="https://github.com/Reed-Compbio/GrapheryV2-Vue"
                        target="_blank"
                        rel="noreferrer"
                        :title="t('nav.GithubRepo')"
                    >
                        <q-icon name="mdi-github"></q-icon>
                    </a>
                    <a
                        :href="issueLink"
                        target="_blank"
                        rel="noreferrer"
                        title="Github Issues"
                    >
                        <q-icon name="mdi-information"></q-icon>
                    </a>
                    <a
                        :href="mailToLink"
                        target="_blank"
                        rel="noreferrer"
                        :title="t('nav.EmailUs')"
                    >
                        <q-icon name="mdi-email"></q-icon>
                    </a>
                    <router-link :to="{ name: 'FAQ' }" :title="t('nav.faq')">
                        <q-icon name="mdi-comment-question"></q-icon>
                    </router-link>
                </div>
            </div>
            <div class="right-section">
                <div>
                    2020 - 2021 ©
                    <router-link :to="{ name: 'About' }">
                        Graphery
                    </router-link>
                    |
                    <router-link :to="{ name: 'FAQ' }" :title="t('nav.faq')">
                        FAQ
                    </router-link>
                    |
                    <router-link :to="{ name: 'TOS' }" :title="t('nav.tos')">
                        TOS
                    </router-link>
                </div>
                <div>
                    Built with
                    <q-icon
                        name="mdi-heart"
                        style="color: rgb(212, 63, 87)"
                    ></q-icon>
                    and
                    <a
                        href="https://quasar.dev"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Quasar
                    </a>
                    <!-- TODO: import Quasar SVG as font icon / ref to iconmoon -->
                    powered by
                    <a
                        href="https://vuejs.org"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <q-icon name="mdi-vuejs" class="icon-adjust"></q-icon
                        >Vue
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    setup() {
        return {
            logoTextList: ['G', 'R', 'A', 'P', 'H', 'E', 'R', 'Y'],
            issueLink: 'https://github.com/Reed-Compbio/GrapheryV2-Vue/issues',
            mailToLink:
                'mailto:graphery@groups.reed.edu?subject=Graphery%20Feedback&body=Please%20describe%20in%20detail%3A%0D%0A1.%20if%20something%20looks%20wrong%2C%20please%20tell%20us%20what%20it%20should%20be%20like%20and%20how%20we%20can%20reproduce%20the%20problem%0D%0A2.%20if%20something%20can%20be%20better%2C%20please%20tell%20us%20how%20we%20can%20improve%20and%20the%20reasons%0D%0A%0D%0AThank%20you%20so%20much!',
            t: useI18n().t,
        };
    },
});
</script>

<style lang="sass" scoped>
@import "src/css/quasar.variables"

.footer-wrapper a
  color: grey
  text-decoration: none
  &:hover
    color: #464646

.footer-wrapper
  color: grey
  max-width: $material-page-max-width
  margin: -70px auto 48px
  padding: 0 32px

  .footer-container
    display: flex
    flex-direction: row
    @media (max-width: $breakpoint-sm-max)
      flex-direction: column
    .left-section
      display: flex
      flex-direction: row
      @media (max-width: $breakpoint-sm-max)
        margin-bottom: 10px
        flex-direction: column
        justify-content: center
        align-items: center
        text-align: center
      .logo
        cursor: default
        .logo-text
          font-size: 30px
          font-family: "Amiri", serif
          color: grey
          transition: .8s ease
          user-select: none
          &:hover
            color: #A70E16
            transition: .1s ease
      .icon-row
        margin-left: 30px
        margin-top: 3px
        @media (max-width: $breakpoint-sm-max)
          margin-left: 0
          margin-top: -6px
        // adjust the line height
        & a
          // the size of icon
          font-size: 22px
          // the padding between diff icons
          padding: 0 15px

    .right-section
      text-align: right
      @media (max-width: $breakpoint-sm-max)
        text-align: center
      & i
        margin-right: 1px
</style>
