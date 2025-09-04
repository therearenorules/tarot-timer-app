import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colorTokens } from '../../tokens';

// Types
interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  className?: string;
}

/**
 * 프리미엄 토글 스위치
 * 레퍼런스의 황금색 활성화 스위치를 구현
 */
export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  size = 'md',
  disabled = false,
  activeColor = colorTokens.brand.secondary,
  inactiveColor = 'rgba(255, 255, 255, 0.2)',
  thumbColor = '#FFFFFF',
  className,
}) => {
  const translateX = useSharedValue(value ? 1 : 0);

  // 사이즈별 설정
  const sizeConfig = {
    sm: {
      width: 36,
      height: 20,
      thumbSize: 16,
      padding: 2,
    },
    md: {
      width: 44,
      height: 24,
      thumbSize: 20,
      padding: 2,
    },
    lg: {
      width: 52,
      height: 28,
      thumbSize: 24,
      padding: 2,
    },
  };

  const config = sizeConfig[size];

  // 토글 핸들러
  const handleToggle = () => {
    if (disabled) return;

    const newValue = !value;
    translateX.value = withSpring(newValue ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(newValue);
  };

  // 트랙 애니메이션 스타일
  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, 1],
      [inactiveColor, activeColor]
    );

    return {
      backgroundColor,
    };
  });

  // 썸 애니메이션 스타일
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateXValue = translateX.value * (config.width - config.thumbSize - config.padding * 2);

    return {
      transform: [{ translateX: translateXValue }],
    };
  });

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
      className={className}
    >
      {/* 트랙 */}
      <Animated.View
        style={[
          {
            width: config.width,
            height: config.height,
            borderRadius: config.height / 2,
            padding: config.padding,
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          },
          trackAnimatedStyle,
        ]}
      >
        {/* 썸 */}
        <Animated.View
          style={[
            {
              width: config.thumbSize,
              height: config.thumbSize,
              borderRadius: config.thumbSize / 2,
              backgroundColor: thumbColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

// 라벨과 함께 사용하는 스위치 그룹
export const SwitchGroup: React.FC<{
  children: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}> = ({
  children,
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}) => {
  const { View, Text } = require('react-native');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
      }}
    >
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: colorTokens.text.primary,
            marginBottom: description ? 4 : 0,
          }}
        >
          {label}
        </Text>
        
        {description && (
          <Text
            style={{
              fontSize: 14,
              color: colorTokens.text.tertiary,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </View>
  );
};

// Export types
export type { SwitchProps };