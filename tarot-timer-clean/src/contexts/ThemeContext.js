// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/colors';
import { getUserSettings, saveUserSettings } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // 기본값은 다크 모드
  const [isLoading, setIsLoading] = useState(true);

  // 저장된 테마 설정 로드
  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const settings = await getUserSettings();
      setIsDark(settings.theme === 'dark');
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading theme settings:', error);
      setIsLoading(false);
    }
  };

  // 테마 토글
  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    try {
      const settings = await getUserSettings();
      await saveUserSettings({
        ...settings,
        theme: newTheme
      });
    } catch (error) {
      console.error('Error saving theme setting:', error);
    }
  };

  // 현재 테마 색상 가져오기
  const theme = isDark ? colors.dark : colors.light;

  const contextValue = {
    isDark,
    theme,
    colors: isDark ? colors.dark : colors.light,
    toggleTheme,
    isLoading,
  };

  if (isLoading) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;