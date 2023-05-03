<docs>
Provides a UI for a proformajs Enactment.

# props

* enactment - a PROformajs enactment
* options - review settings
* debug - allows access to the "Debug expressions" functionality

# events

* change-enactment - signals the need to update the enactment
* change-option - signals an option change

</docs>

<template>
  <div v-if="enactment">
    <template v-if="enactment.protocol.tasks">
      <div class="row">
        <div class="col">
          <div class="float-end">
            <button
              @click="$emit('restart-enactment')"
              class="btn btn-outline-secondary d-none d-sm-inline"
            >
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
            <p-settings
              :id="'popover-reivew'"
              class="d-none d-sm-inline ms-1"
              :options="options"
              placement="left"
              :restart="false"
              @change-option="OnUpdateOptions"
              @restart-enactment="$emit('restart-enactment')"
            />
          </div>
          <h3>
            {{ enactment ? enactment.protocol.caption || enactment.protocol.name : '' }}
            <span class="badge text-bg-warning" v-show="status.finished">Completed</span>
          </h3>
        </div>
      </div>
      <div class="row" v-if="enactment && enactment.protocol.description">
        <div class="col">
          <p-markdown
            class="mb-0"
            :text="enactment.protocol.description"
            @send-trigger="sendTrigger"
          />
        </div>
      </div>
      <hr />
    </template>
    <div class="row">
      <div class="col-md-6 order-md-2">
        <!-- Selected task detail -->
        <template v-if="!enactment.protocol.tasks"
          ><!-- settings dialogue for single decision -->
          <div class="float-end">
            <button
              @click="$emit('restart-enactment')"
              role="button"
              class="btn btn-outline-secondary d-none d-sm-inline"
            >
              <font-awesome-icon icon="redo-alt" /> Restart
            </button>
            <p-settings
              :id="'popover-reivew'"
              :options="options"
              placement="left"
              @change-option="OnUpdateOptions"
              @restart-enactment="$emit('restart-enactment')"
            />
          </div>
        </template>
        <div v-if="status.finished">
          <slot name="finished">
            <h3>All done</h3>
          </slot>
        </div>
        <div v-else>
          <p-task
            :task="activeTask"
            :enactment="enactment"
            @update-enactment="updateEnactment"
            :options="options"
            @send-trigger="sendTrigger"
          />
        </div>
      </div>
      <div class="col-md-6 order-md-1">
        <!-- enactment status tabs -->
        <div>
          <t-tabs small v-model="tabIndex" id="debug-review-tabs">
            <t-tab key="map" id="debug-review-map-tab">
              <template #title>Map <font-awesome-icon icon="directions" /></template>
              <p-map :enactment="enactment" :selectedtask="path" @select-task="updatePath" />
            </t-tab>
            <t-tab key="data" id="debug-review-data-tab">
              <template #title>Data <font-awesome-icon icon="table" /></template>
              <p-data
                :enactment="enactment"
                @update-enactment="updateEnactment"
                :options="options"
              />
            </t-tab>
            <t-tab key="select" id="debug-review-select-tab">
              <template #title>Select <font-awesome-icon icon="hand-pointer" /></template>
              <div class="row">
                <div class="col-sm-6">
                  <div>
                    <!-- used to be a card-deck -->
                    <div class="card">
                      <div class="card-header">
                        <h5>Available Tasks</h5>
                      </div>
                      <div class="card-body">
                        <div class="list-group" v-if="availableTasks.length > 0">
                          <button
                            v-for="task in availableTasks"
                            :data-path="path"
                            :data-taskpath="task.path"
                            :class="
                              'list-group-item list-group-item-action ' +
                              (task.path == path ? 'active' : '')
                            "
                            :key="task.name"
                            @click="updatePath({ value: task.path })"
                          >
                            {{ task.caption || task.name }}
                          </button>
                        </div>
                        <p v-else class="text-muted">No currently available tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div>
                    <!-- used to be a card-deck -->
                    <div class="card">
                      <div class="card-header">
                        <h5>Triggers</h5>
                      </div>
                      <div class="card-body">
                        <div
                          class="list-group"
                          v-if="status && status.triggers && status.triggers.length > 0"
                        >
                          <button
                            class="list-group-item list-group-item-action"
                            v-for="(trigger, index) in status.triggers"
                            :key="index"
                            @click="sendTrigger(trigger)"
                          >
                            {{ trigger }}
                          </button>
                        </div>
                        <p v-else class="text-muted">No available triggers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </t-tab>
            <t-tab key="history" id="debug-review-history-tab">
              <template #title>History <font-awesome-icon icon="history" /></template>
              <p-history :enactment="enactment" />
            </t-tab>
          </t-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EnactmentMixin } from './perform'
import { Tab, Tabs } from '@openclinical/proformajs-vue3-tools'

export default {
  mixins: [EnactmentMixin],
  components: {
    't-tab': Tab,
    't-tabs': Tabs
  },
  emits: ['change-option'],
  data() {
    return {
      tabIndex: 0
    }
  },
  methods: {
    OnUpdateOptions(opts) {
      this.$emit('change-option', opts)
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 1.25rem;
}

.list-group-item {
  padding: 0.75rem 1.25rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
