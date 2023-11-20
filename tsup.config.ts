import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  splitting: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'vue'],
})
