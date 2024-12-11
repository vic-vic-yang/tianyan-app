module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxSingleQuote: false,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  pluginSearchDirs: false,

  // used in opengraph image, image response
  tailwindAttributes: ['tw'],

  // used in common react components
  tailwindFunctions: ['cn', 'clsx', 'twMerge'],
};
