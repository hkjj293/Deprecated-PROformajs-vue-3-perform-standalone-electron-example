<docs>
Provides the means to review and edit a PROformajs argument's attributes and children

# props

* protocol - a PROformajs Protocol
* path - the path to the component of interest

# events

* change-protocol - indicates need to update the protocol,
</docs>

<template>
  <div>
    <h4>Argument: {{ argument.idx }}</h4>
    <div class="mb-2">
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        @click="$emit('select-path', { value: '' })"
      >
        &lt;&lt; Candidate: {{ parentName }}
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        v-if="numSiblings > 1"
        :disabled="argument.idx == 0"
        @click="prevArg"
      >
        &lt; Prev
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        v-if="numSiblings > 1"
        :disabled="argument.idx == numSiblings - 1"
        @click="nextArg"
      >
        Next &gt;
      </button>
    </div>
    <t-tabs
      small
      v-model="tabIndex"
      :id="'c-arg-tabs-' + (this.path ? this.path.replaceAll(':', '-') : 'no-name')"
    >
      <t-tab title="Details" key="details" id="c-arg-tabs-details">
        <form>
          <c-input att="caption" :comp="argument" @change-attribute="updateAttribute" />
          <c-textarea att="description" :comp="argument" @change-attribute="updateAttribute" />
          <div class="mb-1 row g-3 mt-1">
            <label class="d-block" for="supportType">Support</label>
            <div id="supportType" class="input-group mb-3 col-auto">
              <template
                v-for="symbol in [
                  { value: '--', text: '--' },
                  { value: '-', text: '-' },
                  { value: '+', text: '+' },
                  { value: '++', text: '++' }
                ]"
                :key="symbol.value"
              >
                <input
                  type="radio"
                  class="btn-check"
                  name="supportType"
                  :id="symbol.value"
                  :value="symbol.value"
                  autocomplete="off"
                  @input="supportSymbol = symbol.value"
                  :checked="supportSymbol == symbol.value"
                />
                <label class="btn btn-outline-secondary btn-sm" :for="symbol.value">{{
                  symbol.text
                }}</label>
              </template>
              <input
                type="number"
                name="supportValue"
                size="2"
                :value="Math.abs(argument.support)"
              />
            </div>
          </div>
        </form>
      </t-tab>
      <t-tab title="Condition" key="condition" id="c-arg-tabs-condition">
        <c-condition
          att="activeCondition"
          :comp="argument"
          :description="activeConditionExample"
          :issues="attributeIssues('activeCondition')"
          @change-attribute="updateAttribute"
        />
      </t-tab>
    </t-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from '@openclinical/proformajs-vue3-tools'
import ComposeInput from './ComposeInput.vue'
import ComposeCondition from './ComposeCondition.vue'
import ComposeTextArea from './ComposeTextArea.vue'

export default {
  props: {
    protocol: Object,
    path: String,
    issues: Array
  },
  emits: ['select-path', 'change-protocol'],
  components: {
    'c-input': ComposeInput,
    'c-condition': ComposeCondition,
    'c-textarea': ComposeTextArea,
    't-tab': Tab,
    't-tabs': Tabs
  },
  data() {
    return {
      magnitude: 1,
      tabIndex: 0
    }
  },
  computed: {
    argument() {
      let component
      try {
        component = this.protocol.getComponent(this.path)
      } catch (e) {
        component = this.protocol
      }
      return component
    },
    supportSymbol: {
      get: function () {
        if (this.argument.support == -Infinity) {
          return '--'
        } else if (this.argument.support < 0) {
          return '-'
        } else if (this.argument.support == Infinity) {
          return '++'
        } else {
          return '+'
        }
      },
      set: function (value) {
        if (value == '--') {
          this.updateAttribute({ name: 'support', value: -Infinity })
        } else if (value == '-') {
          this.updateAttribute({ name: 'support', value: -1 * this.magnitude })
        } else if (value == '++') {
          this.updateAttribute({ name: 'support', value: Infinity })
        } else {
          this.updateAttribute({ name: 'support', value: this.magnitude })
        }
      }
    },
    activeConditionExample() {
      return 'e.g. "age > 40 && sbp > 120"'
    },
    parentName() {
      return this.argument._parent ? this.argument._parent.name : ''
    },
    numSiblings() {
      return this.argument._parent ? this.argument._parent.arguments.length : -1
    }
  },
  methods: {
    updateAttribute(evt) {
      // There is no setComponent method in a PROformajs protocol so we focus on attributes instead
      let comp = this.protocol.getComponent(this.path)
      comp[evt.name] = evt.value
      this.$emit('change-protocol', { value: this.protocol, emitter: 'c-argument' })
    },
    reset() {
      this.tabIndex = 0 // show Details tab
    },
    attributeIssues(att) {
      return this.issues.filter((issue) => issue.attribute == att)
    },
    prevArg() {
      let prevPath = this.argument._parent.arguments[this.argument.idx - 1].path()
      this.$emit('select-path', { value: prevPath })
    },
    nextArg() {
      let nextPath = this.argument._parent.arguments[this.argument.idx + 1].path()
      this.$emit('select-path', { value: nextPath })
    }
  },
  watch: {
    path: function () {
      this.reset() // if the path changes, reset the dialogues
    }
  }
}
</script>
