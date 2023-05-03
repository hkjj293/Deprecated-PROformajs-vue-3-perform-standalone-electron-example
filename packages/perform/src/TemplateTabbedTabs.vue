<docs>
Provides a clickable, nestable row of task tabs for ReviewTabbed.

# props

* plan - a PROformajs enactment plan that provides the list of tasks
* selected - the path of the currently presented task

# events

* select-task - change the currently presented task

# notes

This component is separate to ReviewTabbed as you might have multiple rows of tabs for plans with sub-plans and sub-sub-plans and so on (hence its called a nestable set of task tabs).

Managing the active tab is slightly tricky as if you click a plan task tab you want one of the children or grandchildren (etc, at least theoretically) to be the task that is shown to the user.
</docs>

<template>
  <t-tabs
    small
    :id="'review-tabs-' + (this.path ? this.path.replaceAll(':', '-') : 'no-name')"
    card
  >
    <t-tab
      :active="activeTab == task.path"
      :disabled="task.state != 'in_progress'"
      v-for="task in tabs"
      :title="task.caption || task.name"
      :key="'content-' + task.path"
      :id="'tabs-content-' + task.path.replaceAll(':', '-')"
    >
      <p-tabbed-tabs
        style="border-radius: 0px; border: none"
        v-if="Object.keys(task).includes('tasks')"
        :plan="task"
        :selected="selected"
        @select-task="$emit('select-task', $event)"
        @click="$emit('select-task', { value: task.path })"
      />
    </t-tab>
  </t-tabs>
</template>

<script>
import { Tab, Tabs } from '@openclinical/proformajs-vue3-tools'

export default {
  name: 'p-tabbed-tabs',
  data: function () {
    return {
      activeTab: null // path of active tab task,
    }
  },
  props: ['plan', 'selected'],
  components: {
    't-tab': Tab,
    't-tabs': Tabs
  },
  computed: {
    tabs() {
      let result = []
      if (this.plan && this.plan.tasks) {
        for (const task of this.plan.tasks) {
          if (task.state == 'dormant' || task.state == 'in_progress') {
            result.push(task)
          }
        }
      }
      return result
    }
  },
  mounted() {
    this.checkActiveTab()
  },
  methods: {
    checkActiveTab() {
      let activated = false
      if (this.plan && this.plan.tasks) {
        for (const task of this.plan.tasks) {
          if (this.selected && !activated) {
            if (task.path == this.selected) {
              this.activeTab = task.path
              activated = true
            }
            // selected task is a child of this task
            if (this.selected.length > task.path.length && this.selected.startsWith(task.path)) {
              this.activeTab = task.path
              activated = true
            }
            // this task is a child of the selected task
            if (task.path.length > this.selected.length && task.path.startsWith(this.selected)) {
              this.$emit('select-task', { value: task.path })
              activated = true
            }
          }
        }
      }
    }
  },
  watch: {
    plan() {
      this.checkActiveTab()
    }
  }
}
</script>
