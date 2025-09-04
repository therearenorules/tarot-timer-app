const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enhanced transformer configuration
config.transformer = {
  ...config.transformer,
  // Disable Hermes for web to fix Super expression and import.meta errors
  hermesParser: false,
  unstable_allowRequireContext: true,
  // Enhanced minifier settings for better performance
  minifierConfig: {
    keep_fnames: true,
    mangle: { 
      keep_fnames: true,
      safari10: true,
    },
    compress: {
      drop_console: process.env.NODE_ENV === 'production',
      drop_debugger: true,
      pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
      passes: 3,
    }
  },
  // Asset optimization
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// Enhanced resolver configuration
config.resolver = {
  ...config.resolver,
  platforms: ['web', 'native', 'ios', 'android'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    // Additional aliases for better module resolution
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@lib': path.resolve(__dirname, 'src/lib'),
    '@stores': path.resolve(__dirname, 'src/stores'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@types': path.resolve(__dirname, 'src/types'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    // RSC 모듈 해결을 위한 더미 alias
    '@expo/metro-runtime/rsc/runtime': path.resolve(__dirname, 'src/lib/dummyRsc.js'),
    '@expo/metro-runtime/src/index.ts': path.resolve(__dirname, 'src/lib/metroRuntime.js'),
    '@expo/metro-runtime/src/index': path.resolve(__dirname, 'src/lib/metroRuntime.js'),
    // UUID 모듈 해결을 위한 alias
    'expo-modules-core/src/uuid': path.resolve(__dirname, 'src/lib/dummyUuid.js'),
  },
  extraNodeModules: {
    'expo-modules-core/src/uuid': path.resolve(__dirname, 'src/lib/dummyUuid.js'),
  },
  watchFolders: [
    path.resolve(__dirname, 'src'),
  ],
  unstable_enablePackageExports: true,
  unstable_enableSymlinks: true,
  sourceExts: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json'],
  // Enhanced asset extensions for tarot app assets
  assetExts: [
    ...config.resolver.assetExts,
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
    'mp3', 'mp4', 'wav', 'm4a',
    'ttf', 'otf', 'woff', 'woff2',
    'db', 'sqlite',
    'wasm' // WASM 파일 지원 추가
  ],
  // Block unnecessary files for better performance
  blockList: [
    // Development files
    /\.git\/.*/,
    /\.vscode\/.*/,
    /\.idea\/.*/,
    // Native builds
    /node_modules\/.*\/Pods\/.*/,
    /ios\/Pods\/.*/,
    /android\/app\/build\/.*/,
    // Test files in production
    ...(process.env.NODE_ENV === 'production' ? [
      /__tests__\/.*/,
      /.*\.(test|spec)\.(js|jsx|ts|tsx)$/,
    ] : []),
  ],
};

// Enhanced web transformer settings
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
    // Additional optimizations
    unstable_disableES6Transforms: false,
  },
});

// Enhanced serializer for better bundle optimization
config.serializer = {
  ...config.serializer,
  // Create shorter module IDs for faster loading
  createModuleIdFactory: () => (path) => {
    const name = path.replace(/^.*node_modules[\\/]/, '');
    return name.length > 50 ? 
      require('crypto').createHash('sha1').update(name).digest('base64').substring(0, 8) : 
      name;
  },
  // Filter modules in production for smaller bundles
  processModuleFilter: (module) => {
    if (process.env.NODE_ENV === 'production') {
      return !/(test|spec|__tests__|\.test\.|\.spec\.)/.test(module.path);
    }
    return true;
  },
};

// Enhanced cache settings for faster rebuilds
config.cacheVersion = '2.6.0'; // Incremented for winter module direct file implementation
config.resetCache = false;

// Development-specific optimizations
if (process.env.NODE_ENV !== 'production') {
  // Enhanced development settings
  config.transformer = {
    ...config.transformer,
    experimentalImportSupport: false,
    inlineRequires: false,
  };
}

// Performance monitoring (optional)
if (process.env.METRO_DEBUG) {
  const originalBuild = config.serializer.processModuleFilter;
  config.serializer.processModuleFilter = (module) => {
    const startTime = Date.now();
    const result = originalBuild ? originalBuild(module) : true;
    const duration = Date.now() - startTime;
    if (duration > 100) {
      console.log(`⚠️ Slow module: ${module.path} (${duration}ms)`);
    }
    return result;
  };
}

module.exports = config;