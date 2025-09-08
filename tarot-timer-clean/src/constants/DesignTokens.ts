export const DesignTokens = {
  colors: {
    background: {
      primary: '#1a1f3a',
      secondary: '#4a1a4f',
      gradient: ['#1a1f3a', '#4a1a4f', '#1a1f3a']
    },
    primary: '#d4af37',
    secondary: '#4a1a4f',
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.6)'
    },
    button: {
      gradient: ['#f59e0b', '#eab308'],
      text: '#000000',
      hoverGradient: ['#eab308', '#ca8a04'],
      border: 'rgba(212, 175, 55, 0.5)'
    },
    accent: {
      gold: '#d4af37',
      goldMuted: 'rgba(212, 175, 55, 0.4)',
      cardBorder: 'rgba(212, 175, 55, 0.2)',
      overlay: 'rgba(255, 255, 255, 0.1)',
      overlayBorder: 'rgba(255, 255, 255, 0.2)'
    }
  },
  fonts: {
    family: 'NotoSansKR_400Regular',
    sizes: {
      displayLarge: 32,
      titleLarge: 24,
      titleMedium: 20,
      bodyLarge: 16,
      bodyMedium: 14,
      bodySmall: 12,
      caption: 11
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const
    }
  },
  spacing: {
    containerPadding: 24,
    sectionGap: 32,
    cardGap: 12,
    buttonPadding: {
      vertical: 16,
      horizontal: 24
    },
    borderRadius: {
      card: 16,
      button: 12,
      small: 8
    }
  },
  layout: {
    maxWidth: 448,
    tabHeight: 88,
    contentPaddingBottom: 96
  },
  shadows: {
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8
    },
    mysticalGlow: {
      shadowColor: '#d4af37',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10
    }
  }
} as const;