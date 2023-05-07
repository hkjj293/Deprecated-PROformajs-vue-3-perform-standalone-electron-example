import { createApp, nextTick } from 'vue'
import App from './App.vue'

// Import our custom CSS
import './assets/styles.scss'
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

import ProformajsVuePerform from '@openclinical/proformajs-vue3-perform'

createApp(App)
  .directive('focus', {
    inserted: function (el) {
      nextTick(function () {
        el.focus()
      })
    }
  })
  .use(ProformajsVuePerform)
  .mount('#app')

