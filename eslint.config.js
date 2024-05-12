// @ts-check
import createEslintConfig from 'talljack-eslint-config'

export default createEslintConfig({
  typescript: {
    overrides: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  javascript: {
    overrides: {
      'no-console': 'warn',
    },
  },
  react: {
    overrides: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  vue: true,
  formatters: true,
  rules: {
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
  ignores: ['README.md'],
})
