<docs>
Provides a bootstrap tabs element that contains
* an svg protocol map editor
* a protocol component editor
* a view of the underlying json code
that can be used to edit a PROformajs protocol:

# props

* protocol - a PROformajs protocol
* selectedtask - path of the currently selected task

# events

* change-protocol - signal change to protocol, pass updated protocol in event
* select-task - signal selected task has changed, pass new path in event
</docs>

<template>
  <div @input="focusAce">
    <div class="tab-content mt-2">
      <div class="tab-pane active" id="c-tabs-editor-p">
        <div class="row">
          <div v-bind:class="{ 'col-sm-8': protocol.tasks, 'col-sm-5': !protocol.tasks }">
            <c-map
              :protocol="protocol"
              :selectedtask="selectedtask"
              @select-task="$emit('select-task', $event)"
              @delete-task="modal.show()"
              :issues="allIssues"
            />
          </div>
          <div v-bind:class="{ 'col-sm-4': protocol.tasks, 'col-sm-7': !protocol.tasks }">
            <c-task
              ref="taskEditor"
              :protocol="protocol"
              :path="selectedtask"
              :issues="selectedTaskIssues"
              @change-protocol="relayChangeEvent($event, 1)"
              @delete-task="modal.show()"
              @select-task="$emit('select-task', $event)"
            />
          </div>
        </div>
        <!-- Modal Component -->
        <div
          ref="deleteTaskModal"
          class="modal fade"
          id="c-modal"
          tabindex="-1"
          aria-labelledby="c-modal-label"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="c-modal-label">Remove task</h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <p class="my-4">Are you sure you wish to remove this task?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  @click.prevent="deleteTask"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane" id="c-tabs-code-p">
        <div class="row">
          <div class="col-sm-4">
            <c-tree
              :protocol="protocol"
              :selectedtask="selectedtask"
              @select-task="$emit('select-task', $event)"
            />
          </div>
          <div class="col-sm-8">
            <c-code
              ref="code"
              :protocol="protocol"
              :selectedtask="selectedtask"
              @change-protocol="relayChangeEvent($event, 2)"
            />
          </div>
        </div>
      </div>
    </div>

    <ul class="nav nav-pills" :id="'c-tabs'" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="c-tabs-editor"
          data-bs-toggle="pill"
          data-bs-target="#c-tabs-editor-p"
          type="button"
          role="tab"
          aria-controls="c-tabs-editor-p"
          aria-selected="true"
        >
          Editor
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="c-tabs-code"
          data-bs-toggle="pill"
          data-bs-target="#c-tabs-code-p"
          type="button"
          role="tab"
          aria-controls="c-tabs-code-p"
          aria-selected="true"
        >
          Code
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import ComposeMap from './ComposeMap.vue'
import ComposeTask from './ComposeTask.vue'
import ComposeTree from './ComposeTree.vue'
import ComposeCode from './ComposeCode.vue'
import { Protocol } from '@openclinical/proformajs'
import { TemporalConstraintMixin } from '@openclinical/proformajs-vue3-map'
import { Modal } from 'bootstrap'

export default {
  name: 'c-compose',
  mixins: [TemporalConstraintMixin],
  emits: ['change-protocol', 'select-task'],
  props: ['protocol', 'selectedtask'],
  components: {
    'c-code': ComposeCode,
    'c-task': ComposeTask,
    'c-map': ComposeMap,
    'c-tree': ComposeTree
  },
  data: function () {
    return {
      jsonValid: true,
      modal: undefined
    }
  },
  mounted() {
    this.modal = new Modal('#c-modal', {
      keyboard: true
    })
  },
  computed: {
    allIssues() {
      return this.jsonValid ? this.protocol.validate() : []
    },
    selectedTaskIssues() {
      if (this.jsonValid) {
        let issues = this.protocol
          .validate()
          .filter((issue) => issue.path.startsWith(this.selectedtask))
        return issues
      } else {
        return []
      }
    },
    protocolValid() {
      return this.protocol.isValid()
    }
  },
  methods: {
    focusAce(evt) {
      // when the code tab is hidden the ace editor doesnt update (which is good)
      // but I find I need to force focus when it is revealed...
      if (evt == 1) {
        // index of code tab
        this.$refs.code.focusSelected()
      }
    },
    selectTask(path) {
      function parentTask(comp) {
        if (comp instanceof Protocol.Task) {
          return comp
        } else {
          if (comp._parent) {
            return parentTask(comp._parent)
          }
        }
      }
      const task = parentTask(this.protocol.getComponent(path)).path()
      this.$emit('select-task', { value: task })
    },
    deleteTask() {
      let selected = this.protocol.getComponent(this.selectedtask)
      let plan = selected._parent
      // remove downstream tasks
      for (let task of plan.tasks) {
        if (task.name != selected.name) {
          let deps = this.getTemporalDeps(task)
          if (deps.indexOf(selected.name) > -1) {
            this.removeAntecedent(selected._parent.path(), selected.name, task.name)
          }
        }
      }
      // remove upstream tasks
      for (let dep of this.getTemporalDeps(selected)) {
        this.removeAntecedent(selected._parent.path(), dep, selected.name)
      }
      // delete task
      plan.tasks.splice(plan.tasks.indexOf(selected), 1)
      this.$emit('select-task', { value: plan.path() })
      this.$emit('change-protocol', { value: this.protocol, emitter: 'p-compose.0' })
    },
    relayChangeEvent(evt, idx) {
      evt.relay = 'p-compose.' + idx
      this.$emit('change-protocol', evt)
    }
  }
}
</script>
