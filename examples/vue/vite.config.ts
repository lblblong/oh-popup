import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
})
