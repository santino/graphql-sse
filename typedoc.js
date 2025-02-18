module.exports = {
  out: './docs',
  readme: 'none',
  plugin: 'typedoc-plugin-markdown',
  excludeExternals: true,
  excludePrivate: true,
  disableSources: true,
  categorizeByGroup: false, // removes redundant category names in matching modules
  githubPages: false,
  exclude: ['**/index.ts', '**/utils.ts', '**/parser.ts', '**/__tests__/**/*'],
};
