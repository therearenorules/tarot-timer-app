export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  surfaceSecondary: string;
  textTertiary: string;
  borderSecondary: string;
  shadow: string;
  overlay: string;
  // Mystical Premium colors from Figma
  premiumGold: string;
  deepPurple: string;
  midnightBlue: string;
  divider: string;
  // Additional Figma colors
  backgroundTertiary: string;
  textQuaternary: string;
  info: string;
  // Mystical gradients
  gradientMystical: string;
  gradientPremium: string;
  gradientSurface: string;
  // Mystical theme properties
  mystical: {
    shadow: string;
    glow: string;
    border: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    title1: { fontSize: number; fontWeight: '700' | '600' | '400'; lineHeight: number };
    title2: { fontSize: number; fontWeight: '700' | '600' | '400'; lineHeight: number };
    title3: { fontSize: number; fontWeight: '700' | '600' | '400'; lineHeight: number };
    body: { fontSize: number; fontWeight: '700' | '600' | '400'; lineHeight: number };
    caption: { fontSize: number; fontWeight: '700' | '600' | '400'; lineHeight: number };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#4a1a4f', // Deep Purple from Figma
    secondary: '#fafafa', // Light surface from Figma
    background: '#ffffff', // White background from Figma
    surface: '#fafafa', // Light surface from Figma
    text: '#1a1f3a', // Midnight Blue from Figma
    textSecondary: '#6b7280', // Neutral gray from Figma
    border: '#e8e1e8', // Light purple tint from Figma
    accent: '#d4af37', // Gold accent from Figma
    error: '#dc2626', // Error color from Figma
    success: '#34C759',
    warning: '#FF9500',
    info: '#17A2B8', // Info color from Figma
    // Extended colors
    surfaceSecondary: '#f8f6f9', // Very light purple tint from Figma
    backgroundTertiary: '#f8f6f9', // Tertiary background from Figma
    textTertiary: '#9CA3AF',
    textQuaternary: '#8E8E93', // Quaternary text from Figma
    borderSecondary: '#e8e1e8', // Light purple tint from Figma
    shadow: 'rgba(74, 26, 79, 0.1)', // Mystical shadow with deep purple
    overlay: 'rgba(0, 0, 0, 0.5)',
    // Mystical Premium colors from Figma
    premiumGold: '#d4af37',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
    divider: '#e8e1e8',
    // Mystical gradients
    gradientMystical: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)',
    gradientPremium: 'linear-gradient(45deg, #d4af37 0%, #f4d03f 100%)',
    gradientSurface: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
    // Mystical theme properties
    mystical: {
      shadow: 'rgba(74, 26, 79, 0.2)',
      glow: 'rgba(212, 175, 55, 0.3)',
      border: 'rgba(74, 26, 79, 0.3)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    title1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    title2: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
  borderRadius: {
    sm: 4, // 8px - 4px for smaller elements
    md: 6, // 8px - 2px for medium elements
    lg: 8, // 8px base from Figma
    xl: 12, // 8px + 4px for larger elements
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#4a1a4f', // Deep Purple from Figma (same as light)
    secondary: '#1a1f3a', // Midnight Blue surface from Figma
    background: '#0f0f1a', // Dark background from Figma
    surface: '#1a1f3a', // Midnight Blue surface from Figma
    text: '#ffffff', // White text from Figma
    textSecondary: '#c8b8d4', // Light purple from Figma
    border: '#2a2f4a', // Dark divider from Figma
    accent: '#f4d03f', // Lighter gold for dark mode from Figma
    error: '#ff453a', // Error color from Figma
    success: '#30D158',
    warning: '#FF9F0A',
    info: '#64D2FF', // Info color for dark mode from Figma
    // Extended colors
    surfaceSecondary: '#2a2f4a', // Dark tertiary background from Figma
    backgroundTertiary: '#2a2f4a', // Tertiary background from Figma
    textTertiary: '#8e8e93', // Muted foreground from Figma
    textQuaternary: '#6B6B7B', // Quaternary text from Figma
    borderSecondary: '#2a2f4a', // Dark divider from Figma
    shadow: 'rgba(74, 26, 79, 0.3)', // Mystical shadow with deep purple
    overlay: 'rgba(15, 15, 26, 0.8)', // Dark overlay from Figma
    // Mystical Premium colors from Figma
    premiumGold: '#f4d03f', // Lighter gold for dark mode
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
    divider: '#2a2f4a',
    // Mystical gradients
    gradientMystical: 'linear-gradient(135deg, #0f0f1a 0%, #4a1a4f 50%, #0f0f1a 100%)',
    gradientPremium: 'linear-gradient(45deg, #f4d03f 0%, #ffd700 100%)',
    gradientSurface: 'linear-gradient(180deg, rgba(244, 208, 63, 0.1) 0%, transparent 100%)',
    // Mystical theme properties
    mystical: {
      shadow: 'rgba(74, 26, 79, 0.4)',
      glow: 'rgba(244, 208, 63, 0.4)',
      border: 'rgba(74, 26, 79, 0.5)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    title1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    title2: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

// Legacy theme export for backward compatibility
export const theme = lightTheme;