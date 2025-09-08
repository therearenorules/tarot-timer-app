import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    // Timer
    'timer.title': '24시간 타로',
    'timer.subtitle': '매 시간마다 새로운 카드가 공개됩니다',
    'timer.currentHour': '현재 시간',
    'timer.nextReveal': '다음 공개까지',
    'timer.saveReading': '읽기 저장',
    'timer.memo': '메모',
    'timer.insights': '오늘의 인사이트',
    'timer.saveMemo': '메모 저장',
    'timer.saved': '저장됨',
    'timer.loading': '우주 에너지 로딩 중...',
    
    // Spreads
    'spreads.title': '타로 스프레드',
    'spreads.subtitle': '신비로운 스프레드를 경험해보세요',
    'spreads.premium': '프리미엄',
    'spreads.premiumTitle': '프리미엄 기능 활성화',
    'spreads.premiumDesc': '모든 프리미엄 스프레드와 고급 기능을 사용하세요',
    'spreads.premiumActive': '활성화됨',
    'spreads.beginReading': '리딩 시작',
    'spreads.cards': '카드',
    'spreads.quote': '"카드는 당신의 내면 지혜로 가는 창문입니다. 여정을 믿으세요."',
    
    // Journal
    'journal.title': '타로 저널',
    'journal.subtitle': '당신의 신비로운 여정을 기록하세요',
    'journal.dailyTarot': '일일 타로',
    'journal.spreadRecords': '스프레드 기록',
    'journal.dailyReadings': '일일 리딩',
    'journal.records': '기록',
    'journal.noReadings': '저장된 리딩이 없습니다',
    'journal.noReadingsDesc': '타이머 탭에서 24시간 타로를 시작해보세요',
    'journal.noSpreads': '저장된 스프레드가 없습니다',
    'journal.noSpreadsDesc': '스프레드 탭에서 리딩을 시작해보세요',
    'journal.view': '보기',
    'journal.saved': '저장됨',
    'journal.quote': '"기록된 지혜는 영혼의 보물입니다."',
    
    // Settings
    'settings.title': '설정',
    'settings.subtitle': '앱 환경을 맞춤 설정하세요',
    'settings.premium': '프리미엄',
    'settings.active': '활성화됨',
    'settings.premiumSpreads': '프리미엄 스프레드',
    'settings.adFree': '광고 없음',
    'settings.unlimitedStorage': '무제한 저장공간',
    'settings.managePremium': '프리미엄 관리',
    'settings.displayTheme': '화면 & 테마',
    'settings.darkMode': '다크 모드',
    'settings.language': '언어',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.notifications': '알림',
    'settings.spreadCompletion': '스프레드 완료',
    'settings.spreadCompletionDesc': '스프레드 완료 시 알림 받기',
    'settings.soundHaptics': '사운드 & 햅틱',
    'settings.soundEffects': '사운드 효과',
    'settings.hapticFeedback': '햅틱 피드백',
    'settings.hapticFeedbackDesc': '터치 시 진동 피드백',
    'settings.privacySecurity': '프라이버시 & 보안',
    'settings.privacyPolicy': '개인정보 처리방침',
    'settings.dataManagement': '데이터 관리',
    'settings.support': '지원',
    'settings.helpFaq': '도움말 & FAQ',
    'settings.supportDev': '개발자 지원',
    'settings.version': '타로 타이머 v1.0.0',
    'settings.copyright': '© 2024 Mystical Apps. All rights reserved.',
    'settings.quote': '"지혜는 설정에서 시작됩니다."',
    'settings.on': '켜기',
    'settings.off': '끄기',
  },
  en: {
    // Timer
    'timer.title': '24-Hour Tarot',
    'timer.subtitle': 'New cards are revealed every hour',
    'timer.currentHour': 'Current Hour',
    'timer.nextReveal': 'Next Reveal In',
    'timer.saveReading': 'Save Reading',
    'timer.memo': 'Memo',
    'timer.insights': "Today's Insights",
    'timer.saveMemo': 'Save Memo',
    'timer.saved': 'Saved',
    'timer.loading': 'Loading cosmic energy...',
    
    // Spreads
    'spreads.title': 'Tarot Spreads',
    'spreads.subtitle': 'Experience mystical spreads',
    'spreads.premium': 'Premium',
    'spreads.premiumTitle': 'Premium Features Active',
    'spreads.premiumDesc': 'Access all premium spreads and advanced features',
    'spreads.premiumActive': 'Active',
    'spreads.beginReading': 'Begin Reading',
    'spreads.cards': 'cards',
    'spreads.quote': '"The cards are a window to your inner wisdom. Trust the journey."',
    
    // Journal
    'journal.title': 'Tarot Journal',
    'journal.subtitle': 'Record your mystical journey',
    'journal.dailyTarot': 'Daily Tarot',
    'journal.spreadRecords': 'Spread Records',
    'journal.dailyReadings': 'Daily Readings',
    'journal.records': 'records',
    'journal.noReadings': 'No saved readings',
    'journal.noReadingsDesc': 'Start your 24-hour tarot in the Timer tab',
    'journal.noSpreads': 'No saved spreads',
    'journal.noSpreadsDesc': 'Start a reading in the Spreads tab',
    'journal.view': 'View',
    'journal.saved': 'saved',
    'journal.quote': '"Recorded wisdom is the treasure of the soul."',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your app experience',
    'settings.premium': 'Premium',
    'settings.active': 'Active',
    'settings.premiumSpreads': 'Premium Spreads',
    'settings.adFree': 'Ad-Free',
    'settings.unlimitedStorage': 'Unlimited Storage',
    'settings.managePremium': 'Manage Premium',
    'settings.displayTheme': 'Display & Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.notifications': 'Notifications',
    'settings.spreadCompletion': 'Spread Completion',
    'settings.spreadCompletionDesc': 'Get notified when spreads are complete',
    'settings.soundHaptics': 'Sound & Haptics',
    'settings.soundEffects': 'Sound Effects',
    'settings.hapticFeedback': 'Haptic Feedback',
    'settings.hapticFeedbackDesc': 'Vibration feedback on touch',
    'settings.privacySecurity': 'Privacy & Security',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.dataManagement': 'Data Management',
    'settings.support': 'Support',
    'settings.helpFaq': 'Help & FAQ',
    'settings.supportDev': 'Support Developer',
    'settings.version': 'Tarot Timer v1.0.0',
    'settings.copyright': '© 2024 Mystical Apps. All rights reserved.',
    'settings.quote': '"Wisdom begins with the right settings."',
    'settings.on': 'On',
    'settings.off': 'Off',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};