# React Native 타로 타이머 앱 완전 구현 가이드

## 프로젝트 초기 설정

### 1. 프로젝트 생성
```bash
npx create-expo-app TarotTimer --template typescript
cd TarotTimer
```

### 2. 필수 패키지 설치
```bash
# 네비게이션
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
expo install react-native-screens react-native-safe-area-context

# UI 및 애니메이션
expo install expo-linear-gradient expo-blur react-native-reanimated
expo install react-native-gesture-handler

# 디바이스 기능
expo install @react-native-async-storage/async-storage
expo install expo-haptics expo-status-bar expo-av

# 기타 유틸리티
npm install react-native-svg
expo install expo-font
```

### 3. package.json 설정
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/stack": "^6.3.20",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "expo-linear-gradient": "^12.7.2",
    "expo-blur": "^12.9.2",
    "react-native-reanimated": "^3.6.1",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.8.2",
    "expo-haptics": "^12.8.1",
    "expo-status-bar": "^1.7.1",
    "expo-av": "^13.10.4",
    "react-native-svg": "^14.1.0",
    "expo-font": "^11.10.2"
  }
}
```

## 폴더 구조

```
src/
├── components/
│   ├── ui/                    # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── TextInput.tsx
│   │   └── Switch.tsx
│   ├── icons/                 # SVG 아이콘 컴포넌트
│   │   ├── ClockIcon.tsx
│   │   ├── TarotCardsIcon.tsx
│   │   └── index.ts
│   ├── timer/                 # 타이머 관련 컴포넌트
│   │   ├── DailyCardDrawer.tsx
│   │   ├── HourlyCardScroll.tsx
│   │   ├── CurrentCardDisplay.tsx
│   │   ├── MemoSection.tsx
│   │   └── MysticalBackground.tsx
│   ├── spreads/               # 스프레드 관련 컴포넌트
│   │   ├── SpreadCard.tsx
│   │   ├── SpreadDetail.tsx
│   │   └── CardGrid.tsx
│   ├── journal/               # 저널 관련 컴포넌트
│   │   ├── DailyTarotCard.tsx
│   │   ├── SpreadRecord.tsx
│   │   └── JournalViewer.tsx
│   └── shared/                # 공통 컴포넌트
│       ├── GradientBackground.tsx
│       ├── MysticalHeader.tsx
│       └── LoadingSpinner.tsx
├── screens/
│   ├── TimerScreen.tsx
│   ├── SpreadsScreen.tsx
│   ├── JournalScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── SpreadDetailScreen.tsx
│   └── DailyTarotViewerScreen.tsx
├── navigation/
│   ├── MainNavigator.tsx
│   └── types.ts
├── contexts/
│   ├── LanguageContext.tsx
│   └── SettingsContext.tsx
├── utils/
│   ├── colors.ts
│   ├── styles.ts
│   ├── storage.ts
│   ├── tarot-data.ts
│   ├── haptics.ts
│   ├── audio.ts
│   └── device.ts
├── constants/
│   └── index.ts
└── types/
    └── index.ts
```

## 핵심 유틸리티 구현

### 1. colors.ts
```typescript
export const colors = {
  light: {
    background: '#ffffff',
    foreground: '#1a1f3a',
    card: '#ffffff',
    cardForeground: '#1a1f3a',
    primary: '#4a1a4f',
    primaryForeground: '#ffffff',
    secondary: '#fafafa',
    secondaryForeground: '#4a1a4f',
    accent: '#d4af37',
    accentForeground: '#1a1f3a',
    border: '#e8e1e8',
    premiumGold: '#d4af37',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
  },
  dark: {
    background: '#0f0f1a',
    foreground: '#ffffff',
    card: '#1a1f3a',
    cardForeground: '#ffffff',
    primary: '#4a1a4f',
    primaryForeground: '#ffffff',
    secondary: '#1a1f3a',
    secondaryForeground: '#c8b8d4',
    accent: '#f4d03f',
    accentForeground: '#0f0f1a',
    border: '#2a2f4a',
    premiumGold: '#f4d03f',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
  }
};

export const gradients = {
  mystical: ['#1a1f3a', '#4a1a4f', '#1a1f3a'],
  gold: ['#d4af37', '#f4d03f'],
  purple: ['#4a1a4f', '#7a5a7f'],
};
```

### 2. styles.ts
```typescript
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 38,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 34,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 31,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: '500', android: '500' }) as any,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 16,
  },
};

export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
  gold: Platform.select({
    ios: {
      shadowColor: '#d4af37',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadows.medium,
  },
  mysticalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    ...shadows.gold,
  },
});

export const screenWidth = width;
export const screenHeight = height;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
```

### 3. storage.ts
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DAILY_TAROT_SAVES: 'dailyTarotSaves',
  SAVED_SPREADS: 'savedSpreads',
  USER_SETTINGS: 'userSettings',
  LANGUAGE: 'language',
};

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

export interface SavedSpread {
  id: string;
  title: string;
  spreadType: string;
  spreadName: string;
  date: string;
  cards: TarotCard[];
  insights: string;
  savedAt: string;
}

// Daily Tarot 관련
export const saveDailyTarot = async (dailyTarotSave: DailyTarotSave): Promise<boolean> => {
  try {
    const existingSaves = await getDailyTarotSaves();
    const updatedSaves = [...existingSaves, dailyTarotSave];
    await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(updatedSaves));
    return true;
  } catch (error) {
    console.error('Error saving daily tarot:', error);
    return false;
  }
};

export const getDailyTarotSaves = async (): Promise<DailyTarotSave[]> => {
  try {
    const saves = await AsyncStorage.getItem(KEYS.DAILY_TAROT_SAVES);
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Error loading daily tarot saves:', error);
    return [];
  }
};

export const getTodaysSave = async (): Promise<DailyTarotSave | null> => {
  try {
    const saves = await getDailyTarotSaves();
    const today = new Date().toDateString();
    return saves.find(save => save.date === today) || null;
  } catch (error) {
    console.error('Error getting today\'s save:', error);
    return null;
  }
};

// 설정 관련
export const saveUserSettings = async (settings: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

export const getUserSettings = async (): Promise<any> => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Error loading user settings:', error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  language: 'ko',
  soundEffects: true,
  hapticFeedback: true,
  cardDepth: true,
  mysticalEffects: true,
  cardFlipAnimation: true,
  dailyReminders: true,
  autoSave: true,
});
```

### 4. haptics.ts
```typescript
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticFeedback = {
  light: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  
  success: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  selection: () => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
};

// 편의 함수들
export const cardSelectFeedback = () => HapticFeedback.light();
export const cardFlipFeedback = () => HapticFeedback.medium();
export const spreadCompleteFeedback = () => HapticFeedback.success();
export const buttonPressFeedback = () => HapticFeedback.selection();
```

## 네비게이션 시스템

### 1. navigation/types.ts
```typescript
export type RootStackParamList = {
  Tabs: undefined;
  SpreadDetail: { spread: SpreadType };
  DailyTarotViewer: { dailyTarot: DailyTarotSave };
  SavedSpreadViewer: { savedSpread: SavedSpread };
};

export type TabParamList = {
  Timer: undefined;
  Spreads: undefined;
  Journal: undefined;
  Settings: undefined;
};
```

### 2. navigation/MainNavigator.tsx
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import TimerScreen from '../screens/TimerScreen';
import SpreadsScreen from '../screens/SpreadsScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SpreadDetailScreen from '../screens/SpreadDetailScreen';
import DailyTarotViewerScreen from '../screens/DailyTarotViewerScreen';

import { ClockIcon, LayoutIcon, BookOpenIcon, SettingsIcon } from '../components/icons';
import { colors } from '../utils/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderTopColor: 'rgba(212, 175, 55, 0.2)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.dark.premiumGold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{
          tabBarLabel: '타이머',
          tabBarIcon: ({ color, size }) => (
            <ClockIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Spreads" 
        component={SpreadsScreen}
        options={{
          tabBarLabel: '스프레드',
          tabBarIcon: ({ color, size }) => (
            <LayoutIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarLabel: '저널',
          tabBarIcon: ({ color, size }) => (
            <BookOpenIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1a1f3a" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="SpreadDetail" component={SpreadDetailScreen} />
        <Stack.Screen name="DailyTarotViewer" component={DailyTarotViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 기본 UI 컴포넌트

### 1. components/ui/Button.tsx
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../utils/colors';
import { typography, shadows } from '../../utils/styles';
import { buttonPressFeedback } from '../../utils/haptics';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ 
  children, 
  onPress, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  style, 
  textStyle,
}: ButtonProps) {
  const handlePress = () => {
    buttonPressFeedback();
    onPress();
  };

  const buttonStyles = [
    styles.container,
    styles[size],
    variant === 'outline' && styles.outline,
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    textStyle
  ];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        style={buttonStyles}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={textStyles}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.dark.premiumGold : "#fff"} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  
  // Variants
  secondary: {
    backgroundColor: colors.dark.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  
  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  smText: {
    ...typography.bodyMedium,
  },
  mdText: {
    ...typography.bodyLarge,
  },
  lgText: {
    fontSize: 18,
    lineHeight: 24,
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: colors.dark.foreground,
  },
  outlineText: {
    color: colors.dark.foreground,
  },
  
  disabled: {
    opacity: 0.5,
  },
});
```

### 2. components/ui/Card.tsx
```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { globalStyles } from '../../utils/styles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: boolean;
  variant?: 'default' | 'mystical';
}

export default function Card({ children, style, blur = false, variant = 'default' }: CardProps) {
  if (blur) {
    return (
      <BlurView intensity={20} style={[styles.container, style]}>
        <View style={[styles.content, variant === 'mystical' && styles.mysticalContent]}>
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[
      styles.container, 
      variant === 'mystical' ? globalStyles.mysticalCard : globalStyles.card,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  mysticalContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
});
```

### 3. components/shared/GradientBackground.tsx
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../utils/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  gradient?: keyof typeof gradients;
}

export default function GradientBackground({ 
  children, 
  gradient = 'mystical' 
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={gradients[gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## 타이머 화면 구현

### screens/TimerScreen.tsx
```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

import GradientBackground from '../components/shared/GradientBackground';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TarotCardsIcon, ClockIcon, SparklesIcon, ZapIcon, SaveIcon } from '../components/icons';

import { useLanguage } from '../contexts/LanguageContext';
import { generateDailyCards, getCurrentHour, formatHour, formatDate } from '../utils/tarot-data';
import { saveDailyTarot, getTodaysSave } from '../utils/storage';
import { colors } from '../utils/colors';
import { typography, spacing, globalStyles } from '../utils/styles';
import { cardSelectFeedback, cardFlipFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

export default function TimerScreen() {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyCards, setDailyCards] = useState([]);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [hourlyMemos, setHourlyMemos] = useState({});
  const [isDailyTarotSaved, setIsDailyTarotSaved] = useState(false);
  const [showRecordingSection, setShowRecordingSection] = useState(false);

  // 애니메이션 값
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const currentHour = getCurrentHour();

  useEffect(() => {
    // 펄스 애니메이션
    pulseScale.value = withRepeat(
      withTiming(1.02, { duration: 2000 }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true
    );

    // 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // 오늘의 저장된 데이터 확인
    checkTodaysSave();

    return () => clearInterval(timer);
  }, []);

  const checkTodaysSave = async () => {
    const todaysSave = await getTodaysSave();
    if (todaysSave) {
      setDailyCards(todaysSave.hourlyCards);
      setHasDrawnAll24Cards(true);
      setIsDailyTarotSaved(true);
      setShowRecordingSection(true);
      setHourlyMemos(todaysSave.memos || {});
      setSelectedCardIndex(currentHour);
    }
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const currentCard = dailyCards[currentHour] || null;

  const drawAll24Cards = async () => {
    cardFlipFeedback();
    setIsDrawingAll(true);
    
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(currentTime);
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          Alert.alert('오류', '카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        Alert.alert('오류', '카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };

  const handleCardClick = (index) => {
    cardSelectFeedback();
    setSelectedCardIndex(index);
  };

  const handleMemoChange = (value) => {
    const targetHour = selectedCardIndex !== null ? selectedCardIndex : currentHour;
    setHourlyMemos(prev => ({
      ...prev,
      [targetHour]: value
    }));
  };

  const saveDailyTarotReading = async () => {
    if (!hasDrawnAll24Cards || dailyCards.length === 0) return;
    
    const dailyTarotSave = {
      id: Date.now().toString(),
      date: currentTime.toDateString(),
      hourlyCards: dailyCards,
      memos: hourlyMemos,
      insights: Object.values(hourlyMemos).join('\n') || 'Today\'s 24-hour tarot reading',
      savedAt: new Date().toISOString()
    };
    
    const success = await saveDailyTarot(dailyTarotSave);
    if (success) {
      setIsDailyTarotSaved(true);
      Alert.alert('저장 완료', 'Daily tarot reading has been saved to your journal!');
    }
  };

  const selectedCard = selectedCardIndex !== null ? dailyCards[selectedCardIndex] : currentCard;
  const currentMemo = hourlyMemos[selectedCardIndex !== null ? selectedCardIndex : currentHour] || '';

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
              <TarotCardsIcon color={colors.dark.premiumGold} size={56} />
            </Animated.View>
            <Text style={styles.title}>24시간 타로 타이머</Text>
            <Text style={styles.subtitle}>
              {formatDate(currentTime)}
            </Text>
            
            {hasDrawnAll24Cards && currentCard && (
              <View style={styles.timeDisplay}>
                <Text style={styles.timeLabel}>현재 시간</Text>
                <Text style={styles.timeValue}>
                  {formatHour(selectedCardIndex !== null ? selectedCardIndex : currentHour)}
                </Text>
              </View>
            )}
          </View>

          {/* 현재 카드 표시 */}
          {hasDrawnAll24Cards && selectedCard && (
            <Card style={styles.cardSection} variant="mystical">
              <View style={styles.cardContainer}>
                <Image
                  source={{ uri: selectedCard.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardName}>
                    {selectedCard.nameKr}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <View style={styles.keywordsContainer}>
                  {selectedCard.keywordsKr.map((keyword, index) => (
                    <View key={index} style={styles.keywordBadge}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.cardMeaning}>
                  {selectedCard.meaningKr}
                </Text>
              </View>
            </Card>
          )}

          {/* 24시간 카드 뽑기 버튼 */}
          {!hasDrawnAll24Cards && (
            <Card style={styles.drawSection} variant="mystical">
              <View style={styles.drawContent}>
                <ZapIcon color={colors.dark.premiumGold} size={48} />
                <Text style={styles.drawTitle}>운명을 밝혀라</Text>
                <Text style={styles.drawDescription}>
                  우주의 메시지가 당신을 기다립니다
                </Text>
                <Button
                  onPress={drawAll24Cards}
                  disabled={isDrawingAll}
                  loading={isDrawingAll}
                  size="lg"
                  style={styles.drawButton}
                >
                  {isDrawingAll ? '카드를 뽑고 있습니다...' : '운명의 24장 뽑기'}
                </Button>
              </View>
            </Card>
          )}

          {/* 24시간 카드 스크롤 */}
          {hasDrawnAll24Cards && dailyCards.length > 0 && (
            <View style={styles.cardsSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <ClockIcon color={colors.dark.premiumGold} size={20} />
                  <Text style={styles.sectionTitle}>24시간 에너지 흐름</Text>
                </View>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {dailyCards.map((card, index) => (
                  <TouchableOpacity
                    key={`${card.id}-${index}`}
                    style={[
                      styles.hourCard,
                      selectedCardIndex === index && styles.selectedCard
                    ]}
                    onPress={() => handleCardClick(index)}
                  >
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={styles.hourCardImage}
                      resizeMode="cover"
                    />
                    <Text style={[
                      styles.hourText,
                      index === currentHour && styles.currentHourText
                    ]}>
                      {formatHour(index)}
                    </Text>
                    {index === currentHour && (
                      <View style={styles.nowBadge}>
                        <Text style={styles.nowText}>현재</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 메모 섹션 */}
          {showRecordingSection && (
            <Card style={styles.memoSection} variant="mystical">
              <View style={styles.memoHeader}>
                <Text style={styles.memoTitle}>신성한 저널</Text>
                {selectedCardIndex !== null && (
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>
                      {formatHour(selectedCardIndex)}
                    </Text>
                  </View>
                )}
              </View>
              
              <TextInput
                style={styles.memoInput}
                placeholder="이 시간의 느낌과 생각을 기록해보세요..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={currentMemo}
                onChangeText={handleMemoChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.memoFooter}>
                <Text style={styles.characterCount}>
                  {currentMemo.length}/500 자
                </Text>
              </View>
              
              <Button
                onPress={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
                variant={isDailyTarotSaved ? 'secondary' : 'primary'}
                style={styles.saveButton}
              >
                {isDailyTarotSaved ? '저장됨' : '리딩 저장하기'}
              </Button>
            </Card>
          )}

          {/* 하단 여백 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: 100, // 탭바 공간
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.dark.premiumGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeValue: {
    ...typography.displayMedium,
    color: colors.dark.foreground,
    marginTop: spacing.xs,
  },
  cardSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.dark.premiumGold,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.md,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardName: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    textAlign: 'center',
  },
  cardDetails: {
    alignItems: 'center',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  keywordBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  keywordText: {
    ...typography.caption,
    color: colors.dark.premiumGold,
  },
  cardMeaning: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  drawSection: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
  },
  drawContent: {
    alignItems: 'center',
  },
  drawTitle: {
    ...typography.titleLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  drawDescription: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  drawButton: {
    minWidth: 200,
  },
  cardsSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.sm,
  },
  horizontalScroll: {
    marginHorizontal: -spacing.lg,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  hourCard: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  selectedCard: {
    transform: [{ scale: 1.1 }],
  },
  hourCardImage: {
    width: 64,
    height: 96,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  hourText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  currentHourText: {
    color: colors.dark.premiumGold,
    fontWeight: 'bold',
  },
  nowBadge: {
    backgroundColor: colors.dark.premiumGold,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  nowText: {
    ...typography.caption,
    color: '#000',
    fontSize: 10,
  },
  memoSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  memoTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
  },
  timeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  timeBadgeText: {
    ...typography.caption,
    color: colors.dark.premiumGold,
  },
  memoInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: spacing.md,
    color: colors.dark.foreground,
    ...typography.bodyLarge,
    minHeight: 120,
    marginBottom: spacing.sm,
  },
  memoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  characterCount: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  saveButton: {
    width: '100%',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
```

## 언어 컨텍스트

### contexts/LanguageContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ko: {
    nav: { timer: '타이머', spreads: '스프레드', journal: '저널', settings: '설정' },
    timer: {
      title: '24시간 타로 타이머',
      revealDestiny: '운명을 밝혀라',
      cosmicMessage: '우주의 메시지가 당신을 기다립니다',
      drawCards: '운명의 24장 뽑기',
      drawingCards: '카드를 뽑고 있습니다...',
      energyFlow: '24시간 에너지 흐름',
      sacredJournal: '신성한 저널',
      journalPlaceholder: '이 시간의 느낌과 생각을 기록해보세요...',
      saveReading: '리딩 저장하기',
      saved: '저장됨',
    },
    common: {
      characters: '자',
      save: '저장',
      cancel: '취소',
      loading: '로딩 중...',
    },
  },
  en: {
    nav: { timer: 'Timer', spreads: 'Spreads', journal: 'Journal', settings: 'Settings' },
    timer: {
      title: '24-Hour Tarot Timer',
      revealDestiny: 'Reveal Your Destiny',
      cosmicMessage: 'The cosmic message awaits you',
      drawCards: 'Draw 24 Cards of Fate',
      drawingCards: 'Drawing cards...',
      energyFlow: '24-Hour Energy Flow',
      sacredJournal: 'Sacred Journal',
      journalPlaceholder: 'Record your feelings and thoughts for this hour...',
      saveReading: 'Save Reading',
      saved: 'Saved',
    },
    common: {
      characters: 'characters',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
    },
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('ko');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

## App.tsx 메인 엔트리 포인트

### App.tsx
```typescript
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainNavigator from './src/navigation/MainNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';

// React Navigation 최적화
enableScreens();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <MainNavigator />
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
```

## 배포 설정

### app.json
```json
{
  "expo": {
    "name": "타로 타이머",
    "slug": "tarot-timer",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1f3a"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.mystical.tarot-timer",
      "buildNumber": "1",
      "requireFullScreen": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1f3a"
      },
      "package": "com.mystical.tarottimer",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "PORTRAIT"
        }
      ]
    ]
  }
}
```

이 가이드를 따라 완전한 React Native 타로 타이머 앱을 구현할 수 있습니다. 모든 기능이 네이티브 환경에 최적화되어 있으며, 햅틱 피드백, 부드러운 애니메이션, 그리고 신비로운 UI/UX를 제공합니다.