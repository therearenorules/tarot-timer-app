/**
 * 📖 Mystical Typography System
 * Sacred font configurations for the tarot experience
 */

export const MysticalTypography = {
  // Font Families
  fontFamily: {
    primary: 'NotoSansKR',
    display: 'NotoSansKR-Bold',
    mystical: 'NotoSansKR-Black',
  },

  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 11,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
    '7xl': 56,
    '8xl': 64,
    '9xl': 72,
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  } as const,

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
    mystical: 2.5,
  },

  // Text Styles for different components
  styles: {
    // 🌟 Titles & Headers
    mysticalTitle: {
      fontSize: 32,
      fontWeight: '900' as const,
      fontFamily: 'NotoSansKR-Black',
      letterSpacing: 2,
      lineHeight: 1.2,
    },
    
    cosmicHeader: {
      fontSize: 24,
      fontWeight: '800' as const,
      fontFamily: 'NotoSansKR-Bold',
      letterSpacing: 1.5,
      lineHeight: 1.3,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      fontFamily: 'NotoSansKR-Bold',
      letterSpacing: 1,
      lineHeight: 1.4,
    },

    // 📝 Body Text
    bodyLarge: {
      fontSize: 16,
      fontWeight: '500' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.5,
    },

    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0,
      lineHeight: 1.5,
    },

    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0,
      lineHeight: 1.4,
    },

    // 🔮 Special Elements
    cardName: {
      fontSize: 18,
      fontWeight: '700' as const,
      fontFamily: 'NotoSansKR-Bold',
      letterSpacing: 0.5,
      lineHeight: 1.3,
    },

    cardDescription: {
      fontSize: 14,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0,
      lineHeight: 1.6,
    },

    keyword: {
      fontSize: 11,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },

    // ⏰ Time Elements
    timeDisplay: {
      fontSize: 28,
      fontWeight: '800' as const,
      fontFamily: 'NotoSansKR-Bold',
      letterSpacing: 1,
      lineHeight: 1.2,
    },

    timeLabel: {
      fontSize: 11,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 2,
      lineHeight: 1.2,
    },

    // 🎭 Interactive Elements
    buttonLarge: {
      fontSize: 16,
      fontWeight: '700' as const,
      fontFamily: 'NotoSansKR-Bold',
      letterSpacing: 1,
      lineHeight: 1.3,
    },

    buttonMedium: {
      fontSize: 14,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.3,
    },

    buttonSmall: {
      fontSize: 12,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },

    // 📱 Tab Elements
    tabLabel: {
      fontSize: 11,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },

    // ✨ Decorative Text
    subtitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 1.5,
      lineHeight: 1.4,
    },

    caption: {
      fontSize: 10,
      fontWeight: '500' as const,
      fontFamily: 'NotoSansKR',
      letterSpacing: 0.5,
      lineHeight: 1.3,
    }
  }
};

export default MysticalTypography;