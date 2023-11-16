import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  clean: true,
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  target: 'es2020',
})
