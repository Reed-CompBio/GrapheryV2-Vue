<template>
    <div class="page">
        <div
            :class="['welcome-box', 'flex-center', rowControl]"
            class="justify-center"
        >
            <div :class="[colControl]" class="flex justify-center">
                <img :src="homePageLogo" class="logo" alt="site logo" />
            </div>
            <div :class="[colControl]" class="graphery-text justify-center">
                <h3 class="welcome-title">
                    Welcome to <span class="logo-text">{{ siteName }}</span>
                </h3>
                <div class="home-intro-text">
                    <p>
                        This is a interactive graph algorithm tutorial website.
                    </p>
                    <p>Check out our tutorials and play with graphs.</p>
                    <p>
                        More info is listed in
                        <router-link :to="{ name: 'About' }">
                            About
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
        <q-separator />
        <div class="quick-facts flex-center">
            <div
                :class="[rowControl]"
                class="fit"
                style="justify-content: space-between"
            >
                <div
                    :key="index"
                    v-for="(item, index) in featureList"
                    :class="['feature', colControl]"
                >
                    <div class="icon">
                        <q-icon :name="item.icon"></q-icon>
                    </div>
                    <div class="text-wrapper">
                        <div :class="['title', colControl]">
                            {{ item.title }}
                        </div>
                        <div :class="['description', colControl]">
                            <p>
                                {{ item.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { SITE_NAME } from 'src/utils/vars';
import { ScreenSizes, useScreenSizes } from 'components/mixins/screen-sizes';

export default defineComponent({
    setup() {
        const homePageLogo = require('src/assets/images/compbio-lab.png');
        const featureList = [
            {
                title: 'Tutorials',
                description: 'Graphery is a tutorial based webservice',
                icon: 'mdi-script-text-outline',
            },
            {
                title: 'Interaction and Customization',
                description:
                    'Provide interactive graphs and allow users to write their own code to interact with existing graphs',
                icon: 'mdi-cursor-default-click-outline',
            },
            {
                title: 'Visualization',
                description:
                    'Execute and visualize execution results of example code and customized code',
                icon: 'mdi-eye-check-outline',
            },
        ];

        const { mediumAndLarger } = useScreenSizes() as ScreenSizes;

        const rowControl = computed(() => {
            if (mediumAndLarger) {
                return 'row';
            } else {
                return 'col';
            }
        });

        const colControl = computed(() => {
            if (mediumAndLarger) {
                return 'col';
            } else {
                return 'row';
            }
        });

        return {
            homePageLogo,
            featureList,
            rowControl,
            colControl,
            siteName: SITE_NAME,
        };
    },
});
</script>

<style lang="sass">
@use "src/css/quasar.variables" as vars
// TODO: the color specification will be defined in one stylesheet.

.button-wrapper
    margin: 5px 10px
    .feedback-item
        text-align: center
        font-weight: bold
.welcome-box
    margin: 1rem 0
    align-items: center
    flex-direction: row
    padding: 0 4%
    width: 100% !important
    min-height: 400px
    .logo
        height: 250px
        width: 250px
        @media (max-width: $breakpoint-sm-max)
            height: 150px
            width: 150px
    .graphery-text
        text-align: center
        padding: 0 30px
        @media (max-width: $breakpoint-sm-min)
            padding: 0
        .welcome-title
            font-family: Georgia, serif
            margin: 20px auto
            @media (max-width: $breakpoint-sm-max)
                font-size: 40px
            .logo-text
                font-family: "Amiri", serif
                text-transform: capitalize
                color: vars.$primary
                margin-left: 100px
                @media (max-width: $breakpoint-sm-max)
                    margin-left: 1px
        .home-intro-text
            text-align: left
            font-size: 18px
            line-height: 20px
            @media (max-width: $breakpoint-sm-max)
                text-align: center
                font-size: 14px
                line-height: 18px
                margin: auto -10px

            p
                margin-bottom: 7px
.quick-facts
    display: flex
    align-content: space-between
    //flex-wrap: wrap
    //align-items: center
    //justify-content: flex-start
    margin-top: 25px
    .feature
        display: flex
        flex-direction: column
        padding: 0 4px
        //justify-content: space-between
        align-items: center
        //margin: 0 130px
        text-align: center
        .icon
            font-size: 100px
            color: vars.$primary
        .text-wrapper
            display: flex
            flex-direction: column
            align-items: center
            .title
                font-size: 25px
                font-family: "Amiri", serif
                //font-weight: bold
                margin-bottom: 10px
            .description
                p
                    font-size: 16px
</style>
