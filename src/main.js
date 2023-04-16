import { createApp } from 'vue'
import App from './App.vue'

// Import our custom CSS
import './assets/styles.scss'

import ProformajsVue from '@openclinical/proformajs-vue3-perform'

createApp(App).use(ProformajsVue).mount('#app')
