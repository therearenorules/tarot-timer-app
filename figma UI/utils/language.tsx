import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    // 네비게이션
    'nav.timer': '타이머',
    'nav.spreads': '스프레드',
    'nav.journal': '저널',
    'nav.settings': '설정',
    
    // 타이머 탭
    'timer.title': '타로 타이머',
    'timer.currentHour': '현재 시간',
    'timer.now': '지금',
    'timer.revealDestiny': '운명을 펼쳐보세요',
    'timer.cosmicMessage': '우주가 전하는 24시간의 신성한 메시지',
    'timer.drawCards': '24시간 카드 뽑기',
    'timer.drawingCards': '카드를 뽑는 중...',
    'timer.energyFlow': '시간의 흐름',
    'timer.redraw': '다시 뽑기',
    'timer.reshuffling': '재배치 중...',
    'timer.sacredJournal': '성스러운 저널',
    'timer.journalPlaceholder': '이 시간의 카드가 전하는 메시지를 기록해보세요...',
    'timer.saveReading': '일일 타로 저장하기',
    'timer.saved': '저장됨',
    'timer.quote': '"시간은 강물과 같다. 우리는 그 흐름 속에서 진실을 발견한다."',
    
    // 스프레드 탭
    'spreads.title': '타로 스프레드',
    'spreads.subtitle': '당신의 질문에 맞는 완벽한 스프레드',
    'spreads.beginReading': '리딩 시작하기',
    'spreads.premium': '프리미엄',
    'spreads.premiumTitle': '프리미엄 활성화됨',
    'spreads.premiumDesc': '모든 고급 스프레드와 기능을 자유롭게 이용하세요',
    'spreads.premiumActive': '프리미엄 활성',
    'spreads.quote': '"모든 카드에는 우주의 지혜가 담겨 있다."',
    
    // 저널 탭
    'journal.title': '신성한 저널',
    'journal.subtitle': '당신의 타로 여정을 기록하세요',
    'journal.dailyTarot': '일일 타로',
    'journal.spreadRecords': '스프레드 기록',
    'journal.dailyReadings': '일일 리딩',
    'journal.records': '개',
    'journal.saved': '저장됨',
    'journal.view': '보기',
    'journal.noReadings': '아직 저장된 리딩이 없습니다',
    'journal.noReadingsDesc': '타이머에서 24시간 카드를 뽑고 저장해보세요',
    'journal.noSpreads': '아직 저장된 스프레드가 없습니다',
    'journal.noSpreadsDesc': '스프레드 탭에서 리딩을 완료하고 저장해보세요',
    'journal.quote': '"기록된 지혜는 미래의 나침반이 된다."',
    
    // 설정 탭
    'settings.title': '설정',
    'settings.subtitle': '앱을 당신에게 맞게 설정하세요',
    'settings.premium': '프리미엄 멤버십',
    'settings.active': '활성화됨',
    'settings.premiumSpreads': '모든 프리미엄 스프레드 접근',
    'settings.adFree': '광고 없는 환경',
    'settings.unlimitedStorage': '무제한 저장 공간',
    'settings.managePremium': '프리미엄 관리',
    'settings.displayTheme': '화면 & 테마',
    'settings.darkMode': '다크 모드',
    'settings.language': '언어',
    'settings.korean': '한국어',
    'settings.english': '영어',
    'settings.notifications': '알림',
    'settings.spreadCompletion': '스프레드 완료 알림',
    'settings.spreadCompletionDesc': '리딩 완료 시 알림 받기',
    'settings.soundHaptics': '소리 & 햅틱',
    'settings.soundEffects': '효과음',
    'settings.hapticFeedback': '햅틱 피드백',
    'settings.hapticFeedbackDesc': '터치 시 진동 피드백',
    'settings.privacySecurity': '개인정보 & 보안',
    'settings.privacyPolicy': '개인정보 처리방침',
    'settings.dataManagement': '데이터 관리',
    'settings.support': '지원 & 정보',
    'settings.helpFaq': '도움말 & FAQ',
    'settings.supportDev': '개발자 지원',
    'settings.version': '버전 1.0.0',
    'settings.copyright': '© 2024 Tarot Timer',
    'settings.quote': '"설정된 의도는 명확한 답을 가져온다."',
    
    // 공통
    'common.characters': '자',
    'common.back': '뒤로',
    'common.close': '닫기',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.retry': '다시 시도',
    'common.noData': '데이터가 없습니다'
  },
  en: {
    // Navigation
    'nav.timer': 'Timer',
    'nav.spreads': 'Spreads', 
    'nav.journal': 'Journal',
    'nav.settings': 'Settings',
    
    // Timer Tab
    'timer.title': 'Tarot Timer',
    'timer.currentHour': 'Current Hour',
    'timer.now': 'Now',
    'timer.revealDestiny': 'Reveal Your Destiny',
    'timer.cosmicMessage': '24 sacred messages from the universe',
    'timer.drawCards': 'Draw 24-Hour Cards',
    'timer.drawingCards': 'Drawing cards...',
    'timer.energyFlow': 'Energy Flow',
    'timer.redraw': 'Redraw',
    'timer.reshuffling': 'Reshuffling...',
    'timer.sacredJournal': 'Sacred Journal',
    'timer.journalPlaceholder': 'Record the message this hour\'s card brings you...',
    'timer.saveReading': 'Save Daily Reading',
    'timer.saved': 'Saved',
    'timer.quote': '"Time flows like a river. We discover truth within its flow."',
    
    // Spreads Tab
    'spreads.title': 'Tarot Spreads',
    'spreads.subtitle': 'Perfect spreads for your questions',
    'spreads.beginReading': 'Begin Reading',
    'spreads.premium': 'Premium',
    'spreads.premiumTitle': 'Premium Activated',
    'spreads.premiumDesc': 'Enjoy all advanced spreads and features freely',
    'spreads.premiumActive': 'Premium Active',
    'spreads.quote': '"Every card contains the wisdom of the universe."',
    
    // Journal Tab
    'journal.title': 'Sacred Journal',
    'journal.subtitle': 'Record your tarot journey',
    'journal.dailyTarot': 'Daily Tarot',
    'journal.spreadRecords': 'Spread Records',
    'journal.dailyReadings': 'Daily Readings',
    'journal.records': 'records',
    'journal.saved': 'Saved',
    'journal.view': 'View',
    'journal.noReadings': 'No saved readings yet',
    'journal.noReadingsDesc': 'Draw and save 24-hour cards from the timer',
    'journal.noSpreads': 'No saved spreads yet', 
    'journal.noSpreadsDesc': 'Complete and save readings from the spreads tab',
    'journal.quote': '"Recorded wisdom becomes a compass for the future."',
    
    // Settings Tab
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize the app for you',
    'settings.premium': 'Premium Membership',
    'settings.active': 'Active',
    'settings.premiumSpreads': 'Access to all premium spreads',
    'settings.adFree': 'Ad-free experience',
    'settings.unlimitedStorage': 'Unlimited storage',
    'settings.managePremium': 'Manage Premium',
    'settings.displayTheme': 'Display & Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.korean': 'Korean',
    'settings.english': 'English',
    'settings.notifications': 'Notifications',
    'settings.spreadCompletion': 'Spread completion',
    'settings.spreadCompletionDesc': 'Get notified when readings are complete',
    'settings.soundHaptics': 'Sound & Haptics',
    'settings.soundEffects': 'Sound Effects',
    'settings.hapticFeedback': 'Haptic Feedback',
    'settings.hapticFeedbackDesc': 'Vibration feedback on touch',
    'settings.privacySecurity': 'Privacy & Security',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.dataManagement': 'Data Management',
    'settings.support': 'Support & Info',
    'settings.helpFaq': 'Help & FAQ',
    'settings.supportDev': 'Support Developer',
    'settings.version': 'Version 1.0.0',
    'settings.copyright': '© 2024 Tarot Timer',
    'settings.quote': '"Intended settings bring clear answers."',
    
    // Common
    'common.characters': 'chars',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.noData': 'No data available'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
