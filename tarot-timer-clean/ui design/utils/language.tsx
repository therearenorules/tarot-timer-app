import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ko: {
    // Navigation
    'nav.timer': '타이머',
    'nav.spreads': '스프레드',
    'nav.journal': '일기',
    'nav.settings': '설정',

    // Timer
    'timer.title': 'Tarot Timer',
    'timer.subtitle': '신비로운 24시간 타로 여행',
    'timer.currentHour': '현재 시간',
    'timer.revealDestiny': '운명을 밝혀보세요',
    'timer.cosmicMessage': '오늘 하루 각 시간에 흐르는\n우주의 에너지를 발견하세요',
    'timer.drawCards': '24시간 타로 뽑기',
    'timer.drawingCards': '우주가 당신의 카드들을 선택하고 있습니다...',
    'timer.energyFlow': '24시간 에너지 흐름',
    'timer.redraw': '다시 뽑기',
    'timer.reshuffling': '다시 섞는 중...',
    'timer.sacredJournal': '신성한 일기',
    'timer.journalPlaceholder': '직감과 느낌을 기록하세요... 우주의 메시지가 당신의 글을 통해 흘러나오게 하세요...',
    'timer.saveReading': '데일리 타로 저장하기',
    'timer.saved': '데일리 타로 저장됨 ✨',
    'timer.quote': '"매 순간마다 우주의 메시지가 있습니다.\n마음을 열고 그 지혜를 받아들이세요."',
    'timer.now': '지금',

    // Spreads
    'spreads.title': 'Tarot Spreads',
    'spreads.subtitle': '우주 지혜로 향하는 길을 선택하세요',
    'spreads.beginReading': '리딩 시작하기',
    'spreads.cards': '카드',
    'spreads.premium': '프리미엄',
    'spreads.premiumTitle': '프리미엄 경험',
    'spreads.premiumDesc': '프리미엄 신비로운 컬렉션으로\n고급 스프레드와 깊은 우주의 통찰을 잠금 해제하세요',
    'spreads.premiumActive': '프리미엄 활성화',
    'spreads.quote': '"각 스프레드는 이해로 향하는 관문입니다.\n당신의 영혼이 부르는 길을 선택하세요."',

    // Journal
    'journal.title': 'Sacred Journal',
    'journal.subtitle': '우주 지혜를 통한 신비로운 여행',
    'journal.dailyTarot': '데일리 타로',
    'journal.spreadRecords': '스프레드 기록',
    'journal.dailyReadings': '데일리 리딩',
    'journal.noReadings': '아직 리딩이 없습니다',
    'journal.noReadingsDesc': '첫 번째 24시간 타로 리딩을 뽑아서\n신비로운 여정을 시작하세요',
    'journal.noSpreads': '아직 스프레드가 없습니다',
    'journal.noSpreadsDesc': '첫 번째 스프레드 리딩을 만들어서\n신비로운 컬렉션을 시작하세요',
    'journal.view': '보기',
    'journal.records': '기록',
    'journal.saved': '저장됨',
    'journal.quote': '"기록된 지혜는 미래의 자신에게\n주는 소중한 선물입니다."',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': '당신의 신비로운 경험을 맞춤설정하세요',
    'settings.premium': '프리미엄 멤버십',
    'settings.active': '활성화',
    'settings.premiumSpreads': '프리미엄 스프레드 접근',
    'settings.adFree': '광고 없는 경험',
    'settings.unlimitedStorage': '무제한 저장소',
    'settings.managePremium': '프리미엄 관리',
    'settings.displayTheme': '화면 및 테마',
    'settings.darkMode': '다크 모드',
    'settings.language': '언어',
    'settings.korean': '한국어',
    'settings.english': '영어',
    'settings.notifications': '알림',
    'settings.spreadCompletion': '스프레드 완료',
    'settings.spreadCompletionDesc': '카드 리딩이 완료되면 알림',
    'settings.soundHaptics': '소리 및 진동',
    'settings.soundEffects': '효과음',
    'settings.hapticFeedback': '햅틱 피드백',
    'settings.hapticFeedbackDesc': '카드 선택 시 진동',
    'settings.privacySecurity': '개인정보 및 보안',
    'settings.privacyPolicy': '개인정보 처리방침',
    'settings.dataManagement': '데이터 관리',
    'settings.support': '지원 및 정보',
    'settings.helpFaq': '도움말 및 FAQ',
    'settings.supportDev': '개발자 후원',
    'settings.version': 'Tarot Timer v1.0.0',
    'settings.copyright': '© 2024 Mystical Tarot Studio',
    'settings.on': '켜짐',
    'settings.off': '꺼짐',
    'settings.quote': '"설정을 맞춤화하여\n완벽한 신성한 공간을 만드세요."',

    // Common
    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '수정',
    'common.delete': '삭제',
    'common.back': '뒤로',
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.characters': '글자',
  },
  
  en: {
    // Navigation
    'nav.timer': 'Timer',
    'nav.spreads': 'Spreads',
    'nav.journal': 'Journal',
    'nav.settings': 'Settings',

    // Timer
    'timer.title': 'Tarot Timer',
    'timer.subtitle': 'Your mystical 24-hour tarot journey',
    'timer.currentHour': 'Current Hour',
    'timer.revealDestiny': 'Reveal Your Destiny',
    'timer.cosmicMessage': 'Draw 24 cards to discover the cosmic energy\nflowing through each hour of your day',
    'timer.drawCards': 'Draw 24-Hour Tarot',
    'timer.drawingCards': 'The universe is selecting your cards...',
    'timer.energyFlow': '24-Hour Energy Flow',
    'timer.redraw': 'Redraw',
    'timer.reshuffling': 'Reshuffling...',
    'timer.sacredJournal': 'Sacred Journal',
    'timer.journalPlaceholder': 'Record your intuitions and feelings... Let the universe\'s messages flow through your words...',
    'timer.saveReading': 'Save Daily Tarot Reading',
    'timer.saved': 'Daily Tarot Saved ✨',
    'timer.quote': '"Every moment holds a message from the cosmos.\nOpen your heart and receive the wisdom."',
    'timer.now': 'Now',

    // Spreads
    'spreads.title': 'Tarot Spreads',
    'spreads.subtitle': 'Choose your path to cosmic wisdom',
    'spreads.beginReading': 'Begin Reading',
    'spreads.cards': 'Cards',
    'spreads.premium': 'Premium',
    'spreads.premiumTitle': 'Premium Experience',
    'spreads.premiumDesc': 'Unlock advanced spreads and deeper cosmic insights\nwith our premium mystical collection',
    'spreads.premiumActive': 'Premium Active',
    'spreads.quote': '"Each spread is a gateway to understanding.\nChoose the path that calls to your soul."',

    // Journal
    'journal.title': 'Sacred Journal',
    'journal.subtitle': 'Your mystical journey through cosmic wisdom',
    'journal.dailyTarot': 'Daily Tarot',
    'journal.spreadRecords': 'Spread Records',
    'journal.dailyReadings': 'Daily Readings',
    'journal.noReadings': 'No Readings Yet',
    'journal.noReadingsDesc': 'Begin your mystical journey by drawing\nyour first 24-hour tarot reading',
    'journal.noSpreads': 'No Spreads Yet',
    'journal.noSpreadsDesc': 'Create your first spread reading\nto begin your mystical collection',
    'journal.view': 'View',
    'journal.records': 'Records',
    'journal.saved': 'Saved',
    'journal.quote': '"Recorded wisdom is a precious gift\nto your future self."',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your mystical experience',
    'settings.premium': 'Premium Membership',
    'settings.active': 'Active',
    'settings.premiumSpreads': 'Premium Spreads Access',
    'settings.adFree': 'Ad-Free Experience',
    'settings.unlimitedStorage': 'Unlimited Storage',
    'settings.managePremium': 'Manage Premium',
    'settings.displayTheme': 'Display & Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.korean': '한국어',
    'settings.english': 'English',
    'settings.notifications': 'Notifications',
    'settings.spreadCompletion': 'Spread Completion',
    'settings.spreadCompletionDesc': 'Notify when card reading is complete',
    'settings.soundHaptics': 'Sound & Haptics',
    'settings.soundEffects': 'Sound Effects',
    'settings.hapticFeedback': 'Haptic Feedback',
    'settings.hapticFeedbackDesc': 'Vibration when selecting cards',
    'settings.privacySecurity': 'Privacy & Security',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.dataManagement': 'Data Management',
    'settings.support': 'Support & Info',
    'settings.helpFaq': 'Help & FAQ',
    'settings.supportDev': 'Support Developer',
    'settings.version': 'Tarot Timer v1.0.0',
    'settings.copyright': '© 2024 Mystical Tarot Studio',
    'settings.on': 'ON',
    'settings.off': 'OFF',
    'settings.quote': '"Customize your settings to create\nyour perfect sacred space."',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.characters': 'characters',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('tarot-language') as Language;
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('tarot-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}