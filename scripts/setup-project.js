#!/usr/bin/env node

/**
 * 타로 타이머 프로젝트 설정 스크립트
 * React Native + Expo 프로젝트 초기화 및 구조 생성
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 출력을 위한 ANSI 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}🔮 ${msg}${colors.reset}`),
};

/**
 * 프로젝트 폴더 구조 정의
 */
const PROJECT_STRUCTURE = [
  // 메인 소스 디렉토리
  'src',
  'src/app',
  'src/app/(tabs)',
  'src/app/modal',
  
  // 컴포넌트
  'src/components',
  'src/components/base',
  'src/components/composite',
  'src/components/forms',
  'src/components/layout',
  
  // 화면
  'src/screens',
  'src/screens/TimerScreen',
  'src/screens/TimerScreen/components',
  'src/screens/TimerScreen/hooks',
  'src/screens/SpreadsScreen',
  'src/screens/SpreadsScreen/components',
  'src/screens/SpreadsScreen/hooks',
  'src/screens/JournalScreen',
  'src/screens/JournalScreen/components',
  'src/screens/SettingsScreen',
  'src/screens/SettingsScreen/components',
  
  // 서비스
  'src/services',
  'src/services/api',
  'src/services/api/endpoints',
  'src/services/storage',
  'src/services/notifications',
  'src/services/analytics',
  
  // 유틸리티
  'src/utils',
  'src/utils/tarot',
  'src/utils/platform',
  'src/utils/date',
  'src/utils/i18n',
  'src/utils/i18n/translations',
  'src/utils/animations',
  'src/utils/validation',
  
  // 타입
  'src/types',
  'src/types/api',
  'src/types/domain', 
  'src/types/ui',
  'src/types/utils',
  
  // 상태 관리
  'src/store',
  'src/store/slices',
  'src/store/middleware',
  'src/store/selectors',
  
  // 훅
  'src/hooks',
  'src/hooks/common',
  'src/hooks/platform',
  'src/hooks/api',
  'src/hooks/storage',
  'src/hooks/animations',
  
  // 상수
  'src/constants',
  
  // 자산
  'src/assets',
  'src/assets/images',
  'src/assets/icons',
  'src/assets/fonts',
  'src/assets/sounds',
  
  // 문서
  'docs',
  'docs/api',
  'docs/components',
  'docs/guides',
  
  // 테스트
  '__tests__',
  '__tests__/components',
  '__tests__/screens',
  '__tests__/utils',
  '__tests__/services',
  
  // 스크립트
  'scripts',
  'scripts/build',
  'scripts/migration',
];

/**
 * 기본 index.ts 파일들 생성
 */
const INDEX_FILES = [
  {
    path: 'src/components/base/index.ts',
    content: '// Base components exports\n// Will be populated as components are created\n',
  },
  {
    path: 'src/components/composite/index.ts',
    content: '// Composite components exports\n// Will be populated as components are created\n',
  },
  {
    path: 'src/components/forms/index.ts',
    content: '// Form components exports\n// Will be populated as components are created\n',
  },
  {
    path: 'src/components/layout/index.ts',
    content: '// Layout components exports\n// Will be populated as components are created\n',
  },
  {
    path: 'src/utils/index.ts',
    content: '// Utility functions exports\n// Will be populated as utilities are created\n',
  },
  {
    path: 'src/services/index.ts',
    content: '// Services exports\nexport * from \'./api\';\nexport * from \'./storage\';\nexport * from \'./notifications\';\n',
  },
  {
    path: 'src/hooks/index.ts',
    content: '// Custom hooks exports\n// Will be populated as hooks are created\n',
  },
];

/**
 * 필수 설정 파일들
 */
const CONFIG_FILES = [
  {
    path: 'babel.config.js',
    content: `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/store': './src/store',
          '@/hooks': './src/hooks',
          '@/constants': './src/constants',
          '@/assets': './src/assets',
        },
      }],
    ],
  };
};`,
  },
  {
    path: 'metro.config.js', 
    content: `const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional asset types
config.resolver.assetExts.push(
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  'mp3', 'wav', 'aac', 'm4a',
  'ttf', 'otf', 'woff', 'woff2'
);

// Add support for TypeScript paths
config.resolver.alias = {
  '@': './src',
  '@/components': './src/components',
  '@/screens': './src/screens', 
  '@/services': './src/services',
  '@/utils': './src/utils',
  '@/types': './src/types',
  '@/store': './src/store',
  '@/hooks': './src/hooks',
  '@/constants': './src/constants',
  '@/assets': './src/assets',
};

module.exports = config;`,
  },
];

/**
 * 디렉토리 생성
 */
function createDirectories() {
  log.title('Creating project directory structure...');
  
  PROJECT_STRUCTURE.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      log.success(`Created directory: ${dir}`);
    } else {
      log.info(`Directory already exists: ${dir}`);
    }
  });
}

/**
 * 기본 파일들 생성
 */
function createIndexFiles() {
  log.title('Creating index files...');
  
  INDEX_FILES.forEach(({ path: filePath, content }) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content, 'utf8');
      log.success(`Created file: ${filePath}`);
    } else {
      log.info(`File already exists: ${filePath}`);
    }
  });
}

/**
 * 설정 파일들 생성
 */
function createConfigFiles() {
  log.title('Creating configuration files...');
  
  CONFIG_FILES.forEach(({ path: filePath, content }) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content, 'utf8');
      log.success(`Created config: ${filePath}`);
    } else {
      log.warn(`Config already exists: ${filePath}`);
    }
  });
}

/**
 * .gitignore 업데이트
 */
function updateGitignore() {
  log.title('Updating .gitignore...');
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const additionalIgnores = [
    '',
    '# React Native / Expo',
    '.expo/',
    'dist/',
    'web-build/',
    '',
    '# IDE',
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '',
    '# OS',
    '.DS_Store',
    'Thumbs.db',
    '',
    '# Logs',
    '*.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '',
    '# Environment',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '',
    '# Temporary files',
    'tmp/',
    'temp/',
  ].join('\n');
  
  if (fs.existsSync(gitignorePath)) {
    const existingContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!existingContent.includes('# React Native / Expo')) {
      fs.appendFileSync(gitignorePath, additionalIgnores);
      log.success('Updated .gitignore');
    } else {
      log.info('.gitignore already contains React Native entries');
    }
  } else {
    fs.writeFileSync(gitignorePath, additionalIgnores, 'utf8');
    log.success('Created .gitignore');
  }
}

/**
 * 패키지 의존성 확인 및 설치 권고
 */
function checkDependencies() {
  log.title('Checking package.json dependencies...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log.error('package.json not found. Please run this script from the project root.');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    'expo',
    'expo-router',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-safe-area-context',
    'react-native-mmkv',
    'zustand',
    '@react-navigation/native',
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length > 0) {
    log.warn('Missing required dependencies:');
    missingDeps.forEach(dep => log.warn(`  - ${dep}`));
    log.info('Run: npx expo install ' + missingDeps.join(' '));
  } else {
    log.success('All required dependencies are present');
  }
}

/**
 * README 생성
 */
function createReadme() {
  log.title('Creating README.md...');
  
  const readmePath = path.join(process.cwd(), 'README.md');
  const readmeContent = `# 🔮 Tarot Timer App

신비로운 타로 타이머 앱 - React Native + Expo 기반

## 📱 프로젝트 구조

\`\`\`
src/
├── app/                    # Expo Router 화면들
├── components/             # 재사용 가능한 UI 컴포넌트
├── screens/               # 화면별 컴포넌트
├── services/              # API 및 외부 서비스
├── utils/                 # 유틸리티 함수들
├── types/                 # TypeScript 타입 정의
├── store/                 # Zustand 상태 관리
├── hooks/                 # 커스텀 React Hook들
└── constants/             # 앱 상수 및 설정
\`\`\`

## 🚀 시작하기

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행  
npm run android

# 웹에서 실행
npm run web
\`\`\`

## 🛠 개발 원칙

- **UI First**: 시각적 완성도를 우선하는 개발
- **TypeScript**: 엄격한 타입 안전성
- **Component Reusability**: 재사용 가능한 컴포넌트 설계
- **Cross-Platform**: 크로스 플랫폼 호환성 유지
- **Performance**: 60fps 애니메이션과 최적화된 성능

## 📚 주요 기능

- 24시간 타로 카드 시스템
- 6개 타로 스프레드 타입
- 완전한 저널링 시스템
- 한국어/영어 다국어 지원
- 라이트/다크 모드 지원

## 🔧 기술 스택

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Storage**: MMKV
- **Animation**: React Native Reanimated
- **Styling**: Design System Tokens

## 📖 문서

- [개발 원칙](./docs/DEVELOPMENT_PRINCIPLES.md)
- [프로젝트 구조](./docs/PROJECT_STRUCTURE_PLAN.md)
- [API 문서](./docs/api/)
- [컴포넌트 가이드](./docs/components/)

---

Made with ❤️ for tarot enthusiasts
`;

  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    log.success('Created README.md');
  } else {
    log.info('README.md already exists');
  }
}

/**
 * 메인 실행 함수
 */
function main() {
  console.log(`${colors.bright}${colors.magenta}
╔══════════════════════════════════════╗
║          🔮 Tarot Timer Setup        ║
║      React Native + Expo Project    ║
╚══════════════════════════════════════╝${colors.reset}
`);

  try {
    createDirectories();
    createIndexFiles();
    createConfigFiles();
    updateGitignore();
    checkDependencies();
    createReadme();
    
    log.title('Setup completed successfully! 🎉');
    log.info('Next steps:');
    log.info('1. Install dependencies: npm install');
    log.info('2. Start development: npm start');
    log.info('3. Begin implementing components following the development principles');
    
  } catch (error) {
    log.error('Setup failed:');
    log.error(error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}