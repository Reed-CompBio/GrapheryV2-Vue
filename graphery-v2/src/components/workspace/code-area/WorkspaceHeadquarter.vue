<template>
    <q-bar id="workspace-headquarter">
        <div id="workspace-headquarter-wrapper" style="flex: 1">
            <q-btn
                dense
                flat
                :icon="
                    true ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'
                "
                @click="eventBus.emit('toggleEditorLock')"
            />
            <div class="q-ml-xs">Workspace</div>
            <q-space />
            <div id="progress-wrapper">
                <!-- TODO fix flickering bug -->
                <q-badge id="progress-percentage" color="primary">
                    {{ percentage }}%
                </q-badge>
                <q-slider
                    id="progress-bar"
                    v-model="step"
                    color="primary"
                    :step="1"
                    :min="0"
                    :max="maxStep"
                />
            </div>
            <q-btn-group id="step-buttons" dense flat>
                <q-btn
                    dense
                    icon="mdi-skip-backward"
                    :disable="backwardDisable"
                    @click="eventBus.emit('jump-backward')"
                />
                <q-btn
                    dense
                    icon="mdi-skip-previous"
                    :disable="backwardDisable"
                    @click="eventBus.emit('previous-step')"
                />
                <q-btn
                    dense
                    icon="mdi-skip-next"
                    :disable="forwardDisable"
                    @click="eventBus.emit('next-step')"
                />
                <q-btn
                    dense
                    icon="mdi-skip-forward"
                    :disable="forwardDisable"
                    @click="eventBus.emit('jump-forward')"
                />
            </q-btn-group>
            <q-btn-group id="execution-buttons" dense flat>
                <q-btn
                    dense
                    icon="mdi-console-network"
                    @click="eventBus.emit('execute-remotely')"
                />
                <q-btn
                    dense
                    icon="mdi-console"
                    @click="eventBus.emit('execute-locally')"
                />
            </q-btn-group>
            <q-btn-group id="vcs-buttons" dense flat>
                <q-btn
                    dense
                    icon="mdi-content-save-all-outline"
                    @click="eventBus.emit('toggle-vcs-list')"
                />
                <q-btn
                    dense
                    icon="mdi-content-save-move-outline"
                    @click="eventBus.emit('save-current-to-vcs')"
                />
            </q-btn-group>
            <q-btn-group id="editor-buttons" dense flat>
                <q-btn
                    dense
                    icon="mdi-content-copy"
                    @click="eventBus.emit('copy-editor-code')"
                />
                <q-btn
                    dense
                    icon="mdi-content-paste"
                    @click="eventBus.emit('paste-editor-code')"
                />
                <q-btn
                    dense
                    icon="mdi-arrow-collapse-horizontal"
                    @click="eventBus.emit('toggle-var-list')"
                />
                <q-btn
                    dense
                    icon="mdi-cog-outline"
                    @click="eventBus.emit('toggle-settings')"
                />
            </q-btn-group>
        </div>
    </q-bar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useHeadquarterStorage } from 'stores/headquarter-storage';
import { useHeadquarterBus } from 'components/mixins/controller/headquarter-bus';
import { storeToRefs } from 'pinia';

export default defineComponent({
    setup() {
        const { currentStep, currentRecordArrayMaxLength } = storeToRefs(
            useHeadquarterStorage()
        );
        const eventBus = useHeadquarterBus();
        const step = computed({
            get() {
                return currentStep.value;
            },
            set(v: number) {
                eventBus.emit('step-changed-to', v);
            },
        });
        const percentage = computed(() => {
            return Math.ceil(
                (step.value / currentRecordArrayMaxLength.value) * 100
            );
        });
        const forwardDisable = computed(
            () => step.value == currentRecordArrayMaxLength.value
        );
        const backwardDisable = computed(() => step.value == 0);

        return {
            step,
            eventBus,
            maxStep: currentRecordArrayMaxLength,
            percentage,
            forwardDisable,
            backwardDisable,
        };
    },
});
</script>

<style lang="sass" scoped>
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
    width: 100%

    #progress-bar
        width: inherit
        opacity: 0
        margin-right: 10px

#progress-wrapper:hover #progress-bar, #progress-bar.q-slider--active, #progress-bar:hover
    opacity: 100 !important

#workspace-headquarter-wrapper
    display: grid
    grid-template-columns: 1fr 1fr 1fr 30fr 4fr 2fr 2fr 4fr
    grid-gap: 10px
</style>
