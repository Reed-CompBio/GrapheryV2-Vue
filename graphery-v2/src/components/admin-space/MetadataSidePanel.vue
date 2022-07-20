<template>
    <q-card>
        <div>
            <TabStripe v-model="editTab" :tab-selection="editTabs" />
        </div>
        <q-separator />
        <q-tab-panels v-model="editTab" animated>
            <q-tab-panel name="metadata">
                <q-input model-value="" hint="Tutorial URL" />
                <q-input model-value="" hint="Tutorial Name" />
                <q-select model-value="" hint="Tags" />
                <q-select model-value="" hint="Authors" />
                <q-input model-value="" hint="Description" type="textarea" />
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabStripe from 'components/admin-space/TabStripe.vue';
export default defineComponent({
    components: { TabStripe },
    setup() {
        const editTab = ref('metadata');
        const editTabs = [{ label: 'Metadata', name: 'metadata', icon: '' }];
        return { editTab, editTabs };
    },
});
</script>
