<docs>
    A lite version of Bootstrap 5 tabs container component inspired by B-Tabs from bootstrap-vue. See (https://github.com/bootstrap-vue/bootstrap-vue/tree/dev/src/components/tabs)
</docs>

<template>
  <div v-if="card" class="card border-0" :id="id">
    <div v-if="top" class="card-body p-0">
      <div class="tab-content mt-2">
        <slot></slot>
      </div>
      <div class="card-header">
        <ul :class="'nav' + (pills ? ' nav-pills ' : ' nav-tabs ') + (small ? ' small' : '') + ' mt-2'
          " :id="id + 'tabs'" role="tablist">
          <component v-for="tab in navTab()" :is="tab" :key="tab.key"></component>
        </ul>
      </div>
      <div v-if="!top" class="card-body p-0">
        <div class="tab-content mt-2">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  <span v-else :id="id">
    <div v-if="top" class="tab-content mt-2">
      <slot></slot>
    </div>
    <ul :class="'nav' + (pills ? ' nav-pills ' : ' nav-tabs ') + (small ? ' small' : '') + ' mt-2'" :id="id + 'tabs'"
      role="tablist">
      <component v-for="tab in navTab()" :is="tab" :key="tab.key"></component>
    </ul>
    <div v-if="!top" class="tab-content mt-2">
      <slot></slot>
    </div>
  </span>
</template>
<script>
import { h } from 'vue'

export default {
  name: 't-tabs',
  props: {
    modelValue: Number,
    id: {
      type: String,
      required: true
    },
    top: {
      type: Boolean,
      default: false
    },
    pills: {
      type: Boolean,
      default: false
    },
    card: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      tabs: [],
      tabIndex: this.modelValue || 0,
      tabIdList: []
    }
  },
  provide() {
    return {
      getTTabs: () => this
    }
  },
  methods: {
    navTab() {
      return this.tabs
        .sort((a, b) => {
          return this.tabIdList.indexOf(a.id + '-p') - this.tabIdList.indexOf(b.id + '-p')
        })
        .map(($tab, index) => {
          $tab.setIndex(index)
          const active =
            this.modelValue !== undefined
              ? this.tabIndex === index
                ? ' active'
                : ''
              : $tab.active
                ? 'active'
                : ''
          const disabled = $tab.disabled ? ' disabled' : ''
          const $button = h(
            'button',
            {
              id: $tab.id,
              class: 'nav-link' + active + disabled,
              'data-bs-toggle': this.pills ? 'pill' : 'tab',
              'data-bs-target': $tab.id + '-p',
              type: 'button',
              role: 'tab',
              'aria-controls': $tab.id + '-p',
              'aria-selected': true,
              onClick: (evt) => this.click(evt, $tab, index)
            },
            [$tab.$slots.title ? $tab.$slots.title() : $tab.title]
          )
          return h(
            'li',
            {
              class: 'nav-item',
              role: 'presentation'
            },
            $button
          )
        })
    },
    registerTab($tab) {
      this.tabs.push($tab)
      this.tabIdList = [...this.$el.querySelectorAll('.tab-pane')].map((ele) => ele.id)
    },
    unregisterTab($tab) {
      this.tabs = this.tabs.slice().filter(($t) => $t !== $tab)
      this.tabIdList = [...this.$el.querySelectorAll('.tab-pane')].map((ele) => ele.id)
    },
    click(evt, $tab, idx) {
      this.tabIndex = idx
      this.$emit('update:modelValue', this.tabIndex)
      $tab.$emit('click', evt)
    }
  },
  watch: {
    modelValue(newVal) {
      this.tabIndex = newVal
    }
  }
}
</script>
