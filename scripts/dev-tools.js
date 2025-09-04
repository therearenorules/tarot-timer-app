#!/usr/bin/env node

/**
 * 타로 타이머 개발 도구 스크립트
 * 개발 효율성을 위한 유틸리티 명령어들
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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
 * 컴포넌트 템플릿 생성
 */
function createComponent(componentName, componentType = 'base') {
  log.title(`Creating ${componentType} component: ${componentName}`);
  
  const componentDir = path.join(process.cwd(), 'src/components', componentType, componentName);
  const componentFile = path.join(componentDir, `${componentName}.tsx`);
  const indexFile = path.join(componentDir, 'index.ts');
  const testFile = path.join(componentDir, `${componentName}.test.tsx`);
  
  // 컴포넌트 템플릿
  const componentTemplate = `import React from 'react';
import { View, ViewStyle } from 'react-native';

// Types
interface ${componentName}Props {
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

/**
 * ${componentName} 컴포넌트
 * TODO: 컴포넌트 설명 추가
 */
export const ${componentName}: React.FC<${componentName}Props> = ({
  children,
  style,
  testID = '${componentName.toLowerCase()}',
  ...props
}) => {
  return (
    <View 
      style={[
        // TODO: 기본 스타일 추가
        style,
      ]} 
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

// 타입 재export
export type { ${componentName}Props };`;

  // Index 파일 템플릿
  const indexTemplate = `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';`;

  // 테스트 파일 템플릿  
  const testTemplate = `import React from 'react';
import { render } from '@testing-library/react-native';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<${componentName} />);
    expect(getByTestId('${componentName.toLowerCase()}')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<${componentName} style={customStyle} />);
    
    const component = getByTestId('${componentName.toLowerCase()}');
    expect(component.props.style).toEqual(expect.arrayContaining([customStyle]));
  });
});`;

  // 디렉토리 생성
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
    log.success(`Created directory: ${componentDir}`);
  }
  
  // 파일들 생성
  if (!fs.existsSync(componentFile)) {
    fs.writeFileSync(componentFile, componentTemplate, 'utf8');
    log.success(`Created component: ${componentFile}`);
  } else {
    log.warn(`Component already exists: ${componentFile}`);
  }
  
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, indexTemplate, 'utf8');
    log.success(`Created index: ${indexFile}`);
  }
  
  if (!fs.existsSync(testFile)) {
    fs.writeFileSync(testFile, testTemplate, 'utf8');
    log.success(`Created test: ${testFile}`);
  }
  
  // 상위 index.ts 업데이트
  updateIndexFile(componentType, componentName);
}

/**
 * 화면 템플릿 생성
 */
function createScreen(screenName) {
  log.title(`Creating screen: ${screenName}`);
  
  const screenDir = path.join(process.cwd(), 'src/screens', `${screenName}Screen`);
  const screenFile = path.join(screenDir, `${screenName}Screen.tsx`);
  const indexFile = path.join(screenDir, 'index.ts');
  const hooksDir = path.join(screenDir, 'hooks');
  const componentsDir = path.join(screenDir, 'components');
  
  // 화면 템플릿
  const screenTemplate = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Design System
import { theme } from '../../../design-system';

// Components
import { Card, Button } from '../../components';

// Types
interface ${screenName}ScreenProps {
  // TODO: Props 타입 정의
}

/**
 * ${screenName} 화면 컴포넌트
 * TODO: 화면 설명 추가
 */
export const ${screenName}Screen: React.FC<${screenName}ScreenProps> = ({
  ...props
}) => {
  // TODO: 화면 로직 구현
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card>
          <Text style={styles.title}>${screenName} Screen</Text>
          <Text style={styles.description}>
            TODO: ${screenName} 화면 구현
          </Text>
          
          <Button 
            variant="primary"
            onPress={() => {
              // TODO: 버튼 액션 구현
            }}
          >
            시작하기
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
});

// 타입 재export
export type { ${screenName}ScreenProps };`;

  // Index 템플릿
  const indexTemplate = `export { ${screenName}Screen } from './${screenName}Screen';
export type { ${screenName}ScreenProps } from './${screenName}Screen';`;

  // 디렉토리들 생성
  [screenDir, hooksDir, componentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.success(`Created directory: ${dir}`);
    }
  });
  
  // 파일들 생성
  if (!fs.existsSync(screenFile)) {
    fs.writeFileSync(screenFile, screenTemplate, 'utf8');
    log.success(`Created screen: ${screenFile}`);
  } else {
    log.warn(`Screen already exists: ${screenFile}`);
  }
  
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, indexTemplate, 'utf8');
    log.success(`Created index: ${indexFile}`);
  }
}

/**
 * 훅 템플릿 생성
 */
function createHook(hookName, hookType = 'common') {
  log.title(`Creating ${hookType} hook: ${hookName}`);
  
  const hookDir = path.join(process.cwd(), 'src/hooks', hookType);
  const hookFile = path.join(hookDir, `${hookName}.ts`);
  
  // 훅 템플릿
  const hookTemplate = `import { useState, useEffect, useCallback } from 'react';

// Types
interface ${hookName}Options {
  // TODO: 옵션 타입 정의
}

interface ${hookName}Return {
  // TODO: 반환 타입 정의
  data: any;
  loading: boolean;
  error: Error | null;
}

/**
 * ${hookName} 커스텀 훅
 * TODO: 훅 설명 추가
 */
export const ${hookName} = (
  options: ${hookName}Options = {}
): ${hookName}Return => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // TODO: 훅 로직 구현
  
  useEffect(() => {
    // TODO: Effect 로직 구현
  }, []);
  
  const handleAction = useCallback(() => {
    // TODO: 액션 로직 구현
  }, []);
  
  return {
    data,
    loading,
    error,
    // TODO: 추가 반환 값들
  };
};

// 타입 재export
export type { ${hookName}Options, ${hookName}Return };`;

  // 디렉토리 생성
  if (!fs.existsSync(hookDir)) {
    fs.mkdirSync(hookDir, { recursive: true });
    log.success(`Created directory: ${hookDir}`);
  }
  
  // 파일 생성
  if (!fs.existsSync(hookFile)) {
    fs.writeFileSync(hookFile, hookTemplate, 'utf8');
    log.success(`Created hook: ${hookFile}`);
  } else {
    log.warn(`Hook already exists: ${hookFile}`);
  }
}

/**
 * 인덱스 파일 업데이트
 */
function updateIndexFile(componentType, componentName) {
  const indexPath = path.join(process.cwd(), 'src/components', componentType, 'index.ts');
  
  if (fs.existsSync(indexPath)) {
    const existingContent = fs.readFileSync(indexPath, 'utf8');
    const exportLine = `export * from './${componentName}';`;
    
    if (!existingContent.includes(exportLine)) {
      fs.appendFileSync(indexPath, `\n${exportLine}`);
      log.success(`Updated index file: ${indexPath}`);
    }
  }
}

/**
 * 프로젝트 통계 출력
 */
function showStats() {
  log.title('Project Statistics');
  
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    log.error('src directory not found');
    return;
  }
  
  // 파일 타입별 카운트
  const stats = {
    components: 0,
    screens: 0,
    hooks: 0,
    utils: 0,
    services: 0,
    types: 0,
    totalFiles: 0,
  };
  
  function countFiles(dir, category) {
    if (!fs.existsSync(dir)) return 0;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    
    files.forEach(file => {
      if (file.isDirectory()) {
        count += countFiles(path.join(dir, file.name), category);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        if (!file.name.includes('index') && !file.name.includes('test')) {
          count++;
          stats.totalFiles++;
        }
      }
    });
    
    return count;
  }
  
  stats.components = countFiles(path.join(srcDir, 'components'));
  stats.screens = countFiles(path.join(srcDir, 'screens'));
  stats.hooks = countFiles(path.join(srcDir, 'hooks'));
  stats.utils = countFiles(path.join(srcDir, 'utils'));
  stats.services = countFiles(path.join(srcDir, 'services'));
  stats.types = countFiles(path.join(srcDir, 'types'));
  
  log.info(`📱 Components: ${stats.components}`);
  log.info(`🖥 Screens: ${stats.screens}`);
  log.info(`🎣 Hooks: ${stats.hooks}`);
  log.info(`🔧 Utils: ${stats.utils}`);
  log.info(`⚡ Services: ${stats.services}`);
  log.info(`📝 Types: ${stats.types}`);
  log.info(`📁 Total Files: ${stats.totalFiles}`);
}

/**
 * 도움말 표시
 */
function showHelp() {
  console.log(`${colors.bright}🔮 Tarot Timer Dev Tools${colors.reset}

Usage: node scripts/dev-tools.js <command> [options]

Commands:
  component <name> [type]    Create a new component
                            Types: base, composite, forms, layout
  
  screen <name>             Create a new screen with folder structure
  
  hook <name> [type]        Create a new custom hook
                           Types: common, platform, api, storage, animations
  
  stats                     Show project statistics
  
  help                      Show this help message

Examples:
  node scripts/dev-tools.js component Button base
  node scripts/dev-tools.js screen Timer
  node scripts/dev-tools.js hook useTimer common
  node scripts/dev-tools.js stats

${colors.cyan}Made with ❤️ for tarot development${colors.reset}
`);
}

/**
 * 메인 실행 함수
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'component':
      const componentName = args[1];
      const componentType = args[2] || 'base';
      
      if (!componentName) {
        log.error('Component name is required');
        log.info('Usage: node scripts/dev-tools.js component <name> [type]');
        return;
      }
      
      createComponent(componentName, componentType);
      break;
      
    case 'screen':
      const screenName = args[1];
      
      if (!screenName) {
        log.error('Screen name is required');
        log.info('Usage: node scripts/dev-tools.js screen <name>');
        return;
      }
      
      createScreen(screenName);
      break;
      
    case 'hook':
      const hookName = args[1];
      const hookType = args[2] || 'common';
      
      if (!hookName) {
        log.error('Hook name is required');
        log.info('Usage: node scripts/dev-tools.js hook <name> [type]');
        return;
      }
      
      createHook(hookName, hookType);
      break;
      
    case 'stats':
      showStats();
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}