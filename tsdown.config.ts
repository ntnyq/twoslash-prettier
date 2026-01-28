import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  inlineOnly: ['pathe', 'show-invisibles'],
  platform: 'node',
})
