// 기본 언어 유틸리티 (임시 구현)
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// 간단한 번역 맵
const translations = {
  ko: {
    timer: '타이머',
    spreads: '스프레드',
    journal: '저널',
    settings: '설정',
  },
  en: {
    timer: 'Timer',
    spreads: 'Spreads', 
    journal: 'Journal',
    settings: 'Settings',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ko] || key;
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