<template>
    <q-bar id="workspace-headquarter">
        <div id="workspace-headquarter-wrapper">
            <div id="workspace-headquarter-title">
                <q-btn
                    dense
                    flat
                    :icon="
                        editor.readOnly
                            ? 'mdi-lock-outline'
                            : 'mdi-lock-open-variant-outline'
                    "
                    @click="eventBus.emit('toggle-editor-lock')"
                />
                <div class="q-ml-xs">Workspace</div>
            </div>
            <div id="progress-wrapper">
                <q-badge id="progress-percentage" color="primary">
                    {{ percentage }}%
                </q-badge>
                <q-slider
                    id="progress-bar"
                    v-model="step"
                    color="primary"
                    label
                    switch-label-side
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
            <!-- <q-btn-group id="vcs-buttons" dense flat>
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
            </q-btn-group> -->
            <q-btn-group id="editor-buttons" dense flat>
                <q-btn
                    dense
                    icon="mdi-content-copy"
                    @click="eventBus.emit('copy-editor-code')"
                />
                <!--                <q-btn-->
                <!--                    dense-->
                <!--                    icon="mdi-content-paste"-->
                <!--                    @click="eventBus.emit('paste-editor-code')"-->
                <!--                />-->
                <!--                <q-btn-->
                <!--                    dense-->
                <!--                    icon="mdi-arrow-collapse-horizontal"-->
                <!--                    @click="eventBus.emit('toggle-var-list')"-->
                <!--                />-->
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
import { PropType } from 'vue';
import { useHeadquarterBus } from 'components/mixins/controller/headquarter-bus';
import { storeToRefs } from 'pinia';
import { StateTree, Store } from 'pinia';
import { useSettingsStorage } from 'stores/settings/settings-storage';
import type { IStateGetters } from 'src/stores/store-interfaces';

export default defineComponent({
    props: {
        storage: {
            type: Object as PropType<Store<string, StateTree, IStateGetters>>,
            required: true,
        },
    },
    setup(props) {
        const { currentStep, currentRecordArrayMaxLength } = storeToRefs(
            props.storage
        );
        const { editor } = storeToRefs(useSettingsStorage());
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
            editor,
        };
    },
});
</script>

<style lang="sass" scoped>
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
        transition-delay: 150ms
        transition-duration: 200ms
        transition-timing-function: ease-in
        margin-right: 10px

#progress-wrapper:hover #progress-bar, #progress-wrapper>.q-slider--active, #progress-bar:hover
    opacity: 100 !important
    transition-duration: 200ms
    transition-timing-function: ease-out


#workspace-headquarter-wrapper
    flex: 1
    display: grid
    grid-template-columns: 1fr 35fr 4fr 2fr 2fr
    grid-gap: 15px

    #workspace-headquarter-title
        display: grid
        grid-template-columns: 1fr 1fr
        grid-gap: 2px
</style>
