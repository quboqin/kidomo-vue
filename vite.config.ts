import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

const shouldUseLegacy = process.env.USE_LEGACY === 'true'

console.log(
  'if you want to load a local package through WebView, please use shouldUseLegacy packaging',
  shouldUseLegacy
)

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    // Conditionally include the legacy plugin based on the condition
    ...(shouldUseLegacy
      ? [
          legacy({
            targets: ['defaults', 'not IE 11']
          })
        ]
      : []),
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
