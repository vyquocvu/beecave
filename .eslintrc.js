module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
};
