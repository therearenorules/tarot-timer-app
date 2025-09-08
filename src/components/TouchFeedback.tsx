import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Pressable, 
  Animated, 
  View,
  TouchableOpacityProps
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface TouchFeedbackProps extends TouchableOpacityProps {
  children: React.ReactNode;
  touchType?: 'button' | 'premiumButton' | 'secondaryButton' | 'card' | 'tarotCard' | 'tabButton' | 'iconButton' | 'listItem';
  hapticFeedback?: boolean;
  onPress?: () => void;
  pressableStyle?: any;
}

const touchConfig = {
  opacity: {
    light: 0.9,
    normal: 0.7,
    strong: 0.5,
    disabled: 0.3,
  },
  scale: {
    subtle: 0.98,
    normal: 0.95,
    strong: 0.92,
  },
};

const touchStates = {
  button: {
    activeOpacity: touchConfig.opacity.normal,
    scale: touchConfig.scale.normal,
    haptic: Haptics.ImpactFeedbackStyle.Medium,
  },
  premiumButton: {
    activeOpacity: touchConfig.opacity.light,
    scale: touchConfig.scale.normal,
    haptic: Haptics.ImpactFeedbackStyle.Heavy,
  },
  secondaryButton: {
    activeOpacity: touchConfig.opacity.normal,
    scale: touchConfig.scale.subtle,
    haptic: Haptics.ImpactFeedbackStyle.Light,
  },
  card: {
    activeOpacity: touchConfig.opacity.light,
    scale: touchConfig.scale.subtle,
    haptic: Haptics.ImpactFeedbackStyle.Medium,
  },
  tarotCard: {
    activeOpacity: touchConfig.opacity.light,
    scale: touchConfig.scale.normal,
    haptic: Haptics.ImpactFeedbackStyle.Medium,
  },
  tabButton: {
    activeOpacity: touchConfig.opacity.normal,
    scale: touchConfig.scale.subtle,
    haptic: Haptics.SelectionAsync,
  },
  iconButton: {
    activeOpacity: touchConfig.opacity.normal,
    scale: touchConfig.scale.strong,
    haptic: Haptics.ImpactFeedbackStyle.Light,
  },
  listItem: {
    activeOpacity: touchConfig.opacity.light,
    scale: touchConfig.scale.subtle,
    haptic: Haptics.ImpactFeedbackStyle.Light,
  },
};

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  touchType = 'button',
  hapticFeedback = false,
  onPress,
  pressableStyle,
  style,
  ...otherProps
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const states = touchStates[touchType];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: states.scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    if (hapticFeedback) {
      if (states.haptic === Haptics.SelectionAsync) {
        Haptics.selectionAsync();
      } else {
        Haptics.impactAsync(states.haptic);
      }
    }
    onPress?.();
  };

  if (pressableStyle) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, pressableStyle]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          {...otherProps}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={states.activeOpacity}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={style}
        {...otherProps}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};