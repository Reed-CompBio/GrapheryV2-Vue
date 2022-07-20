<template>
    <div>
        <div>
            <q-toolbar class="admin-editor-toolbar">
                <q-btn
                    icon="mdi-hamburger"
                    flat
                    dense
                    @click="toggleMetadata"
                />
                <q-toolbar-title> Tutorial Editor </q-toolbar-title>
                <TabStripe
                    v-model="editTab"
                    :tab-selection="editTabs"
                    shrink
                    inline-labels
                />
            </q-toolbar>
        </div>
        <q-separator />
        <div class="full-height">
            <q-tab-panels
                v-model="editTab"
                class="full-height"
                animated
                keep-alive
            >
                <q-tab-panel name="tutorial">
                    <TutorialTextEditor />
                </q-tab-panel>
                <q-tab-panel name="code">
                    <TutorialCodeEditor />
                </q-tab-panel>
                <q-tab-panel name="graph">
                    <TutorialGraphEditor />
                </q-tab-panel>
            </q-tab-panels>
        </div>
        <div class="admin-panel-metadata">
            <MetadataSidePanel />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabStripe from 'components/admin-space/TabStripe.vue';
import TutorialTextEditor from 'components/admin-space/TutorialTextEditor.vue';
import TutorialCodeEditor from 'components/admin-space/TutorialCodeEditor.vue';
import TutorialGraphEditor from 'components/admin-space/TutorialGraphEditor.vue';
import MetadataSidePanel from 'components/admin-space/MetadataSidePanel.vue';
export default defineComponent({
    components: {
        TabStripe,
        TutorialTextEditor,
        TutorialCodeEditor,
        TutorialGraphEditor,
        MetadataSidePanel,
    },
    setup() {
        const editTab = ref<'tutorial' | 'code'>('tutorial');
        const editTabs = [
            { label: 'Tutorial', name: 'tutorial', icon: '' },
            { label: 'Code', name: 'code', icon: '' },
            { label: 'Graph', name: 'graph', icon: '' },
        ];
        const metadataShow = ref(true);

        return {
            editTab,
            editTabs,
            toggleMetadata() {
                metadataShow.value = !metadataShow.value;
            },
            metadataShow,
        };
    },
});
</script>

<style lang="sass">
.admin-panel-metadata
    position: absolute
    right: 0
    top: 10% // fix centering
</style>
