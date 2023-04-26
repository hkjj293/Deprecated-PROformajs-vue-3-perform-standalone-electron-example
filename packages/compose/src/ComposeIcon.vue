<template>
  <svg
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <component v-bind:is="iconComponent" :scale="scale" />
  </svg>
</template>

<script>
import TreeIconCandidate from './TreeIconCandidate.vue'
import TreeIconDecision from './TreeIconDecision.vue'
import TreeIconEnquiry from './TreeIconEnquiry.vue'
import TreeIconPlan from './TreeIconPlan.vue'
import TreeIconSource from './TreeIconSource.vue'
import TreeIconTask from './TreeIconTask.vue'
import TreeIconAction from './TreeIconAction.vue'

export default {
  name: 'c-icon',
  props: {
    icon: {
      type: String // "Candidate", "Decision", ...
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  components: {
    TreeIconCandidate,
    TreeIconDecision,
    TreeIconEnquiry,
    TreeIconPlan,
    TreeIconSource,
    TreeIconTask,
    TreeIconAction
  },
  computed: {
    iconComponent() {
      return 'TreeIcon' + this.icon
    },
    width() {
      return this.icon === 'Plan' ? 12 * this.scale : 10 * this.scale
    },
    height() {
      return 10 * this.scale
    }
  }
}
</script>
