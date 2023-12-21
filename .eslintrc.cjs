module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules/', 'build/', 'dist/', './.eslint.config.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useMyCustomHook|useMyOtherCustomHook)',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescrpt-eslint/no-unused-vars': 'off',
    'prettier/prettier': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
