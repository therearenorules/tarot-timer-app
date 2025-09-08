import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticFeedback = {
  light: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  
  success: () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  selection: () => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
};

// 편의 함수들
export const cardSelectFeedback = () => HapticFeedback.light();
export const cardFlipFeedback = () => HapticFeedback.medium();
export const spreadCompleteFeedback = () => HapticFeedback.success();
export const buttonPressFeedback = () => HapticFeedback.selection();