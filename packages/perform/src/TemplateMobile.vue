<docs>
Provides a very simple mobile UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

todo:
* mobile view
* single task mode
</docs>

<template>
  <div v-if="enactment">
    <div class="row">
      <div class="col">
        <div class="progress" style="height: 3px">
          <div
            class="progress-bar"
            role="progressbar"
            aria-label="Progress"
            :aria-valuenow="progress.toString()"
            aria-valuemin="0"
            :aria-valuemax="taskCount.toString()"
            :style="{
              width: ((progress * 100) / taskCount).toString() + '%'
            }"
          ></div>
        </div>
        <div v-if="status.finished">
          <slot name="finished">
            <div class="d-grid gap-2 mt-2">
              <h3>Completed</h3>
              <button class="btn btn-outline-secondary d-block" @click="restartEnactment">
                <font-awesome-icon icon="redo-alt" /> Restart
              </button>
            </div>
          </slot>
        </div>
        <div v-else>
          <p-task
            :task="activeTask"
            :enactment="enactment"
            @update-enactment="updateEnactment"
            :options="options"
            @send-trigger="sendTrigger"
            class="mt-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EnactmentMixin } from './perform'

export default {
  mixins: [EnactmentMixin],
  emits: ['restart-enactment'],
  computed: {
    taskCount() {
      return this.enactment ? this.enactment.getTasks().length : 1
    },
    progress() {
      return this.enactment
        ? this.enactment
            .getTasks()
            .filter((task) => task.state == 'discarded' || task.state == 'completed').length
        : 0
    }
  },
  methods: {
    restartEnactment() {
      this.view = 'task'
      this.$emit('restart-enactment')
    }
  }
}
</script>
