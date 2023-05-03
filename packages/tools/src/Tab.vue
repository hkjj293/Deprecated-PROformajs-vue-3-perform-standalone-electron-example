<docs>
    A lite version of Bootstrap 5 tab component inspired by B-Tab from bootstrap-vue. See (https://github.com/bootstrap-vue/bootstrap-vue/tree/dev/src/components/tab)
</docs>

<template>
  <div :class="'tab-pane ' +
    (tTabs.modelValue !== undefined
      ? index == tTabs.tabIndex
        ? 'active'
        : ''
      : active
        ? 'active'
        : '')
    " :id="id + '-p'">
    <slot>No Content</slot>
  </div>
</template>

<script>
export default {
  name: 't-tab',
  props: {
    id: {
      type: String,
      required: true
    },
    title: String,
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  data() {
    return {
      index: 0
    }
  },
  inject: {
    getTTabs: {
      default: () => () => ({})
    }
  },
  computed: {
    tTabs() {
      return this.getTTabs()
    }
  },
  mounted() {
    // domOrder = this.$el.parent
    const { registerTab } = this.tTabs
    if (registerTab) {
      registerTab(this)
    }
  },
  unmounted() {
    const { unregisterTab } = this.tTabs
    if (unregisterTab) {
      unregisterTab(this)
    }
  },
  methods: {
    setIndex(idx) {
      this.index = idx
    }
  }
}
</script>
