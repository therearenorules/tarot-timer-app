export const theme = {
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
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    title2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 25,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
} as const;