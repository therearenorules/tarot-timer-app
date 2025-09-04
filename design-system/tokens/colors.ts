/**
 * Design Tokens - Colors
 * 확장 가능한 색상 시스템
 */

export const colorTokens = {
  // 기본 팔레트
  brand: {
    primary: '#4A1A4F',      // 딥 퍼플
    secondary: '#D4AF37',    // 프리미엄 골드
    accent: '#F4D03F',       // 브라이트 골드
  },
  
  // 배경 그라데이션
  background: {
    primary: '#4A1A4F',
    secondary: '#2D1B69', 
    tertiary: '#1A1F3A',     // 미드나이트 블루
  },
  
  // 의미적 색상
  semantic: {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // 텍스트 색상
  text: {
    primary: '#FFFFFF',
    secondary: '#E0D4F1',    // 연한 라벤더
    tertiary: '#C8B8D4',     // 더 연한 라벤더
    muted: '#9CA3AF',
  },
  
  // 표면/카드 색상
  surface: {
    card: 'rgba(255, 255, 255, 0.1)',      // 글래스모피즘
    cardHover: 'rgba(255, 255, 255, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: 'rgba(212, 175, 55, 0.3)',     // 골드 보더
  },
  
  // 상호작용 색상
  interactive: {
    primary: '#D4AF37',
    primaryHover: '#F4D03F',
    primaryActive: '#B8941F',
    secondary: 'rgba(255, 255, 255, 0.1)',
    secondaryHover: 'rgba(255, 255, 255, 0.2)',
  }
} as const;

// 타입 정의
export type ColorToken = typeof colorTokens;
export type BrandColor = keyof typeof colorTokens.brand;
export type SemanticColor = keyof typeof colorTokens.semantic;