/**
 * Ultra-Simple Babel Configuration
 * Minimal configuration to avoid module conflicts
 */

module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [],
  };
};