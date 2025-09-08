# React Native 변환 가이드

## 1. 프로젝트 구조 및 의존성

### 필수 패키지 설치
```bash
# React Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs
expo install react-native-screens react-native-safe-area-context

# 그라데이션 및 시각 효과
expo install expo-linear-gradient expo-blur

# 애니메이션
expo install react-native-reanimated react-native-gesture-handler

# 기타 유틸리티
expo install expo-font expo-status-bar expo-haptics expo-av
```

### package.json 의존성
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "expo-linear-gradient": "^12.x",
    "expo-blur": "^12.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-screens": "^3.x",
    "react-native-safe-area-context": "^4.x",
    "expo-font": "^11.x",
    "expo-status-bar": "^1.x",
    "expo-haptics": "^12.x"
  }
}
```

## 2. 컴포넌트 매핑

### HTML → React Native 변환
```jsx
// 기존 웹 컴포넌트
<div className="container">
  <h1 className="title">타이틀</h1>
  <p className="text">텍스트</p>
  <button onClick={handlePress}>버튼</button>
  <input value={text} onChange={handleChange} />
  <img src={imageUrl} alt="image" />
</div>

// React Native 변환
<View style={styles.container}>
  <Text style={styles.title}>타이틀</Text>
  <Text style={styles.text}>텍스트</Text>
  <TouchableOpacity onPress={handlePress}>
    <Text>버튼</Text>
  </TouchableOpacity>
  <TextInput value={text} onChangeText={handleChange} />
  <Image source={{ uri: imageUrl }} style={styles.image} />
</View>
```

### 주요 import 변경
```jsx
// React Native imports
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
```

## 3. 스타일링 시스템 변환

### Tailwind CSS → StyleSheet 변환
```jsx
// 기존 Tailwind 스타일
className="min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue"

// React Native StyleSheet 변환
const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height,
    flex: 1,
  }
});

// LinearGradient 컴포넌트 사용
<LinearGradient
  colors={['#1a1f3a', '#4a1a4f', '#1a1f3a']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>
```

### 색상 토큰 시스템
```jsx
// colors.js
export const colors = {
  // Light Mode
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
  // Dark Mode
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

### 주요 스타일 변환 예시
```jsx
const styles = StyleSheet.create({
  // 카드 스타일
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8, // Android shadow
  },
  
  // 텍스트 스타일
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // 버튼 스타일
  button: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // 그라데이션 텍스트 (별도 컴포넌트 필요)
  gradientText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
```

## 4. 네비게이션 시스템

### App.js 메인 네비게이션 구조
```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      }}
    >
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClockIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Spreads" 
        component={SpreadsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LayoutIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookOpenIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="SpreadDetail" component={SpreadDetailScreen} />
        <Stack.Screen name="DailyTarotViewer" component={DailyTarotViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 5. 화면별 변환 가이드

### Timer.js 변환
```jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function TimerScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyMemos, setHourlyMemos] = useState({});
  // ... 기타 state

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1a1f3a" />
      
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
          {/* 헤더 섹션 */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <TarotCardsIcon color="#d4af37" size={56} />
            </View>
            <Text style={styles.title}>24시간 타로 타이머</Text>
            <Text style={styles.subtitle}>
              {formatDate(currentTime)}
            </Text>
          </View>

          {/* 현재 카드 표시 */}
          {hasDrawnAll24Cards && selectedCard && (
            <View style={styles.cardSection}>
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
            </View>
          )}

          {/* 24시간 카드 뽑기 버튼 */}
          {!hasDrawnAll24Cards && (
            <TouchableOpacity
              style={styles.drawButton}
              onPress={drawAll24Cards}
              disabled={isDrawingAll}
            >
              <LinearGradient
                colors={['#d4af37', '#f4d03f']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  운명의 24장 뽑기
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* 가로 스크롤 카드들 */}
          {hasDrawnAll24Cards && (
            <View style={styles.cardsSection}>
              <Text style={styles.sectionTitle}>24시간 에너지 흐름</Text>
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
                    <Text style={styles.hourText}>
                      {formatHour(index)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 메모 섹션 */}
          {showRecordingSection && (
            <View style={styles.memoSection}>
              <Text style={styles.sectionTitle}>신성한 저널</Text>
              <TextInput
                style={styles.memoInput}
                placeholder="메모를 입력하세요"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={currentMemo}
                onChangeText={handleMemoChange}
                multiline
                numberOfLines={4}
              />
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
              >
                <Text style={styles.saveButtonText}>
                  {isDailyTarotSaved ? '저장됨' : '리딩 저장하기'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 100, // 탭바 공간
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
  cardSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cardContainer: {
    width: 256,
    height: 384,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  cardName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  drawButton: {
    marginBottom: 32,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  cardsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -24,
  },
  horizontalScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  hourCard: {
    alignItems: 'center',
    marginRight: 12,
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
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  memoSection: {
    marginBottom: 32,
  },
  memoInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## 6. 특수 효과 구현

### 그라데이션 텍스트 컴포넌트
```jsx
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const GradientText = ({ children, style, colors = ['#d4af37', '#ffffff', '#d4af37'] }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};
```

### BlurView 백드롭 효과
```jsx
import { BlurView } from 'expo-blur';

const BlurCard = ({ children }) => (
  <BlurView intensity={20} style={styles.blurContainer}>
    <View style={styles.cardContent}>
      {children}
    </View>
  </BlurView>
);

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardContent: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
```

## 7. 애니메이션 구현

### Reanimated 사용 예시
```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const MysticalPulse = ({ children }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};
```

## 8. 아이콘 시스템 변환

### SVG 아이콘을 React Native 컴포넌트로
```jsx
import Svg, { Path, Circle } from 'react-native-svg';

export const ClockIcon = ({ color = '#d4af37', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" />
  </Svg>
);

export const TarotCardsIcon = ({ color = '#d4af37', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* SVG path content */}
  </Svg>
);
```

## 9. 상태 관리 및 데이터 저장

### AsyncStorage 사용
```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// 데이터 저장
const saveDailyTarot = async (dailyTarotSave) => {
  try {
    const existingSaves = await AsyncStorage.getItem('dailyTarotSaves');
    const saves = existingSaves ? JSON.parse(existingSaves) : [];
    saves.push(dailyTarotSave);
    await AsyncStorage.setItem('dailyTarotSaves', JSON.stringify(saves));
  } catch (error) {
    console.error('Error saving daily tarot:', error);
  }
};

// 데이터 불러오기
const loadDailyTarotSaves = async () => {
  try {
    const saves = await AsyncStorage.getItem('dailyTarotSaves');
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Error loading daily tarot saves:', error);
    return [];
  }
};
```

## 10. 성능 최적화

### 이미지 캐싱 및 최적화
```jsx
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ source, style, ...props }) => (
  <FastImage
    source={{
      uri: source,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    style={style}
    resizeMode={FastImage.resizeMode.cover}
    {...props}
  />
);
```

### FlatList 사용으로 성능 향상
```jsx
import { FlatList } from 'react-native';

const CardList = ({ cards, onCardPress }) => {
  const renderCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => onCardPress(item, index)}
    >
      <OptimizedImage source={item.imageUrl} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={cards}
      renderItem={renderCard}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
    />
  );
};
```

## 11. 폰트 및 타이포그래피

### 커스텀 폰트 로딩
```jsx
import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    'SF-Pro-Display-Regular': require('./assets/fonts/SF-Pro-Display-Regular.otf'),
    'SF-Pro-Display-Medium': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
    'SF-Pro-Display-Semibold': require('./assets/fonts/SF-Pro-Display-Semibold.otf'),
  });
};

// 사용
const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({
      ios: 'SF-Pro-Display-Regular',
      android: 'Roboto-Regular',
    }),
    fontSize: 16,
    lineHeight: 24,
  },
});
```

## 12. 햅틱 피드백 및 오디오

### 햅틱 피드백
```jsx
import * as Haptics from 'expo-haptics';

const handleCardPress = async () => {
  // 햅틱 피드백
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
  // 카드 선택 로직
  setSelectedCard(card);
};
```

### 사운드 효과
```jsx
import { Audio } from 'expo-av';

const playCardSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('./assets/sounds/card-flip.mp3')
  );
  await sound.playAsync();
};
```

## 13. 테스트 및 디버깅

### React Native Debugger 설정
```jsx
import { enableScreens } from 'react-native-screens';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

enableScreens();

// Flipper 연동
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
```

## 14. 배포 준비

### app.json 설정
```json
{
  "expo": {
    "name": "타로 타이머",
    "slug": "tarot-timer",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1f3a"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.tarottimer"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1f3a"
      },
      "package": "com.yourcompany.tarottimer"
    }
  }
}
```

이 가이드를 따라 단계별로 웹 앱을 React Native로 변환할 수 있습니다. 각 섹션은 독립적으로 작업할 수 있도록 구성되어 있어 점진적인 마이그레이션이 가능합니다.