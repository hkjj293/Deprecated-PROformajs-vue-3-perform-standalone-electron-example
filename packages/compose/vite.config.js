import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// see https://stackoverflow.com/questions/74763160/how-to-make-vite-ignore-docs-blocks
const vueDocsPlugin = {
  name: 'vue-docs',
  transform(_code, id) {
    if (!/vue&type=docs/.test(id)) return
    return `export default ''`
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDocsPlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'index.js'),
      name: '@openclinical/proformajs-vue3-compose',
      // the proper extensions will be added
      fileName: 'proformajs-vue3-compose',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@openclinical/proformajs', 'moment', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'vue',
          moment: 'moment',
          '@openclinical/proformajs': 'proformajs',
          '@fortawesome/fontawesome-svg-core': 'library',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeIcons',
          '@fortawesome/vue-fontawesome': 'FontAwesomeIcon'
        },
      },
    }
  },
})
