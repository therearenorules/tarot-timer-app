/**
 * Design Tokens - Typography
 * 반응형 타이포그래피 시스템
 */

export const typographyTokens = {
  // 폰트 패밀리
  fontFamily: {
    primary: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },

  // 폰트 웨이트
  fontWeight: {
    light: 300,
    regular: 400, 
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // 기본 폰트 크기 (모바일 우선)
  fontSize: {
    xs: '12px',
    sm: '14px', 
    base: '16px',  // 기본
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  // 라인 하이트
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // 레터 스페이싱
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },

  // 의미적 타이포그래피 스케일
  semantic: {
    // 제목 계층
    heading: {
      h1: {
        fontSize: '36px',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '30px', 
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '24px',
        fontWeight: 600, 
        lineHeight: 1.3,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '20px',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
    },

    // 본문 텍스트
    body: {
      large: {
        fontSize: '18px',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      base: {
        fontSize: '16px',
        fontWeight: 400, 
        lineHeight: 1.5,
      },
      small: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },

    // UI 텍스트
    ui: {
      button: {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: '0.025em',
      },
      caption: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0.025em',
      },
      label: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: '0.025em',
      },
    },

    // 브랜드 텍스트
    brand: {
      title: {
        fontSize: '30px',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      subtitle: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0em',
      },
    }
  }
} as const;

export type TypographyToken = typeof typographyTokens;
export type FontSize = keyof typeof typographyTokens.fontSize;
export type FontWeight = keyof typeof typographyTokens.fontWeight;