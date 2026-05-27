// import unusedImports from "eslint-plugin-unused-imports";

module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['unused-imports', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'no-void': ['warn', { allowAsStatement: true }],
        semi: 2,
        'prettier/prettier': 'warn',
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-shadow': 'off',
      },
    },
    {
      files: ['*.json'],
      rules: {
        quotes: 'off',
        semi: 'off',
      },
    },
  ],
};
