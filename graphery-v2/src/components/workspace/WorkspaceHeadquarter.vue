<template>
    <q-bar id="workspace-headquarter">
        <q-btn
            dense
            flat
            :icon="
                headquarterStorage.csv.locked
                    ? 'mdi-lock-outline'
                    : 'mdi-lock-open-variant-outline'
            "
            @click="eventBus.emit('toggleEditorLock')"
        />
        <div class="q-ml-xs">Workspace</div>
        <q-space />
        <div id="progress-wrapper">
            <q-badge id="progress-percentage" color="primary"> 95 % </q-badge>
            <q-slider
                id="progress-bar"
                v-model="step"
                color="primary"
                :step="1"
                :min="1"
            />
        </div>
        <q-btn-group dense flat id="step-buttons">
            <q-btn
                dense
                icon="mdi-skip-backward"
                @click="eventBus.emit('jumpBackward')"
            />
            <q-btn
                dense
                icon="mdi-skip-previous"
                @click="eventBus.emit('previousStep')"
            />
            <q-btn
                dense
                icon="mdi-skip-next"
                @click="eventBus.emit('nextStep')"
            />
            <q-btn
                dense
                icon="mdi-skip-forward"
                @click="eventBus.emit('jumpForward')"
            />
        </q-btn-group>
        <q-btn-group dense flat id="execution-buttons">
            <q-btn
                dense
                icon="mdi-console-network"
                @click="eventBus.emit('executeRemotely')"
            />
            <q-btn
                dense
                icon="mdi-console"
                @click="eventBus.emit('executeLocally')"
            />
        </q-btn-group>
        <q-btn-group dense flat id="vcs-buttons">
            <q-btn
                dense
                icon="mdi-content-save-all-outline"
                @click="eventBus.emit('toggleSavesList')"
            />
            <q-btn
                dense
                icon="mdi-content-save-move-outline"
                @click="eventBus.emit('saveCurrent')"
            />
        </q-btn-group>
        <q-btn-group dense flat id="editor-buttons">
            <q-btn
                dense
                icon="mdi-content-copy"
                @click="eventBus.emit('copyCode')"
            />
            <q-btn
                dense
                icon="mdi-content-paste"
                @click="eventBus.emit('pasteCode')"
            />
            <q-btn
                dense
                icon="mdi-arrow-collapse-horizontal"
                @click="eventBus.emit('toggleVarList')"
            />
            <q-btn
                dense
                icon="mdi-cog-outline"
                @click="eventBus.emit('toggleSettings')"
            />
        </q-btn-group>
    </q-bar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useHeadquarterStorage } from 'stores/headquarter-storage';
import { useBus } from 'components/mixins/controller/headquarter';

export default defineComponent({
    setup() {
        const headquarterStorage = useHeadquarterStorage();
        const eventBus = useBus();
        const step = computed({
            get() {
                return headquarterStorage.stepInfo.currentStep;
            },
            set(v: number) {
                eventBus.emit('stepChangedTo', v);
            },
        });

        return { headquarterStorage, step, eventBus };
    },
});
</script>

<style lang="sass" scoped>
#right-controls
    .q-btn-group
        margin-right: 15px

    .q-btn-group:last-child
        margin-right: 8px

#progress-percentage
    margin-right: 5px
    padding: 6px

#progress-wrapper
    display: flex
    flex-direction: row-reverse
    width: 70%

    #progress-bar
        width: inherit
        opacity: 0
        margin-right: 10px

#progress-wrapper:hover #progress-bar, #progress-bar.q-slider--active, #progress-bar:hover
    opacity: 100 !important
    // TODO: fix flickering bug
</style>
