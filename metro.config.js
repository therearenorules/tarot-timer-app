const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable Hermes for web to fix Super expression and import.meta errors
config.transformer = {
  ...config.transformer,
  hermesParser: false,
  unstable_allowRequireContext: true,
};

// Web-specific configuration with module resolution fixes
config.resolver = {
  ...config.resolver,
  platforms: ['web', 'native', 'ios', 'android'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  unstable_enablePackageExports: true,
  sourceExts: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
};

// Web transformer settings to handle ES modules
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

// Optimize cache settings to reduce rebuilds
config.cacheVersion = '1.0.0';
config.resetCache = false;

module.exports = config;