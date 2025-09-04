/**
 * Design Tokens - Spacing
 * 8pt 그리드 기반 간격 시스템
 */

export const spacingTokens = {
  // 기본 스케일 (8pt 베이스)
  0: '0px',
  1: '4px',    // 0.5 * 8
  2: '8px',    // 1 * 8  
  3: '12px',   // 1.5 * 8
  4: '16px',   // 2 * 8
  5: '20px',   // 2.5 * 8
  6: '24px',   // 3 * 8
  8: '32px',   // 4 * 8
  10: '40px',  // 5 * 8
  12: '48px',  // 6 * 8
  16: '64px',  // 8 * 8
  20: '80px',  // 10 * 8
  24: '96px',  // 12 * 8
  32: '128px', // 16 * 8

  // 의미적 간격
  semantic: {
    // 컴포넌트 내부 여백
    xs: '4px',   // 버튼 내부, 작은 여백
    sm: '8px',   // 카드 내부 기본
    md: '16px',  // 섹션간 구분
    lg: '24px',  // 큰 섹션 구분
    xl: '32px',  // 화면 상단/하단
    xxl: '40px', // 특별한 구분

    // 컴포넌트간 간격
    stack: {
      tight: '8px',
      normal: '16px', 
      loose: '24px',
      extraLoose: '32px',
    },

    // 레이아웃 여백
    container: {
      mobile: '16px',
      tablet: '24px', 
      desktop: '32px',
    },

    // 특화된 간격
    card: {
      padding: '24px',
      gap: '16px',
      borderRadius: '16px',
    },

    button: {
      paddingX: '24px',
      paddingY: '12px',
      gap: '8px',
    }
  }
} as const;

export type SpacingToken = keyof typeof spacingTokens;
export type SemanticSpacing = keyof typeof spacingTokens.semantic;