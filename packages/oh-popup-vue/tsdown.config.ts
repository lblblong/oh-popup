import { injectCssPlugin } from '@bosh-code/tsdown-plugin-inject-css'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue-jsx/rolldown'

export default defineConfig({
  plugins: [injectCssPlugin(), Vue()],
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: { vue: true },
  sourcemap: true,
  clean: true,
  onSuccess: 'yalc push',
})
