<docs>
A wrapper for bootstrap's popover button

### Notes

For the settings popover we use click trigger (not hover) and then
the problem with this is that clicking on the form closes it and
we dont want that, hence the handling of the click event.
</docs>

<template>
  <button type="button" data-bs-toggle="popover" :data-bs-trigger="trigger" :data-bs-placement="placement"
    :data-bs-html="html" :data-bs-title="title ? title : null" :data-bs-content="renderedContent" :class="classes">
    <slot>
      <font-awesome-icon icon="info-circle" />
    </slot>
  </button>
</template>

<script>
//import { Popover } from 'bootstrap'

export default {
  name: 'PopoverButton',
  props: {
    content: {
      type: String,
      default: 'Loading...'
    },
    target: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'link'
    },
    html: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'hover focus'
    },
    title: {
      type: String,
      required: false
    },
    class: {
      type: String,
      required: false
    }
  },
  computed: {
    classes() {
      return 'btn' + ' btn-' + this.variant + (this.class ? ' ' + this.class : '')
    }
  },
  data() {
    return { popover: null, renderedContent: this.content }
  },
  mounted() {
    this.onClick.bind(this)
    this.popover = new window.bootstrap.Popover(this.$el, { sanitize: false })
    if (this.target && document.getElementById(this.target)) {
      this.renderedContent = document.getElementById(this.target)
      this.renderedContent.parentElement.removeChild(this.renderedContent)
    }
    let content = {
      '.popover-body': this.renderedContent,
      '.popover-header': this.title ? this.title : null
    }
    this.popover.setContent(content)
    if (this.target) {
      document.addEventListener('click', this.onClick)
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onClick)
  },
  methods: {
    onClick: function (event) {
      if (
        this.target &&
        this.popover.tip &&
        !document.getElementById(this.popover.tip.id).contains(event.target)
      ) {
        this.popover.hide()
      } else {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style>
.markdown :last-child {
  margin-bottom: 0;
}

.popover-body {
  --bs-popover-body-padding-x: 0.5rem;
  --bs-popover-body-padding-y: 0.5rem;
}
</style>
