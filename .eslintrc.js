module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['warn', { singleQuote: false, semi: true }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": 'warn',
    // '@typescript-eslint/no-floating-promises': 'warn'
    "no-var": "warn"
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  }
}
