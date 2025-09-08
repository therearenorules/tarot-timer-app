# React Native 유틸리티 및 헬퍼 함수

## 1. 색상 및 스타일 시스템

### colors.js
```javascript
// src/utils/colors.js
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

### styles.js
```javascript
// src/utils/styles.js
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
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 38,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 34,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 31,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: '500', android: '500' }),
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
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

## 2. 데이터 저장소 (AsyncStorage)

### storage.js
```javascript
// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DAILY_TAROT_SAVES: 'dailyTarotSaves',
  SAVED_SPREADS: 'savedSpreads',
  USER_SETTINGS: 'userSettings',
  LANGUAGE: 'language',
};

// Daily Tarot 관련
export const saveDailyTarot = async (dailyTarotSave) => {
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

export const getDailyTarotSaves = async () => {
  try {
    const saves = await AsyncStorage.getItem(KEYS.DAILY_TAROT_SAVES);
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Error loading daily tarot saves:', error);
    return [];
  }
};

export const getTodaysSave = async () => {
  try {
    const saves = await getDailyTarotSaves();
    const today = new Date().toDateString();
    return saves.find(save => save.date === today) || null;
  } catch (error) {
    console.error('Error getting today\'s save:', error);
    return null;
  }
};

export const deleteDailyTarotSave = async (saveId) => {
  try {
    const saves = await getDailyTarotSaves();
    const filteredSaves = saves.filter(save => save.id !== saveId);
    await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(filteredSaves));
    return true;
  } catch (error) {
    console.error('Error deleting daily tarot save:', error);
    return false;
  }
};

// Spread 관련
export const saveSpread = async (spreadData) => {
  try {
    const existingSpreads = await getSavedSpreads();
    const updatedSpreads = [...existingSpreads, spreadData];
    await AsyncStorage.setItem(KEYS.SAVED_SPREADS, JSON.stringify(updatedSpreads));
    return true;
  } catch (error) {
    console.error('Error saving spread:', error);
    return false;
  }
};

export const getSavedSpreads = async () => {
  try {
    const spreads = await AsyncStorage.getItem(KEYS.SAVED_SPREADS);
    return spreads ? JSON.parse(spreads) : [];
  } catch (error) {
    console.error('Error loading saved spreads:', error);
    return [];
  }
};

// 설정 관련
export const saveUserSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

export const getUserSettings = async () => {
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
  textSize: false,
  highContrast: false,
  voiceReading: false,
  meditationTimer: false,
});

// 언어 설정
export const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error('Error saving language:', error);
    return false;
  }
};

export const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language || 'ko';
  } catch (error) {
    console.error('Error loading language:', error);
    return 'ko';
  }
};

// 데이터 export/import
export const exportAllData = async () => {
  try {
    const dailyTarotSaves = await getDailyTarotSaves();
    const savedSpreads = await getSavedSpreads();
    const userSettings = await getUserSettings();
    const language = await getLanguage();

    return {
      dailyTarotSaves,
      savedSpreads,
      userSettings,
      language,
      exportDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importAllData = async (data) => {
  try {
    if (data.dailyTarotSaves) {
      await AsyncStorage.setItem(KEYS.DAILY_TAROT_SAVES, JSON.stringify(data.dailyTarotSaves));
    }
    if (data.savedSpreads) {
      await AsyncStorage.setItem(KEYS.SAVED_SPREADS, JSON.stringify(data.savedSpreads));
    }
    if (data.userSettings) {
      await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(data.userSettings));
    }
    if (data.language) {
      await AsyncStorage.setItem(KEYS.LANGUAGE, data.language);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// 전체 데이터 삭제
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
```

## 3. 언어 컨텍스트 (React Native 버전)

### LanguageContext.js
```javascript
// src/contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLanguage, saveLanguage } from '../utils/storage';

const LanguageContext = createContext();

const translations = {
  ko: {
    // 네비게이션
    nav: {
      timer: '타이머',
      spreads: '스프레드',
      journal: '저널',
      settings: '설정',
    },
    // 타이머
    timer: {
      title: '24시간 타로 타이머',
      revealDestiny: '운명을 밝혀라',
      cosmicMessage: '우주의 메시지가 당신을 기다립니다',
      drawCards: '운명의 24장 뽑기',
      drawingCards: '카드를 뽑고 있습니다...',
      energyFlow: '24시간 에너지 흐름',
      redraw: '다시 뽑기',
      reshuffling: '다시 섞는 중...',
      now: '현재',
      currentHour: '현재 시간',
      sacredJournal: '신성한 저널',
      journalPlaceholder: '이 시간의 느낌과 생각을 기록해보세요...',
      saveReading: '리딩 저장하기',
      saved: '저장됨',
      quote: '"시간은 흐르지만, 각 순간은 영원한 지혜를 담고 있다."',
    },
    // 스프레드
    spreads: {
      title: '신비한 스프레드',
      subtitle: '운명의 카드 배치법을 선택하세요',
      beginReading: '리딩 시작하기',
      premium: '프리미엄',
      premiumTitle: '프리미엄 스프레드',
      premiumDesc: '더 깊은 통찰을 위한 고급 스프레드들',
      premiumActive: '활성화됨',
      quote: '"각각의 스프레드는 다른 차원의 문을 열어준다."',
    },
    // 저널
    journal: {
      title: '신성한 저널',
      subtitle: '당신의 타로 여정을 기록하고 돌아보세요',
      dailyTarot: '일일 타로',
      spreadRecords: '스프레드 기록',
      dailyReadings: '일일 리딩',
      records: '개 기록',
      noReadings: '아직 저장된 리딩이 없습니다',
      noReadingsDesc: '타이머에서 24시간 타로를 뽑고 저장해보세요',
      saved: '저장됨',
      view: '보기',
      noSpreads: '저장된 스프레드가 없습니다',
      noSpreadsDesc: '스프레드 섹션에서 리딩을 해보세요',
      quote: '"기록된 지혜는 미래의 나침반이 된다."',
    },
    // 설정
    settings: {
      title: '설정',
      subtitle: '앱을 당신만의 방식으로 설정하세요',
      premium: '프리미엄 멤버십',
      active: '활성화',
      premiumSpreads: '프리미엄 스프레드 이용',
      adFree: '광고 없는 환경',
      unlimitedStorage: '무제한 저장 공간',
      managePremium: '프리미엄 관리',
      displayTheme: '화면 & 테마',
      darkMode: '다크 모드',
      language: '언어',
      korean: '한국어',
      english: 'English',
      notifications: '알림',
      spreadCompletion: '스프레드 완료 알림',
      spreadCompletionDesc: '스프레드 리딩 완료 시 알림',
      soundHaptics: '사운드 & 진동',
      soundEffects: '효과음',
      hapticFeedback: '햅틱 피드백',
      hapticFeedbackDesc: '터치 시 진동 피드백',
      privacySecurity: '개인정보 & 보안',
      privacyPolicy: '개인정보 처리방침',
      dataManagement: '데이터 관리',
      support: '지원',
      helpFaq: '도움말 & FAQ',
      supportDev: '개발자 지원',
      version: 'Version 1.0.0',
      copyright: '© 2024 Tarot Timer. All rights reserved.',
      quote: '"설정의 조화가 완벽한 경험을 만든다."',
    },
    // 공통
    common: {
      characters: '자',
      save: '저장',
      cancel: '취소',
      confirm: '확인',
      back: '뒤로',
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
    },
  },
  en: {
    // 네비게이션
    nav: {
      timer: 'Timer',
      spreads: 'Spreads',
      journal: 'Journal',
      settings: 'Settings',
    },
    // 타이머
    timer: {
      title: '24-Hour Tarot Timer',
      revealDestiny: 'Reveal Your Destiny',
      cosmicMessage: 'The cosmic message awaits you',
      drawCards: 'Draw 24 Cards of Fate',
      drawingCards: 'Drawing cards...',
      energyFlow: '24-Hour Energy Flow',
      redraw: 'Redraw',
      reshuffling: 'Reshuffling...',
      now: 'Now',
      currentHour: 'Current Hour',
      sacredJournal: 'Sacred Journal',
      journalPlaceholder: 'Record your feelings and thoughts for this hour...',
      saveReading: 'Save Reading',
      saved: 'Saved',
      quote: '"Time flows, but each moment holds eternal wisdom."',
    },
    // 스프레드
    spreads: {
      title: 'Mystical Spreads',
      subtitle: 'Choose your card layout method',
      beginReading: 'Begin Reading',
      premium: 'Premium',
      premiumTitle: 'Premium Spreads',
      premiumDesc: 'Advanced spreads for deeper insights',
      premiumActive: 'Active',
      quote: '"Each spread opens a door to a different dimension."',
    },
    // 저널
    journal: {
      title: 'Sacred Journal',
      subtitle: 'Record and reflect on your tarot journey',
      dailyTarot: 'Daily Tarot',
      spreadRecords: 'Spread Records',
      dailyReadings: 'Daily Readings',
      records: 'records',
      noReadings: 'No saved readings yet',
      noReadingsDesc: 'Draw and save 24-hour tarot from Timer',
      saved: 'Saved',
      view: 'View',
      noSpreads: 'No saved spreads',
      noSpreadsDesc: 'Try doing readings in the Spreads section',
      quote: '"Recorded wisdom becomes a compass for the future."',
    },
    // 설정
    settings: {
      title: 'Settings',
      subtitle: 'Customize the app to your liking',
      premium: 'Premium Membership',
      active: 'Active',
      premiumSpreads: 'Premium Spreads Access',
      adFree: 'Ad-free Experience',
      unlimitedStorage: 'Unlimited Storage',
      managePremium: 'Manage Premium',
      displayTheme: 'Display & Theme',
      darkMode: 'Dark Mode',
      language: 'Language',
      korean: '한국어',
      english: 'English',
      notifications: 'Notifications',
      spreadCompletion: 'Spread Completion Alerts',
      spreadCompletionDesc: 'Notify when spread reading completes',
      soundHaptics: 'Sound & Haptics',
      soundEffects: 'Sound Effects',
      hapticFeedback: 'Haptic Feedback',
      hapticFeedbackDesc: 'Vibration feedback on touch',
      privacySecurity: 'Privacy & Security',
      privacyPolicy: 'Privacy Policy',
      dataManagement: 'Data Management',
      support: 'Support',
      helpFaq: 'Help & FAQ',
      supportDev: 'Support Developer',
      version: 'Version 1.0.0',
      copyright: '© 2024 Tarot Timer. All rights reserved.',
      quote: '"Harmony in settings creates the perfect experience."',
    },
    // 공통
    common: {
      characters: 'characters',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('ko');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await getLanguage();
        setLanguageState(savedLanguage);
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (newLanguage) => {
    try {
      await saveLanguage(newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const value = {
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

## 4. 햅틱 및 사운드 유틸리티

### haptics.js
```javascript
// src/utils/haptics.js
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
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  heavy: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  
  success: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  warning: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  
  error: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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

// 사용 예시
export const cardSelectFeedback = () => HapticFeedback.light();
export const cardFlipFeedback = () => HapticFeedback.medium();
export const spreadCompleteFeedback = () => HapticFeedback.success();
export const buttonPressFeedback = () => HapticFeedback.selection();
```

### audio.js
```javascript
// src/utils/audio.js
import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
  }

  async loadSound(name, file) {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      this.sounds[name] = sound;
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
    }
  }

  async playSound(name, volume = 1.0) {
    if (!this.isEnabled || !this.sounds[name]) return;
    
    try {
      await this.sounds[name].setVolumeAsync(volume);
      await this.sounds[name].replayAsync();
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  async unloadAll() {
    for (const sound of Object.values(this.sounds)) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    }
    this.sounds = {};
  }
}

export const audioManager = new AudioManager();

// 초기화 함수
export const initializeAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // 사운드 파일들 로드
    await audioManager.loadSound('cardFlip', require('../assets/sounds/card-flip.mp3'));
    await audioManager.loadSound('cardShuffle', require('../assets/sounds/card-shuffle.mp3'));
    await audioManager.loadSound('mysticalChime', require('../assets/sounds/mystical-chime.mp3'));
    await audioManager.loadSound('success', require('../assets/sounds/success.mp3'));
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

// 편의 함수들
export const playCardFlip = () => audioManager.playSound('cardFlip', 0.7);
export const playCardShuffle = () => audioManager.playSound('cardShuffle', 0.5);
export const playMysticalChime = () => audioManager.playSound('mysticalChime', 0.6);
export const playSuccess = () => audioManager.playSound('success', 0.8);

export const setSoundEnabled = (enabled) => audioManager.setEnabled(enabled);
```

## 5. 디바이스 정보 및 반응형 유틸리티

### device.js
```javascript
// src/utils/device.js
import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');
const screenData = Dimensions.get('screen');

export const deviceInfo = {
  screenWidth: width,
  screenHeight: height,
  screenData,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  platformVersion: Platform.Version,
};

// 화면 크기 분류
export const getScreenSize = () => {
  if (width < 375) return 'small';
  if (width < 414) return 'medium';
  if (width < 768) return 'large';
  return 'xlarge';
};

// Safe Area 계산
export const getSafeAreaInsets = () => {
  if (Platform.OS === 'ios') {
    // iOS에서는 react-native-safe-area-context 사용 권장
    return {
      top: StatusBar.currentHeight || 44,
      bottom: 34, // iPhone X 이후
      left: 0,
      right: 0,
    };
  } else {
    return {
      top: StatusBar.currentHeight || 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
};

// 디바이스별 폰트 크기 조정
export const getFontSize = (baseSize) => {
  const screenSize = getScreenSize();
  const multipliers = {
    small: 0.9,
    medium: 1.0,
    large: 1.1,
    xlarge: 1.2,
  };
  return baseSize * multipliers[screenSize];
};

// 디바이스별 간격 조정
export const getSpacing = (baseSpacing) => {
  const screenSize = getScreenSize();
  const multipliers = {
    small: 0.8,
    medium: 1.0,
    large: 1.1,
    xlarge: 1.2,
  };
  return baseSpacing * multipliers[screenSize];
};

// 카드 크기 계산
export const getCardDimensions = () => {
  const cardWidth = Math.min(width * 0.7, 280);
  const cardHeight = cardWidth * 1.5;
  return { width: cardWidth, height: cardHeight };
};

// 시간당 카드 크기 계산
export const getHourlyCardDimensions = () => {
  const screenSize = getScreenSize();
  const baseSizes = {
    small: { width: 50, height: 75 },
    medium: { width: 64, height: 96 },
    large: { width: 70, height: 105 },
    xlarge: { width: 80, height: 120 },
  };
  return baseSizes[screenSize];
};

// 탭바 높이 계산
export const getTabBarHeight = () => {
  const safeArea = getSafeAreaInsets();
  return Platform.OS === 'ios' ? 80 + safeArea.bottom : 60;
};

// 네비게이션 헤더 높이
export const getHeaderHeight = () => {
  return Platform.OS === 'ios' ? 44 : 56;
};
```

이러한 유틸리티들을 사용하여 React Native 앱의 기반을 구축할 수 있습니다. 각각의 유틸리티는 독립적으로 사용 가능하며, 웹 버전의 기능들을 React Native 환경에 맞게 최적화했습니다.