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
    nav: { timer: 'Timer', spreads: 'Spreads', journal: 'Journal', settings: 'Settings' },
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