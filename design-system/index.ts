/**
 * Mystical Tarot Timer - Design System
 * 확장 가능한 컴포넌트 라이브러리
 */

// ===== TOKENS =====
export * from './tokens/colors';
export * from './tokens/spacing';
export * from './tokens/typography';

// ===== COMPONENTS =====
// Core UI Components
export { Card, CardHeader, CardTitle, CardContent } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';

export { Button, ButtonGroup } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';

export { Switch, SwitchGroup } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';

// Specialized Components
export { TarotCard, TarotCardPlaceholder } from './components/TarotCard/TarotCard';
export type { TarotCardProps } from './components/TarotCard/TarotCard';

// Layout Components
export { 
  MysticalLayout, 
  MysticalSection, 
  MysticalContainer 
} from './components/Layout/MysticalLayout';
export type { MysticalLayoutProps } from './components/Layout/MysticalLayout';

// Screen Components
export { TimerScreen } from './components/Screens/TimerScreen';
export type { TimerScreenProps } from './components/Screens/TimerScreen';

export { SpreadsScreen } from './components/Screens/SpreadsScreen';
export type { SpreadsScreenProps, SpreadType } from './components/Screens/SpreadsScreen';

export { SettingsScreen } from './components/Screens/SettingsScreen';
export type { SettingsScreenProps } from './components/Screens/SettingsScreen';

// ===== THEME =====
export const theme = {
  colors: {
    // 브랜드 컬러
    brand: {
      primary: '#4A1A4F',
      secondary: '#D4AF37', 
      accent: '#F4D03F',
    },
    
    // 배경 그라데이션
    background: {
      primary: '#4A1A4F',
      secondary: '#2D1B69',
      tertiary: '#1A1F3A',
    },
    
    // 텍스트 컬러
    text: {
      primary: '#FFFFFF',
      secondary: '#E0D4F1',
      tertiary: '#C8B8D4',
      muted: '#9CA3AF',
    },
    
    // 표면/카드 컬러
    surface: {
      card: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.15)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      border: 'rgba(212, 175, 55, 0.3)',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },
  
  shadows: {
    mystical: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }
  }
} as const;

// ===== UTILITIES =====
export const utils = {
  // 글래스모피즘 스타일 헬퍼
  glassMorphism: (opacity = 0.1) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
  }),
  
  // 그라데이션 헬퍼
  gradients: {
    mystical: ['#4A1A4F', '#2D1B69', '#1A1F3A'],
    gold: ['#D4AF37', '#F4D03F'],
    overlay: ['transparent', 'rgba(0,0,0,0.8)'],
  },
  
  // 타이포그래피 헬퍼
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#E0D4F1',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#C8B8D4',
    },
  },
} as const;

// ===== VERSION =====
export const VERSION = '1.0.0';

// Default export for convenience
export default {
  theme,
  utils,
  VERSION,
};