/**
 * Advanced Webpack Configuration for Expo Web
 * Production-ready configuration with security, performance, and monitoring
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const path = require('path');

module.exports = async function(env, argv) {
  // Get default Expo webpack config
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        // Add paths that need to be transpiled
        '@react-native-async-storage/async-storage',
        'react-native-reanimated',
        'react-native-gesture-handler',
      ]
    }
  }, argv);

  const isDevelopment = env.mode === 'development';
  const isProduction = env.mode === 'production';
  const isAnalyze = process.env.ANALYZE === 'true';

  // Enhanced resolve configuration
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      // Path aliases for better imports
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@types': path.resolve(__dirname, 'src/types'),
      
      // Performance optimizations - replace heavy modules
      'react-native-vector-icons': '@expo/vector-icons',
      
      // Development vs Production modules
      ...(isProduction && {
        '@/lib/devMode': path.resolve(__dirname, 'src/lib/emptyModule.js'),
        '@/components/dev': path.resolve(__dirname, 'src/lib/emptyModule.js'),
      })
    },
    // Improve module resolution performance
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    symlinks: false,
  };

  // Enhanced optimization for production
  if (isProduction) {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
              passes: 2,
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      
      // Advanced code splitting
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // React and core libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-native-web)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          
          // Expo libraries
          expo: {
            test: /[\\/]node_modules[\\/](@expo|expo-)[\\/]/,
            name: 'expo-vendor',
            chunks: 'all',
            priority: 35,
            enforce: true,
          },
          
          // UI and animation libraries
          ui: {
            test: /[\\/]node_modules[\\/](@react-native-vector-icons|react-native-reanimated|react-native-gesture-handler|react-native-svg)[\\/]/,
            name: 'ui-vendor',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          
          // Date and utility libraries
          utilities: {
            test: /[\\/]node_modules[\\/](date-fns|lodash|ramda|uuid|crypto-js)[\\/]/,
            name: 'util-vendor',
            chunks: 'all',
            priority: 25,
            enforce: true,
          },
          
          // Tarot app specific components
          tarot: {
            test: /[\\/]src[\\/](components|features|screens)[\\/]/,
            name: 'tarot-app',
            chunks: 'all',
            priority: 20,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          
          // Common vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          
          // Common app code
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      
      // Runtime chunk optimization
      runtimeChunk: {
        name: 'runtime',
      },
      
      // Module concatenation
      concatenateModules: true,
      
      // Side effects optimization
      sideEffects: false,
    };
  }

  // Enhanced plugins
  const plugins = [...config.plugins];

  // Production-only plugins
  if (isProduction) {
    plugins.push(
      // Gzip compression
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      }),
      
      // Brotli compression for modern browsers
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          level: 11,
        },
        threshold: 8192,
        minRatio: 0.8,
      }),
      
      // Subresource integrity for security
      new SubresourceIntegrityPlugin({
        hashFuncNames: ['sha384'],
        enabled: true,
      })
    );
  }

  // Bundle analyzer
  if (isAnalyze) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../bundle-analysis/report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: '../bundle-analysis/stats.json',
        logLevel: 'info',
      })
    );
  }

  config.plugins = plugins;

  // Enhanced module rules
  config.module.rules.push(
    // Optimize images
    {
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 75,
            },
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: [0.65, 0.75],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 75,
            },
          },
        },
      ],
    },
    
    // SVG optimization
    {
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'removeDimensions',
                  active: true,
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    }
  );

  // Development optimizations
  if (isDevelopment) {
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };
    
    // Enhanced dev server configuration
    config.devServer = {
      ...config.devServer,
      compress: true,
      historyApiFallback: true,
      hot: true,
      liveReload: false,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
        reconnect: 5,
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    };
  }

  // Performance budgets
  config.performance = {
    hints: isProduction ? 'warning' : false,
    maxAssetSize: 512000, // 512KB
    maxEntrypointSize: 512000, // 512KB
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith('.map');
    },
  };

  // Enhanced stats for better debugging
  config.stats = isDevelopment ? 'minimal' : {
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true,
    chunks: true,
    chunkModules: false,
    colors: true,
  };

  // Enhanced security headers for webpack dev server
  if (isDevelopment && config.devServer) {
    const { getSecurityHeaders } = require('./src/utils/securityHeaders');
    const devHeaders = getSecurityHeaders(true);
    
    config.devServer.headers = {
      ...config.devServer.headers,
      ...devHeaders,
      // Override cache control for development
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };
  }

  // Experimental features for better performance
  config.experiments = {
    ...config.experiments,
    topLevelAwait: true,
    asyncWebAssembly: true,
  };

  return config;
};