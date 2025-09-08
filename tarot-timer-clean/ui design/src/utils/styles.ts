import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 38,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 34,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }) as any,
    lineHeight: 31,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: Platform.select({ ios: '500', android: '500' }) as any,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }) as any,
    lineHeight: 16,
  },
};

export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
  gold: Platform.select({
    ios: {
      shadowColor: '#d4af37',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadows.medium,
  },
  mysticalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    ...shadows.gold,
  },
});

export const screenWidth = width;
export const screenHeight = height;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';