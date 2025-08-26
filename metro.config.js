const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable Hermes for web to fix Super expression errors
config.transformer = {
  ...config.transformer,
  hermesParser: false,
};

// Web-specific configuration
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config;