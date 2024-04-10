import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 'off',
  },
  typescript: true,
  vue: true,
  ignores: [
    'node_modules',
    'node_modules/**',
    'dist',
    'dist/**',
    '.DS_Store',
    '**/.DS_Store/**',
    '*.json',
    '*.json/**',
    'prettier.config.js',
    '**/prettier.config.js/**',
    'scripts/verifyCommit.js',
  ],
})
