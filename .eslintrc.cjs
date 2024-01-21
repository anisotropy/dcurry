/* eslint-env node */

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'stratified-design'],
  rules: {
    'stratified-design/no-same-level-funcs': ['error'],
  },
  root: true,
}
