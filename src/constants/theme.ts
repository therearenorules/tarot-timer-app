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
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F9F9F9',
    text: '#000000',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#FF6B6B',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    // Extended colors
    surfaceSecondary: '#F3F4F6',
    textTertiary: '#9CA3AF',
    borderSecondary: '#D1D5DB',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
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

export const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    accent: '#FF453A',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    // Extended colors
    surfaceSecondary: '#2C2C2E',
    textTertiary: '#636366',
    borderSecondary: '#48484A',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
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