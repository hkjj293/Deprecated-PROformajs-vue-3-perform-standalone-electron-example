<docs>
Provides a UI settings button that opens a popover form.

# props

* id - customise ids in component
* options - review settings
* debug - show debug option
* restart - show restart option
* placement - control placement of popover

# notes

The content of the popover (the second, ``#_content`` element in the template)
does not have vue web component behaviour.  It is rendered by vue as a hidden
element that is then used as a runtime html template by the popover comoponent.
</docs>

<template>
  <button
    :id="id"
    type="button"
    class="btn btn-outline-secondary"
    data-bs-toggle="popover"
    :data-bs-placement="placement"
    data-bs-title="Review settings"
  >
    <font-awesome-icon icon="cog" />
  </button>
  <div :id="id + '_content'" hidden>
    <label v-if="debug"
      ><input type="checkbox" :name="id + '_value:debug'" /> Debug expressions</label
    >
    <div class="fw-bold mt-2">Decisions</div>
    <label class="mt-1"
      ><input type="checkbox" :name="id + '_value:Decision.showInactiveArguments'" /> Show inactive
      arguments</label
    >
    <label class="mt-1"
      ><input type="checkbox" :name="id + '_value:Decision.showExpressions'" /> Show
      expressions</label
    >
    <label class="mt-1"
      ><input type="checkbox" :name="id + '_value:Candidate.autoConfirmRecommended'" /> Auto-confirm
      candidates</label
    >
    <label class="mt-1"
      ><input type="checkbox" :name="id + '_value:Decision.allowDownloads'" /> Allow
      Downloads</label
    >
    <div class="fw-bold mt-2">Enquiries</div>
    <label class="mt-1"
      ><input type="checkbox" :name="id + '_value:Enquiry.useDefaults'" /> Use defaults</label
    >
    <div class="d-grid gap-2">
      <button :name="id + '_restart'" v-if="restart" class="btn btn-outline-secondary btn-sm mt-2">
        <font-awesome-icon icon="redo-alt" /> Restart
      </button>
    </div>
  </div>
</template>

<script>
import { Popover } from 'bootstrap'

const optionKeys = [
  'Decision.showInactiveArguments',
  'Decision.showExpressions',
  'Decision.allowDownloads',
  'Enquiry.useDefaults',
  'Candidate.autoConfirmRecommended',
  'debug'
]

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
    }
  },
  emits: ['change-option', 'restart-enactment'],
  data() {
    return {
      popover: null
    }
  },
  mounted() {
    // initialise popover
    let elem = document.getElementById(this.id)
    this.popover = new Popover(elem, {
      html: true,
      sanitize: false,
      content: () => document.getElementById(this.id + '_content').innerHTML
    })
    elem.addEventListener('shown.bs.popover', this.openPopover)
  },
  methods: {
    openPopover() {
      // when the popover is closed its content element is destroyed,
      // so we need to reset form values and reconnect form events
      // everytime it is opened
      optionKeys.forEach((key) => {
        // there will be two copies of each input / button in the DOM
        const elems = document.getElementsByName(this.id + '_value:' + key)
        for (const elem of elems) {
          elem.checked = this.optionFromKey(key)
          elem.onclick = this.createClickOption(key)
        }
      })
      for (const elem of document.getElementsByName(this.id + '_restart')) {
        elem.onclick = this.sendRestart
      }
    },
    createClickOption(key) {
      const keys = key.split('.')
      const evt = keys.length == 1 ? { option: key } : { category: keys[0], option: keys[1] }
      return () => {
        evt.value = !this.optionFromKey(key)
        this.$emit('change-option', evt)
      }
    },
    optionFromKey(key) {
      const keys = key.split('.')
      if (keys.length == 1) {
        return this.options[key]
      } else {
        return this.options[keys[0]][keys[1]]
      }
    },
    sendRestart() {
      this.$emit('restart-enactment')
      this.popover.hide()
    }
  }
}
</script>
