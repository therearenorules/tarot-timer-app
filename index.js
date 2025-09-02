/**
 * Expo Router entry point
 */

// Fix for Metro runtime error
if (typeof __DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

import 'expo-router/entry';