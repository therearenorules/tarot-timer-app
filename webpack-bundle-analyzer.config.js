/**
 * 웹팩 번들 분석 설정
 * React Native / Expo 앱의 번들 크기를 분석하고 최적화 방향을 제시합니다.
 */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // Expo/React Native 웹 빌드를 위한 웹팩 설정 확장
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 프로덕션 빌드에서만 번들 분석 활성화
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: '../bundle-analysis/client.html',
          openAnalyzer: process.env.NODE_ENV === 'development',
        })
      );
    }

    // 번들 최적화 설정
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // React/React Native 코어 라이브러리
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-native)[\\/]/,
            name: 'react-vendor',
            priority: 40,
            reuseExistingChunk: true,
          },
          // Expo 라이브러리들
          expo: {
            test: /[\\/]node_modules[\\/](@expo|expo-)[\\/]/,
            name: 'expo-vendor',
            priority: 35,
            reuseExistingChunk: true,
          },
          // 타로 앱 컴포넌트
          tarot: {
            test: /[\\/]src[\\/](components|features)[\\/]/,
            name: 'tarot-components',
            priority: 30,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // UI 라이브러리 (아이콘, 애니메이션 등)
          ui: {
            test: /[\\/]node_modules[\\/](@react-native-vector-icons|react-native-reanimated|react-native-gesture-handler)[\\/]/,
            name: 'ui-vendor',
            priority: 25,
            reuseExistingChunk: true,
          },
          // 날짜 라이브러리
          date: {
            test: /[\\/]node_modules[\\/](date-fns)[\\/]/,
            name: 'date-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },
          // 기타 큰 라이브러리들
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            reuseExistingChunk: true,
          },
          // 공통 코드
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // 트리 쉐이킹 최적화
    config.resolve.mainFields = ['react-native', 'browser', 'main'];
    
    // 불필요한 모듈 제외
    config.resolve.alias = {
      ...config.resolve.alias,
      // 개발 전용 모듈 제외
      '@/lib/devMode': dev ? '@/lib/devMode' : '@/lib/emptyModule',
      '@/components/dev': dev ? '@/components/dev' : '@/lib/emptyModule',
    };

    return config;
  },

  // 번들 크기 경고 임계값 설정
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
};

// package.json에 추가할 스크립트들
const packageJsonScripts = {
  "analyze": "ANALYZE=true npm run build:web",
  "analyze:server": "BUNDLE_ANALYZE=server npm run build",
  "analyze:browser": "BUNDLE_ANALYZE=browser npm run build", 
  "bundle-report": "npm run analyze && echo '번들 분석 보고서가 생성되었습니다: ./bundle-analysis/client.html'",
};

console.log(`
📦 번들 분석 설정이 완료되었습니다.

다음 명령어를 package.json scripts에 추가하세요:
${JSON.stringify(packageJsonScripts, null, 2)}

사용법:
1. npm run analyze - 번들 분석 실행
2. npm run bundle-report - 분석 후 보고서 생성
3. 생성된 보고서는 ./bundle-analysis/client.html에서 확인

최적화 팁:
- 큰 라이브러리는 동적 임포트 사용
- 사용하지 않는 Expo 모듈 제거
- 이미지 최적화 및 압축
- 코드 스플리팅으로 초기 번들 크기 감소
`);

module.exports.packageJsonScripts = packageJsonScripts;