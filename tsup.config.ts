import { defineConfig } from 'tsup'
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
    vue: 'src/vue/index.ts',
    type: 'src/type.ts',
  },
  splitting: false,
  clean: true,
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  target: 'es2020',
})
