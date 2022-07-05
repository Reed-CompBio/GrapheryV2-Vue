<template>
    <div class="cover-wrapper flex justify-between">
        <div v-if="mediumAndLarger" class="text-bold cover-text">
            {{ coverTitle }}
        </div>
        <div>
            <img :src="logoPath" class="logo" alt="comp bio logo" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useScreenSizes } from 'components/mixins/screen-sizes';

export default defineComponent({
    name: 'MaterialCover',
    props: {
        coverTitle: {
            type: String,
            required: true,
        },
        logoPath: {
            type: String,
            default: require('src/assets/images/compbio-lab-white.png'),
        },
    },
    setup() {
        const { mediumAndLarger } = useScreenSizes();

        return {
            mediumAndLarger,
        };
    },
});
</script>

<style lang="sass" scoped>
@use 'src/css/quasar.variables' as vars

$water-mark-opacity: .15
.cover-wrapper
    background-color: vars.$primary
    height: 200px
    .cover-text
        margin-left: 2rem
        margin-top: -2rem
        opacity: $water-mark-opacity
        color: #fff
        font-size: 9rem

    .logo
        width: 300px
        height: 300px
        opacity: $water-mark-opacity
        margin-right: 2.2rem
</style>
