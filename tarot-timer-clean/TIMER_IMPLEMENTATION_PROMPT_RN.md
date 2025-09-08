# React Native 타로 타이머 앱 구현 프롬프트

## 프로젝트 개요

25-45세 타겟 사용자를 위한 프리미엄 타로 타이머 React Native 앱을 개발합니다. 신비롭고 고급스러운 UI/UX를 통해 24시간 타로 시스템, 스프레드 리딩, 저널링 기능을 제공하는 완전한 모바일 앱입니다.

## 기술 스택

### Core Technologies
- **React Native**: 0.72+
- **Expo**: SDK 49+
- **TypeScript**: 5.0+
- **React Navigation**: 6.x (Bottom Tabs + Stack)

### UI & Styling
- **React Native StyleSheet**: 네이티브 스타일링
- **LinearGradient**: expo-linear-gradient
- **BlurView**: expo-blur
- **Reanimated**: react-native-reanimated 3.x
- **Vector Icons**: @expo/vector-icons

### Device Features
- **AsyncStorage**: @react-native-async-storage/async-storage
- **Haptics**: expo-haptics
- **StatusBar**: expo-status-bar
- **SafeAreaView**: react-native-safe-area-context
- **Audio**: expo-av (사운드 효과)

### State Management
- **React Context**: 언어 및 설정 관리
- **React Hooks**: 로컬 상태 관리
- **AsyncStorage**: 영구 데이터 저장

## 앱 구조

### 메인 탭 구조
```
MainNavigator (Stack)
├── TabNavigator (Bottom Tabs)
│   ├── TimerScreen (24시간 타로 타이머)
│   ├── SpreadsScreen (타로 스프레드)
│   ├── JournalScreen (저널 & 기록)
│   └── SettingsScreen (설정)
├── SpreadDetailScreen (스프레드 상세)
├── DailyTarotViewerScreen (일일 타로 뷰어)
└── SavedSpreadViewerScreen (저장된 스프레드 뷰어)
```

### 폴더 구조
```
src/
├── components/
│   ├── ui/                    # 기본 UI 컴포넌트
│   ├── icons/                 # SVG 아이콘 컴포넌트
│   ├── timer/                 # 타이머 관련 컴포넌트
│   ├── spreads/               # 스프레드 관련 컴포넌트
│   ├── journal/               # 저널 관련 컴포넌트
│   └── shared/                # 공통 컴포넌트
├── screens/
│   ├── TimerScreen.js
│   ├── SpreadsScreen.js
│   ├── JournalScreen.js
│   ├── SettingsScreen.js
│   ├── SpreadDetailScreen.js
│   └── DailyTarotViewerScreen.js
├── navigation/
│   ├── MainNavigator.js
│   └── TabNavigator.js
├── contexts/
│   ├── LanguageContext.js
│   └── SettingsContext.js
├── utils/
│   ├── colors.js
│   ├── styles.js
│   ├── storage.js
│   ├── tarot-data.js
│   ├── haptics.js
│   └── audio.js
├── assets/
│   ├── images/
│   ├── sounds/
│   └── fonts/
└── constants/
    └── index.js
```

## 디자인 시스템

### 색상 시스템
```javascript
export const colors = {
  light: {
    background: '#ffffff',
    foreground: '#1a1f3a',
    primary: '#4a1a4f',
    secondary: '#fafafa',
    accent: '#d4af37',
    border: '#e8e1e8',
    premiumGold: '#d4af37',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
  },
  dark: {
    background: '#0f0f1a',
    foreground: '#ffffff',
    primary: '#4a1a4f',
    secondary: '#1a1f3a',
    accent: '#f4d03f',
    border: '#2a2f4a',
    premiumGold: '#f4d03f',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
  }
};
```

### 타이포그래피
```javascript
export const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 38,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 31,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 24,
  },
  // ...기타 타이포그래피
};
```

### 그라데이션
```javascript
export const gradients = {
  mystical: ['#1a1f3a', '#4a1a4f', '#1a1f3a'],
  gold: ['#d4af37', '#f4d03f'],
  purple: ['#4a1a4f', '#7a5a7f'],
};
```

## 핵심 기능 구현

### 1. TimerScreen - 24시간 타로 타이머

#### 주요 컴포넌트
- **DailyCardDrawer**: 24장 카드 한번에 뽑기
- **HourlyCardScroll**: 가로 스크롤 시간별 카드
- **CurrentCardDisplay**: 현재 시간 카드 표시
- **MemoSection**: 시간별 메모 입력
- **MysticalBackground**: 신비로운 배경 효과

#### 상태 관리
```javascript
const [currentTime, setCurrentTime] = useState(new Date());
const [dailyCards, setDailyCards] = useState([]);
const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
const [selectedCardIndex, setSelectedCardIndex] = useState(null);
const [hourlyMemos, setHourlyMemos] = useState({});
const [isDrawingAll, setIsDrawingAll] = useState(false);
```

#### 핵심 함수
- `drawAll24Cards()`: 24장 카드 생성
- `handleCardClick(index)`: 시간별 카드 선택
- `saveDailyTarotReading()`: 일일 타로 저장
- `handleMemoChange(value)`: 메모 업데이트

### 2. SpreadsScreen - 타로 스프레드

#### 스프레드 타입
- 3카드 스프레드 (과거-현재-미래)
- 4카드 스프레드 (상황 분석)
- 5카드 스프레드 (내면 성장)
- AB선택 스프레드 (7카드)
- 켈틱 크로스 (10카드) - 프리미엄
- 관계 스프레드 (11카드) - 프리미엄

#### 애니메이션 효과
- 카드 뒤집기 애니메이션
- 신비로운 등장 효과
- 터치 피드백

### 3. JournalScreen - 저널 & 기록

#### 섹션 구분
- **Daily Tarot**: 일일 24시간 타로 기록
- **Spread Records**: 스프레드 리딩 기록

#### 데이터 구조
```javascript
// Daily Tarot Save
{
  id: string,
  date: string,
  hourlyCards: TarotCard[],
  memos: { [hour: number]: string },
  insights: string,
  savedAt: string
}

// Spread Save
{
  id: string,
  title: string,
  spreadType: string,
  cards: TarotCard[],
  insights: string,
  date: string,
  savedAt: string
}
```

### 4. SettingsScreen - 설정

#### 설정 카테고리
- **프리미엄 멤버십**: 구독 상태 및 관리
- **화면 & 테마**: 다크모드, 언어 설정
- **알림**: 일일 알림, 스프레드 완료 알림
- **사운드 & 햅틱**: 효과음, 진동 피드백
- **타로 설정**: 카드 해석 깊이, 신비로운 효과
- **타이머 & 일일 설정**: 자동 저장, 시간대 알림
- **저널 & 데이터 관리**: 백업, 내보내기
- **접근성**: 텍스트 크기, 고대비 모드
- **고급 기능**: 커스텀 스프레드, 명상 타이머
- **개인정보 & 보안**: 개인정보 처리방침
- **지원**: 도움말, 개발자 지원

## 애니메이션 & 상호작용

### 애니메이션 라이브러리
```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
```

### 주요 애니메이션
- **MysticalPulse**: 신비로운 펄스 효과
- **CardFlip**: 카드 뒤집기 3D 효과
- **FadeInUp**: 부드러운 등장 애니메이션
- **GlowEffect**: 골드 글로우 효과

### 햅틱 피드백
```javascript
import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};
```

## 데이터 저장

### AsyncStorage 구조
```javascript
// 저장 키
const KEYS = {
  DAILY_TAROT_SAVES: 'dailyTarotSaves',
  SAVED_SPREADS: 'savedSpreads',
  USER_SETTINGS: 'userSettings',
  LANGUAGE: 'language',
};

// 저장 함수
export const saveDailyTarot = async (dailyTarotSave) => {
  const existingSaves = await getDailyTarotSaves();
  const updatedSaves = [...existingSaves, dailyTarotSave];
  await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(updatedSaves));
};
```

## 네비게이션 시스템

### TabNavigator 설정
```javascript
<Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: 'rgba(26, 31, 58, 0.95)',
      borderTopColor: 'rgba(212, 175, 55, 0.2)',
      height: 80,
      paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    },
    tabBarActiveTintColor: '#d4af37',
    tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
  }}
>
```

### StackNavigator 설정
```javascript
<Stack.Navigator 
  screenOptions={{ 
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }}
>
```

## 타로 데이터 시스템

### 카드 데이터 구조
```javascript
export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  meaning: string;
  meaningKr: string;
  keywords: string[];
  keywordsKr: string[];
  imageUrl: string;
  element: string;
  suit: string;
  type: 'Major Arcana' | 'Minor Arcana';
}
```

### 완전한 78장 카드 시스템
- **메이저 아르카나**: 22장 (0-21)
- **마이너 아르카나**: 56장 (4개 수트 × 14장)
  - 완드(Wands) - 불의 원소
  - 컵(Cups) - 물의 원소  
  - 소드(Swords) - 공기의 원소
  - 펜타클(Pentacles) - 땅의 원소

## 언어 지원

### 다국어 시스템
```javascript
const translations = {
  ko: {
    nav: { timer: '타이머', spreads: '스프레드' },
    timer: { title: '24시간 타로 타이머' },
    // ...
  },
  en: {
    nav: { timer: 'Timer', spreads: 'Spreads' },
    timer: { title: '24-Hour Tarot Timer' },
    // ...
  },
};
```

## 성능 최적화

### 이미지 최적화
```javascript
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ source, style }) => (
  <FastImage
    source={{ uri: source, priority: FastImage.priority.normal }}
    style={style}
    resizeMode={FastImage.resizeMode.cover}
  />
);
```

### FlatList 사용
```javascript
<FlatList
  data={cards}
  renderItem={renderCard}
  keyExtractor={(item) => item.id.toString()}
  horizontal
  showsHorizontalScrollIndicator={false}
  getItemLayout={(data, index) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  })}
/>
```

## 접근성

### 접근성 지원
```javascript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="타로 카드"
  accessibilityHint="탭하여 카드를 선택하세요"
  accessibilityRole="button"
>
```

## 테마 시스템

### 다크모드 지원
```javascript
const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? colors.dark : colors.light;
};
```

## 디바이스 대응

### 반응형 디자인
```javascript
const { width, height } = Dimensions.get('window');

const getCardSize = () => {
  if (width < 375) return { width: 50, height: 75 };
  if (width < 414) return { width: 64, height: 96 };
  return { width: 70, height: 105 };
};
```

### Safe Area 처리
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  {/* 앱 콘텐츠 */}
</SafeAreaView>
```

## 구현 우선순위

### Phase 1: 기본 구조 (1-2일)
1. 프로젝트 셋업 및 네비게이션
2. 기본 UI 컴포넌트
3. 색상 및 스타일 시스템

### Phase 2: 핵심 화면 (3-4일)
1. TimerScreen 구현
2. 24시간 카드 시스템
3. AsyncStorage 연동

### Phase 3: 부가 기능 (2-3일)
1. SpreadsScreen 구현
2. JournalScreen 구현
3. SettingsScreen 구현

### Phase 4: 고급 기능 (2-3일)
1. 애니메이션 및 효과
2. 햅틱 피드백
3. 사운드 효과

### Phase 5: 최적화 (1-2일)
1. 성능 최적화
2. 테스트 및 버그 수정
3. 접근성 개선

## 배포 준비

### app.json 설정
```json
{
  "expo": {
    "name": "타로 타이머",
    "slug": "tarot-timer",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#1a1f3a"
    },
    "ios": {
      "bundleIdentifier": "com.mystical.tarot-timer"
    },
    "android": {
      "package": "com.mystical.tarottimer"
    }
  }
}
```

이 프롬프트를 기반으로 완전한 React Native 타로 타이머 앱을 구현할 수 있습니다.