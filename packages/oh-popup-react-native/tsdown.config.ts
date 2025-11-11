import { injectCssPlugin } from '@bosh-code/tsdown-plugin-inject-css'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [injectCssPlugin()],
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  onSuccess: 'yalc push',
})
