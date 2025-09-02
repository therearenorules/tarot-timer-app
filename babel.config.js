/**
 * Enhanced Babel Configuration for Expo Web
 * Optimized for performance, tree shaking, and production builds
 */

module.exports = function (api) {
  api.cache(true);
  
  const isProduction = process.env.NODE_ENV === 'production';
  const isWeb = process.env.EXPO_PLATFORM === 'web';

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Web-specific optimizations
          web: {
            // Enable modern JS features for web
            useBuiltIns: 'entry',
            corejs: 3,
            // Disable JSX runtime for better tree shaking
            jsxRuntime: 'automatic',
          },
          // Native optimizations
          native: {
            // Enable Hermes for better performance on native
            useTransformReactJsxExperimental: true,
          }
        }
      ]
    ],
    
    plugins: [
      // React optimizations
      ...(isProduction && isWeb ? [
        // Remove React DevTools in production
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
        // Optimize React elements
        ['@babel/plugin-transform-react-inline-elements'],
        // Remove prop types in production
        ['transform-react-remove-prop-types', { removeImport: true }],
      ] : []),

      // Performance optimizations
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: false,
          useESModules: isWeb,
        }
      ],

      // Tree shaking optimizations
      ...(isProduction ? [
        // Remove unused imports
        ['babel-plugin-transform-imports', {
          '@expo/vector-icons': {
            transform: '@expo/vector-icons/${member}',
            preventFullImport: true,
          },
          'react-native-vector-icons': {
            transform: '@expo/vector-icons/${member}',
            preventFullImport: true,
          },
          'date-fns': {
            transform: 'date-fns/${member}',
            preventFullImport: true,
          },
          'lodash': {
            transform: 'lodash/${member}',
            preventFullImport: true,
          },
        }],
      ] : []),

      // Web-specific optimizations
      ...(isWeb ? [
        // Optimize styled-components for web
        ...(isProduction ? [['babel-plugin-styled-components', {
          displayName: false,
          fileName: false,
          minify: true,
          pure: true,
        }]] : []),
        
        // Optimize React Native Web
        ['react-native-web', { commonjs: true }],
      ] : []),

      // Development optimizations
      ...(!isProduction ? [
        // Better debugging
        '@babel/plugin-syntax-dynamic-import',
        // Fast refresh for web
        ...(isWeb ? ['react-refresh/babel'] : []),
      ] : []),

      // Async/await optimization
      [
        '@babel/plugin-transform-async-to-generator',
        {
          module: 'bluebird',
          method: 'coroutine',
        }
      ],

      // Optional chaining and nullish coalescing
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',

      // Class properties
      ['@babel/plugin-proposal-class-properties', { loose: true }],

      // Private methods
      ['@babel/plugin-proposal-private-methods', { loose: true }],

      // Decorators (if needed for MobX or other libraries)
      ['@babel/plugin-proposal-decorators', { legacy: true }],

      // Reanimated plugin for animations
      'react-native-reanimated/plugin',
    ],

    // Environment-specific configurations
    env: {
      production: {
        plugins: [
          // Remove console.log in production
          ['transform-remove-console', { exclude: ['error', 'warn'] }],
          // Minify dead code elimination
          'babel-plugin-minify-dead-code-elimination',
          // Optimize constant folding
          'babel-plugin-minify-constant-folding',
        ],
      },
      
      development: {
        plugins: [
          // Better error debugging
          '@babel/plugin-transform-react-jsx-source',
          // Component display names for debugging
          '@babel/plugin-transform-react-display-name',
        ],
      },

      test: {
        presets: [
          ['babel-preset-expo', { jsxRuntime: 'automatic' }],
        ],
        plugins: [
          // Transform dynamic imports for Jest
          'babel-plugin-dynamic-import-node',
        ],
      },
    },

    // Optimize for different targets
    assumptions: {
      // Assume modern environments support these features
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
      constantSuper: true,
      noDocumentAll: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      setSpreadProperties: true,
    },
  };
};