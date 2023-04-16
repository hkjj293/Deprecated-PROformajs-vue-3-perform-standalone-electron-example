<script>
import { Protocol } from '@openclinical/proformajs'
import { PerformProtocol } from '@openclinical/proformajs-vue3-perform'

export default {
  components: {
    'p-protocol': PerformProtocol
  },
  data: function () {
    return {
      protocol: new Protocol.Plan({ name: 'test' })
    }
  },
  created: function () {
    fetch('./demo.json')
      .then((data) => data.json())
      .then((json) => (this.protocol = new Protocol.Plan(json)))
  }
}
</script>

<template>
  <main class="container">
    <div class="col">
      <p-protocol :protocol="protocol" class="mt-3"/>
    </div>
  </main>
</template>
