<script>
import { Protocol } from '@openclinical/proformajs';

export default {
  data: function() {
    return {
      protocol: new Protocol.Plan({name: 'test'})
    }
  },
  created: function() {
    fetch('./demo.json') .then((data) => data.json()) .then((json) => this.protocol = new Protocol.Plan(json));
  }
}
</script>

<template>
  <main>
    <pre>{{ protocol }}</pre>
  </main>
</template>

