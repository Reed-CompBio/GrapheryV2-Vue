<template>
    <div>
        <div>
            <TabStripe v-model="editTab" :tab-selection="editTabs" />
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
                    <TutorialGraphEditor />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabStripe from 'components/admin-space/TabStripe.vue';
import TutorialTextEditor from 'components/admin-space/TutorialTextEditor.vue';
import TutorialGraphEditor from 'components/admin-space/TutorialGraphEditor.vue';
export default defineComponent({
    components: { TabStripe, TutorialTextEditor, TutorialGraphEditor },
    setup() {
        const editTab = ref<'tutorial' | 'code'>('tutorial');
        const editTabs = [
            { label: 'Tutorial', name: 'tutorial', icon: '' },
            { label: 'Code', name: 'code', icon: '' },
        ];
        return { editTab, editTabs };
    },
});
</script>
