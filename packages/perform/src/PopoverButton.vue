<docs>
A simple wrapper for bootstrap's popover button
</docs>

<template>
  <button type="button" data-bs-toggle="popover" class="btn" :class="classes">
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script>
import { Popover } from 'bootstrap'

export default {
  props: {
    content: String,
    title: {
      type: String,
      required: false
    },
    target: {
      type: String
    },
    variant: {
      type: String,
      default: 'link'
    },
    icon: {
      type: String,
      default: 'info-circle'
    },
    placement: {
      type: String,
      default: 'top'
    },
    html: {
      type: Boolean,
      default: true
    },
    sanitize: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      required: false
    },
    focus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      popover: null
    }
  },
  emits: ['shown'],
  mounted() {
    const config = {
      placement: this.placement,
      html: this.html,
      sanitize: this.sanitize
    }
    if (this.focus) {
      config.trigger = 'focus'
    }
    config.content = this.target
      ? () => document.getElementById(this.target).innerHTML
      : this.content
    if (this.title) {
      config.title = this.title
    }
    this.popover = new Popover(this.$el, config)
    this.$el.addEventListener('shown.bs.popover', (evt) => this.$emit('shown', evt))
  },
  computed: {
    classes() {
      return 'btn-' + this.variant + (this.class ? ' ' + this.class : '')
    }
  }
}
</script>
