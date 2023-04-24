<docs>
Provides a UI settings button that opens a popover form.

# props

* id - customise ids in component
* options - review settings
* debug - show debug option
* restart - show restart option
* placement - control placement of popover
</docs>

<template>
  <popover
    :id="id"
    title="Review settings"
    :target="id + '_content'"
    variant="outline-secondary"
    :placement="placement"
    trigger="click"
    :class="classes"
    :ref="id"
  >
    <font-awesome-icon icon="cog" />
  </popover>
  <div :id="id + '_content'">
    <label v-if="debug"
      ><input
        type="checkbox"
        :checked="options.debug"
        @click="changeOption('debug', !options.debug)"
      />
      Debug expressions</label
    >
    <div class="fw-bold mt-2">Decisions</div>
    <label class="mt-1"
      ><input
        type="checkbox"
        :checked="options.Decision.showInactiveArguments"
        @click="
          changeOption('showInactiveArguments', !options.Decision.showInactiveArguments, 'Decision')
        "
      />
      Show inactive arguments</label
    >
    <label class="mt-1"
      ><input
        type="checkbox"
        :checked="options.Decision.showExpressions"
        @click="changeOption('showExpressions', !options.Decision.showExpressions, 'Decision')"
      />
      Show expressions</label
    >
    <label class="mt-1"
      ><input
        type="checkbox"
        :checked="options.Candidate.autoConfirmRecommended"
        @click="
          changeOption(
            'autoConfirmRecommended',
            !options.Candidate.autoConfirmRecommended,
            'Candidate'
          )
        "
      />
      Auto-confirm candidates</label
    >
    <label class="mt-1"
      ><input
        type="checkbox"
        :checked="options.Decision.allowDownloads"
        @click="changeOption('allowDownloads', !options.Decision.allowDownloads, 'Decision')"
      />
      Allow Downloads</label
    >
    <div class="fw-bold mt-2">Enquiries</div>
    <label class="mt-1"
      ><input
        type="checkbox"
        :checked="options.Enquiry.useDefaults"
        @click="changeOption('useDefaults', !options.Enquiry.useDefaults, 'Enquiry')"
      />
      Use defaults</label
    >
    <div class="d-grid gap-2">
      <button
        :name="id + '_restart'"
        v-if="restart"
        class="btn btn-outline-secondary btn-sm mt-2"
        @click="sendRestart"
      >
        <font-awesome-icon icon="redo-alt" /> Restart
      </button>
    </div>
  </div>
</template>

<script>
import PopoverButton from './PopoverButton.vue'

export default {
  props: {
    options: {
      type: Object,
      required: false
    },
    id: {
      type: String,
      default: 'enactment-settings'
    },
    debug: {
      type: Boolean,
      default: true
    },
    restart: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    class: {
      type: String,
      required: false
    }
  },
  components: {
    popover: PopoverButton
  },
  emits: ['change-option', 'restart-enactment'],
  computed: {
    classes() {
      return this.class
    }
  },
  methods: {
    changeOption(option, value, category) {
      const evt = {
        option: option,
        value: value
      }
      if (category) {
        evt.category = category
      }
      this.$emit('change-option', evt)
    },
    sendRestart() {
      this.$emit('restart-enactment')
      this.$refs[this.id].popover.hide()
    }
  }
}
</script>
