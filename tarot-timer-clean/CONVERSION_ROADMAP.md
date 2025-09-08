# React Native 변환 로드맵

## 변환 우선순위 및 단계

### Phase 1: 기본 구조 설정 (1-2일)
1. **프로젝트 초기화**
   ```bash
   npx create-expo-app TarotTimer --template
   cd TarotTimer
   npm install
   ```

2. **기본 의존성 설치**
   ```bash
   npm install @react-navigation/native @react-navigation/bottom-tabs
   expo install react-native-screens react-native-safe-area-context
   expo install expo-linear-gradient expo-blur react-native-reanimated
   ```

3. **폴더 구조 생성**
   ```
   src/
   ├── components/
   │   ├── ui/
   │   ├── icons/
   │   └── shared/
   ├── screens/
   │   ├── TimerScreen.js
   │   ├── SpreadsScreen.js
   │   ├── JournalScreen.js
   │   └── SettingsScreen.js
   ├── utils/
   │   ├── colors.js
   │   ├── styles.js
   │   ├── tarot-data.js
   │   └── storage.js
   ├── contexts/
   │   └── LanguageContext.js
   └── assets/
       ├── fonts/
       ├── images/
       └── sounds/
   ```

### Phase 2: 핵심 컴포넌트 변환 (3-4일)

1. **기본 UI 컴포넌트 생성**
   - Button.js
   - Card.js
   - Badge.js
   - Input.js

2. **아이콘 시스템 변환**
   - SVG 아이콘을 React Native 컴포넌트로 변환
   - 색상 및 크기 props 지원

3. **스타일 시스템 구축**
   - 색상 토큰 시스템
   - 타이포그래피 스타일
   - 공통 스타일 유틸리티

### Phase 3: 화면별 구현 (5-7일)

1. **TimerScreen 구현**
   - 24시간 카드 표시
   - 가로 스크롤 카드 리스트
   - 메모 입력 기능

2. **SpreadsScreen 구현**
   - 스프레드 목록
   - 카드 애니메이션

3. **JournalScreen 구현**
   - 저장된 리딩 목록
   - 필터링 기능

4. **SettingsScreen 구현**
   - 설정 옵션들
   - 언어 변경

### Phase 4: 고급 기능 (3-4일)

1. **애니메이션 구현**
   - 카드 뒤집기 애니메이션
   - 신비로운 펄스 효과
   - 페이지 전환 애니메이션

2. **데이터 저장소**
   - AsyncStorage 연동
   - 데이터 백업/복원

3. **성능 최적화**
   - 이미지 최적화
   - 메모리 관리

## 주요 변환 파일 맵핑

### 1. App.tsx → App.js + Navigation
```jsx
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from './src/contexts/LanguageContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1a1f3a" />
        <MainNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}
```

### 2. 네비게이션 구조
```jsx
// src/navigation/MainNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';

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
          height: 80,
        },
      }}
    >
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="clock" focused={focused} color={color} />
          ),
        }}
      />
      {/* 다른 탭들... */}
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="SpreadDetail" component={SpreadDetailScreen} />
    </Stack.Navigator>
  );
}
```

### 3. 타이머 화면 변환
```jsx
// src/screens/TimerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

import { useLanguage } from '../contexts/LanguageContext';
import { generateDailyCards, getCurrentHour } from '../utils/tarot-data';
import { saveDailyTarot } from '../utils/storage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TarotCardsIcon from '../components/icons/TarotCardsIcon';
import HourlyCardScroll from '../components/timer/HourlyCardScroll';
import MemoSection from '../components/timer/MemoSection';

const { width } = Dimensions.get('window');

export default function TimerScreen() {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyCards, setDailyCards] = useState([]);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [hourlyMemos, setHourlyMemos] = useState({});

  // 애니메이션 값
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

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

    return () => clearInterval(timer);
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const currentHour = getCurrentHour();
  const currentCard = dailyCards[currentHour] || null;

  const drawAll24Cards = async () => {
    setIsDrawingAll(true);
    
    // 카드 생성 애니메이션 시뮬레이션
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(currentTime);
        setDailyCards(newDailyCards);
        setHasDrawnAll24Cards(true);
        setSelectedCardIndex(currentHour);
      } catch (error) {
        Alert.alert('오류', '카드를 생성하는데 문제가 발생했습니다.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };

  const handleCardClick = (index) => {
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
    
    await saveDailyTarot(dailyTarotSave);
    Alert.alert('저장 완료', 'Daily tarot reading has been saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1f3a', '#4a1a4f', '#1a1f3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
              <TarotCardsIcon color="#d4af37" size={56} />
            </Animated.View>
            <Text style={styles.title}>{t('timer.title')}</Text>
            <Text style={styles.subtitle}>
              {currentTime.toLocaleDateString('ko-KR')}
            </Text>
          </View>

          {/* 현재 카드 표시 */}
          {hasDrawnAll24Cards && currentCard && (
            <Card style={styles.currentCardContainer}>
              {/* 카드 이미지 및 정보 */}
            </Card>
          )}

          {/* 24시간 카드 뽑기 버튼 */}
          {!hasDrawnAll24Cards && (
            <Card style={styles.drawCardContainer}>
              <View style={styles.drawCardContent}>
                <Text style={styles.drawCardTitle}>
                  {t('timer.revealDestiny')}
                </Text>
                <Text style={styles.drawCardDesc}>
                  {t('timer.cosmicMessage')}
                </Text>
                <Button
                  onPress={drawAll24Cards}
                  disabled={isDrawingAll}
                  loading={isDrawingAll}
                  style={styles.drawButton}
                >
                  {isDrawingAll ? t('timer.drawingCards') : t('timer.drawCards')}
                </Button>
              </View>
            </Card>
          )}

          {/* 24시간 카드 스크롤 */}
          {hasDrawnAll24Cards && (
            <HourlyCardScroll
              cards={dailyCards}
              selectedIndex={selectedCardIndex}
              currentHour={currentHour}
              onCardPress={handleCardClick}
            />
          )}

          {/* 메모 섹션 */}
          {hasDrawnAll24Cards && (
            <MemoSection
              memo={hourlyMemos[selectedCardIndex || currentHour] || ''}
              onMemoChange={handleMemoChange}
              onSave={saveDailyTarotReading}
            />
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  currentCardContainer: {
    marginBottom: 32,
  },
  drawCardContainer: {
    marginBottom: 32,
  },
  drawCardContent: {
    alignItems: 'center',
    padding: 24,
  },
  drawCardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  drawCardDesc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  drawButton: {
    minWidth: 200,
  },
});
```

### 4. 공통 UI 컴포넌트
```jsx
// src/components/ui/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function Card({ children, style, blur = false, ...props }) {
  if (blur) {
    return (
      <BlurView intensity={20} style={[styles.container, style]} {...props}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.solid, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  solid: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
```

```jsx
// src/components/ui/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Button({ 
  children, 
  onPress, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  style, 
  textStyle,
  ...props 
}) {
  const ButtonComponent = variant === 'primary' ? LinearGradient : TouchableOpacity;
  const buttonProps = variant === 'primary' 
    ? { colors: ['#d4af37', '#f4d03f'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, disabled && styles.disabled, style]}
      activeOpacity={0.8}
      {...props}
    >
      <ButtonComponent {...buttonProps} style={styles.gradient}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#000' : '#fff'} />
        ) : (
          <Text style={[
            styles.text, 
            variant === 'primary' ? styles.primaryText : styles.secondaryText,
            textStyle
          ]}>
            {children}
          </Text>
        )}
      </ButtonComponent>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: '#ffffff',
  },
  disabled: {
    opacity: 0.5,
  },
});
```

## 테스트 전략

### 1. 화면별 테스트
- TimerScreen: 카드 생성, 메모 저장, 시간 업데이트
- SpreadsScreen: 스프레드 선택, 네비게이션
- JournalScreen: 저장된 데이터 로드, 필터링
- SettingsScreen: 설정 변경, 언어 전환

### 2. 성능 테스트
- 이미지 로딩 속도
- 스크롤 성능
- 메모리 사용량
- 배터리 소모

### 3. 디바이스 호환성
- iOS: iPhone SE, iPhone 14, iPad
- Android: 다양한 화면 크기, API 레벨

## 배포 체크리스트

### iOS
- [ ] App Store Connect 설정
- [ ] 아이콘 및 스플래시 이미지
- [ ] 프라이버시 정책
- [ ] TestFlight 베타 테스트

### Android
- [ ] Google Play Console 설정
- [ ] APK/AAB 빌드
- [ ] 권한 설정
- [ ] 내부 테스트

이 로드맵을 따라 단계별로 진행하면 효율적으로 React Native 앱으로 변환할 수 있습니다.