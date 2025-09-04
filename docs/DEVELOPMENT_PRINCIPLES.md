# Tarot Timer Development Principles

> 신비로운 타로 타이머 앱을 위한 아키텍처 가이드라인

## 🎯 Core Philosophy

**"UI First, Function Follows"** - 시각적 완성도를 우선하고, 점진적으로 기능을 확장하는 접근 방식

```
Design System → UI Components → Screen Layout → Data Layer → Backend Integration
```

---

## 1. UI-First Development (UI 우선 개발)

### 🌟 Principle: Visual Excellence First

**설계 우선순위**:
1. **Design System Tokens** - 색상, 타이포그래피, 간격의 일관성
2. **Component Library** - 재사용 가능한 UI 구성 요소
3. **Screen Layouts** - 사용자 경험과 상호작용
4. **State Management** - UI 상태 관리
5. **Business Logic** - 핵심 기능 구현
6. **Backend Integration** - 서버 연동

### 🎨 Implementation Strategy

```typescript
// ✅ Good: UI 컴포넌트부터 시작
const TimerScreen = () => {
  // Mock data로 UI 구현 완료
  const mockTimer = { hours: 14, minutes: 30 };
  const mockCard = { name: "The Star", image: "star.png" };
  
  return (
    <MysticalLayout>
      <TimerDisplay time={mockTimer} />
      <TarotCard card={mockCard} />
      <ActionButtons />
    </MysticalLayout>
  );
};

// ❌ Avoid: 백엔드 로직부터 시작
const TimerScreen = () => {
  const { data, loading } = useTimerAPI(); // 아직 없는 API
  // UI는 나중에...
};
```

### 📱 Development Phases

**Phase 1: Visual Foundation (2-3 days)**
- Design system tokens 구현
- Core UI components 구축
- Layout components 완성
- Mock data로 화면 구성

**Phase 2: Interaction Layer (3-4 days)**
- 애니메이션 및 제스처 추가
- 상태 관리 구현
- Navigation 시스템
- 로컬 데이터 저장

**Phase 3: Business Logic (4-5 days)**
- 타로 카드 로직 구현
- 타이머 시스템 개발
- 알림 시스템 추가
- 설정 관리 기능

**Phase 4: Backend Integration (3-4 days)**
- API 연동
- 사용자 데이터 동기화
- 클라우드 저장소
- 성능 최적화

---

## 2. TypeScript Excellence (타입스크립트 우수성)

### 🛡️ Principle: Type Safety as Foundation

**"Strict by Design"** - 엄격한 타입 정의로 런타임 에러 최소화

### 📋 TypeScript Configuration

```typescript
// tsconfig.json 설정 원칙
{
  "compilerOptions": {
    "strict": true,                    // 모든 엄격한 체크 활성화
    "noImplicitAny": true,            // any 타입 금지
    "noImplicitReturns": true,        // 모든 경로에서 반환값 필요
    "noUnusedLocals": true,           // 사용하지 않는 지역변수 체크
    "exactOptionalPropertyTypes": true // 선택적 프로퍼티 정확한 타입
  }
}
```

### 🎯 Type Definition Standards

```typescript
// ✅ Good: 명확한 타입 정의
interface TarotCard {
  readonly id: string;
  readonly name: string;
  readonly nameKr: string;
  readonly description: string;
  readonly descriptionKr: string;
  readonly keywords: readonly string[];
  readonly keywordsKr: readonly string[];
  readonly imageUrl: string;
  readonly category: 'major' | 'minor';
  readonly suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
}

// ✅ Good: 컴포넌트 Props 타입
interface TimerScreenProps {
  readonly currentCard?: TarotCard;
  readonly isActive: boolean;
  readonly onCardDraw: () => Promise<void>;
  readonly onTimerToggle: (active: boolean) => void;
}

// ❌ Avoid: 느슨한 타입
interface TimerScreenProps {
  currentCard?: any;
  isActive?: boolean;
  onCardDraw?: Function;
  onTimerToggle?: Function;
}
```

### 🔍 Utility Types Usage

```typescript
// ✅ Good: 유틸리티 타입 활용
type CardKeys = keyof TarotCard;
type PublicCardData = Pick<TarotCard, 'name' | 'description' | 'imageUrl'>;
type CardWithoutId = Omit<TarotCard, 'id'>;
type PartialCard = Partial<TarotCard>;

// 제네릭 컴포넌트
interface GenericCardProps<T> {
  readonly data: T;
  readonly onSelect: (item: T) => void;
  readonly renderContent: (item: T) => React.ReactNode;
}

// 조건부 타입
type TimerState<T extends boolean> = T extends true
  ? { isRunning: true; startTime: Date; currentTime: Date }
  : { isRunning: false; lastDuration?: number };
```

---

## 3. Component Reusability (컴포넌트 재사용성)

### 🧩 Principle: Build Once, Use Everywhere

**"Atomic Design Methodology"** - 원자적 설계로 확장 가능한 컴포넌트 시스템

### 🏗️ Component Architecture

```
Atoms (원자)
├── Button
├── Text
├── Icon
└── Input

Molecules (분자)
├── SearchBox (Input + Icon)
├── FormField (Text + Input + Button)
└── CardHeader (Text + Icon + Button)

Organisms (유기체)
├── TarotCard (CardHeader + Image + Actions)
├── Timer (Display + Controls + Progress)
└── NavigationBar (Logo + Menu + User)

Templates (템플릿)
├── ScreenLayout
├── ModalLayout
└── CardLayout

Pages (페이지)
├── TimerScreen
├── SpreadsScreen
└── SettingsScreen
```

### 🎛️ Design Token Integration

```typescript
// ✅ Good: 토큰 기반 컴포넌트
interface ButtonProps {
  readonly variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  readonly size: 'sm' | 'md' | 'lg' | 'xl';
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  ...props 
}) => {
  const styles = {
    // 토큰에서 스타일 가져오기
    backgroundColor: theme.colors.brand[variant === 'primary' ? 'secondary' : 'surface'],
    padding: `${theme.spacing[size]} ${theme.spacing[size === 'sm' ? 'md' : 'lg']}`,
    borderRadius: theme.borderRadius[size === 'sm' ? 'sm' : 'md'],
    ...theme.shadows[variant === 'primary' ? 'mystical' : 'card'],
  };
  
  return (
    <TouchableOpacity style={[styles, fullWidth && { width: '100%' }]} {...props}>
      {loading ? <ActivityIndicator /> : props.children}
    </TouchableOpacity>
  );
};
```

### 🔄 Composition Pattern

```typescript
// ✅ Good: 합성 패턴
const Card = ({ children, ...props }) => (
  <View style={cardStyles} {...props}>{children}</View>
);

Card.Header = ({ children, ...props }) => (
  <View style={headerStyles} {...props}>{children}</View>
);

Card.Content = ({ children, ...props }) => (
  <View style={contentStyles} {...props}>{children}</View>
);

Card.Actions = ({ children, ...props }) => (
  <View style={actionsStyles} {...props}>{children}</View>
);

// 사용법
<Card>
  <Card.Header>
    <Text>Tarot Reading</Text>
  </Card.Header>
  <Card.Content>
    <TarotCardImage />
  </Card.Content>
  <Card.Actions>
    <Button>Draw Card</Button>
  </Card.Actions>
</Card>
```

### 🎨 Variant System

```typescript
// ✅ Good: 체계적인 variant 시스템
interface CardProps {
  readonly variant: 'glass' | 'solid' | 'outline' | 'elevated';
  readonly mood: 'neutral' | 'mystical' | 'warning' | 'success';
  readonly size: 'sm' | 'md' | 'lg' | 'xl';
}

const cardVariants = {
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
  },
  solid: {
    backgroundColor: theme.colors.surface.card,
    borderColor: 'transparent',
  },
  // ... 기타 variant들
} as const;
```

---

## 4. Cross-Platform Compatibility (크로스 플랫폼 호환성)

### 🌐 Principle: Write Once, Run Everywhere

**"Platform Aware, Platform Agnostic"** - 플랫폼 특성을 이해하되, 코드는 범용적으로

### 📱 Platform Detection Strategy

```typescript
// Platform 유틸리티
import { Platform, Dimensions } from 'react-native';

export const platformUtils = {
  // 플랫폼 체크
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  
  // 디바이스 타입
  isTablet: () => {
    const { width, height } = Dimensions.get('window');
    return Math.min(width, height) >= 600;
  },
  
  // 플랫폼별 스타일
  platformStyles: <T>(styles: {
    ios?: T;
    android?: T;
    web?: T;
    default: T;
  }) => {
    return styles[Platform.OS as keyof typeof styles] || styles.default;
  },
} as const;
```

### 🎯 Responsive Design System

```typescript
// ✅ Good: 반응형 브레이크포인트
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);
  
  return {
    isMobile: dimensions.width < breakpoints.tablet,
    isTablet: dimensions.width >= breakpoints.tablet && dimensions.width < breakpoints.desktop,
    isDesktop: dimensions.width >= breakpoints.desktop,
    width: dimensions.width,
    height: dimensions.height,
  };
};
```

### 🔧 Platform-Specific Components

```typescript
// ✅ Good: 플랫폼별 구현 분리
// components/StatusBar/StatusBar.tsx
const StatusBar: React.FC<StatusBarProps> = (props) => {
  if (Platform.OS === 'web') {
    return null; // 웹에서는 상태바 없음
  }
  
  return (
    <ReactNativeStatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent
      {...props}
    />
  );
};

// components/SafeArea/SafeArea.tsx
const SafeArea: React.FC<SafeAreaProps> = ({ children, ...props }) => {
  if (Platform.OS === 'web') {
    return <div style={{ padding: '20px' }}>{children}</div>;
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} {...props}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
```

### 📂 File Structure for Cross-Platform

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx              # 공통 구현
│   │   ├── Button.web.tsx          # 웹 전용
│   │   ├── Button.ios.tsx          # iOS 전용
│   │   └── Button.android.tsx      # Android 전용
│   └── ...
├── utils/
│   ├── platform.ts                # 플랫폼 유틸리티
│   ├── dimensions.ts              # 반응형 유틸리티
│   └── navigation.ts              # 내비게이션 유틸리티
└── ...
```

---

## 5. Performance Optimization (성능 최적화)

### ⚡ Principle: Performance by Design

**"Measure First, Optimize Smart"** - 측정 기반 최적화로 사용자 경험 향상

### 📊 Performance Metrics

```typescript
// 성능 측정 목표
const performanceTargets = {
  // 앱 시작 시간
  appStartup: 2000,        // 2초 이내
  
  // 화면 전환
  screenTransition: 300,    // 300ms 이내
  
  // 애니메이션 프레임율
  animationFPS: 60,         // 60fps 유지
  
  // 메모리 사용량
  memoryUsage: 100,         // 100MB 이하 (모바일)
  
  // 번들 크기
  bundleSize: {
    ios: 20,                // 20MB 이하
    android: 25,            // 25MB 이하
    web: 5,                 // 5MB 이하 (초기 로드)
  },
} as const;
```

### 🚀 React Native Optimizations

```typescript
// ✅ Good: React.memo로 불필요한 리렌더링 방지
export const TarotCard = React.memo<TarotCardProps>(({ 
  card, 
  onPress, 
  isRevealed 
}) => {
  // 애니메이션 값은 useSharedValue 사용
  const flipRotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${flipRotation.value}deg` },
      { scale: scale.value },
    ],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <ImageBackground source={card.imageUrl} style={cardStyles}>
          {isRevealed && <CardContent card={card} />}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수로 최적화
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.isRevealed === nextProps.isRevealed
  );
});
```

### 🎭 Image Optimization

```typescript
// ✅ Good: 이미지 최적화 전략
export const OptimizedImage: React.FC<ImageProps> = ({
  source,
  style,
  placeholder,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <View style={style}>
      {/* 플레이스홀더 */}
      {loading && (
        <View style={[style, placeholderStyles]}>
          <ActivityIndicator color={theme.colors.brand.secondary} />
        </View>
      )}
      
      {/* 실제 이미지 */}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        resizeMode="cover"
        // 웹에서 lazy loading
        {...(Platform.OS === 'web' && { loading: 'lazy' })}
        {...props}
      />
      
      {/* 에러 상태 */}
      {error && (
        <View style={[style, errorStyles]}>
          <Icon name="image-off" size={24} />
        </View>
      )}
    </View>
  );
};
```

### 🧠 State Management Optimization

```typescript
// ✅ Good: Zustand로 최적화된 상태 관리
interface AppState {
  // Timer 상태
  timer: {
    isActive: boolean;
    startTime: Date | null;
    currentCard: TarotCard | null;
    dailyCards: TarotCard[];
  };
  
  // UI 상태
  ui: {
    activeTab: string;
    modalVisible: boolean;
    loading: boolean;
  };
  
  // 액션들
  startTimer: (card: TarotCard) => void;
  stopTimer: () => void;
  setActiveTab: (tab: string) => void;
  toggleModal: (visible: boolean) => void;
}

export const useAppStore = create<AppState>()(
  // devtools와 persist 미들웨어
  devtools(
    persist(
      (set, get) => ({
        timer: {
          isActive: false,
          startTime: null,
          currentCard: null,
          dailyCards: [],
        },
        ui: {
          activeTab: 'timer',
          modalVisible: false,
          loading: false,
        },
        
        // Immer 사용으로 불변성 보장
        startTimer: (card) => set(
          produce((state) => {
            state.timer.isActive = true;
            state.timer.startTime = new Date();
            state.timer.currentCard = card;
          })
        ),
        
        stopTimer: () => set(
          produce((state) => {
            state.timer.isActive = false;
            state.timer.startTime = null;
          })
        ),
        
        setActiveTab: (tab) => set(
          produce((state) => {
            state.ui.activeTab = tab;
          })
        ),
      }),
      {
        name: 'tarot-timer-storage',
        // 중요한 상태만 persist
        partialize: (state) => ({ 
          timer: state.timer,
          ui: { activeTab: state.ui.activeTab }
        }),
      }
    )
  )
);
```

### 🔧 Bundle Optimization

```typescript
// metro.config.js - 번들 최적화
module.exports = {
  transformer: {
    // Hermes 엔진 활용
    hermesCommand: 'hermesc',
    minifierConfig: {
      // 프로덕션에서 console.log 제거
      drop_console: true,
      passes: 3,
    },
  },
  
  resolver: {
    // 플랫폼별 확장자 우선순위
    platforms: ['native', 'ios', 'android', 'web'],
    
    // 불필요한 파일 제외
    blockList: [
      /.*\/__tests__\/.*/,
      /.*\.test\.(js|ts|tsx)$/,
      /.*\.spec\.(js|ts|tsx)$/,
    ],
  },
};
```

---

## 🎯 Implementation Checklist

### ✅ Phase 1: Foundation Setup
- [ ] Design system tokens 구현
- [ ] TypeScript 엄격 모드 설정
- [ ] 기본 컴포넌트 라이브러리
- [ ] 플랫폼 감지 유틸리티
- [ ] 성능 측정 도구

### ✅ Phase 2: Component Development
- [ ] Atomic design 구조 적용
- [ ] 크로스 플랫폼 컴포넌트
- [ ] 상태 관리 최적화
- [ ] 애니메이션 성능 튜닝
- [ ] 이미지 최적화

### ✅ Phase 3: Integration & Testing
- [ ] 플랫폼별 테스트
- [ ] 성능 벤치마크
- [ ] 접근성 검증
- [ ] 메모리 누수 체크
- [ ] 번들 크기 분석

---

## 📈 Success Metrics

### 개발 효율성
- **컴포넌트 재사용률**: 80% 이상
- **TypeScript 커버리지**: 95% 이상
- **빌드 시간**: 3분 이내
- **Hot reload 시간**: 2초 이내

### 앱 성능
- **앱 시작 시간**: 2초 이내
- **메모리 사용량**: 100MB 이하
- **크래시율**: 0.1% 미만
- **사용자 만족도**: 4.5점 이상

### 코드 품질
- **ESLint 에러**: 0개
- **TypeScript 에러**: 0개
- **테스트 커버리지**: 80% 이상
- **코드 중복률**: 5% 미만

---

**🌟 Remember**: 이 가이드라인은 살아있는 문서입니다. 프로젝트 진행에 따라 지속적으로 개선하고 발전시켜 나가세요!