<docs>
A simple wrapper for bootstrap's popover button
</docs>

<template>
  <button
    type="button"
    data-bs-toggle="popover"
    data-bs-trigger="focus"
    class="btn"
    :class="classes"
  >
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
    }
  },
  data() {
    return {
      popover: null
    }
  },
  emits: ['hide.bs.popover', 'hidden.bs.popover', 'inserted.bs.popover', 'show.bs.popover', 'shown.bs.popover'],
  mounted() {
    const config = {
      placement: this.placement,
      html: this.html,
      sanitize: this.sanitize
    }
    config.content = this.target
      ? () => document.getElementById(this.target).innerHTML
      : this.content
    if (this.title) {
      config.title = this.title
    }
    this.popover = new Popover(this.$el, config)
  },
  computed: {
    classes() {
      return 'btn-' + this.variant + (this.class ? ' ' + this.class : '');
    }
  }
}
</script>
