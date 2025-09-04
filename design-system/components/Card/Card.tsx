import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styled } from 'nativewind';
import { colorTokens, spacingTokens } from '../../tokens';

// Types
interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

// Styled components
const StyledView = styled(BlurView, 'rounded-2xl border border-white/20 overflow-hidden');

/**
 * 글래스모피즘 스타일 카드 컴포넌트
 * 레퍼런스 디자인의 반투명 카드를 정확히 구현
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  className,
  style,
  onPress,
  disabled = false,
}) => {
  // 사이즈별 패딩 설정
  const sizeStyles = {
    sm: { padding: 16 },
    md: { padding: 24 },
    lg: { padding: 32 },
  };

  // 배경 그라데이션 (레퍼런스와 일치)
  const backgroundGradient = [
    'rgba(255, 255, 255, 0.1)',
    'rgba(255, 255, 255, 0.05)',
  ];

  // 글래스 효과 렌더
  const renderGlassCard = () => (
    <StyledView
      intensity={20}
      tint="light"
      className={className}
      style={[
        {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(212, 175, 55, 0.3)', // 골드 보더
          borderWidth: 1,
          shadowColor: colorTokens.brand.secondary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
          ...sizeStyles[size],
        },
        style,
      ]}
    >
      {children}
    </StyledView>
  );

  // 솔리드 카드 렌더  
  const renderSolidCard = () => (
    <LinearGradient
      colors={[colorTokens.background.primary, colorTokens.background.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: 16,
          borderColor: colorTokens.surface.border,
          borderWidth: 1,
          shadowColor: colorTokens.brand.secondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
          ...sizeStyles[size],
        },
        style,
      ]}
      className={className}
    >
      {children}
    </LinearGradient>
  );

  // 아웃라인 카드 렌더
  const renderOutlineCard = () => (
    <StyledView
      intensity={10}
      tint="dark" 
      className={className}
      style={[
        {
          backgroundColor: 'transparent',
          borderColor: colorTokens.surface.border,
          borderWidth: 1,
          ...sizeStyles[size],
        },
        style,
      ]}
    >
      {children}
    </StyledView>
  );

  // 터치 가능한 카드로 래핑
  const cardContent = () => {
    switch (variant) {
      case 'glass':
        return renderGlassCard();
      case 'solid':
        return renderSolidCard();
      case 'outline':
        return renderOutlineCard();
      default:
        return renderGlassCard();
    }
  };

  if (onPress) {
    const { Pressable } = require('react-native');
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : disabled ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {cardContent()}
      </Pressable>
    );
  }

  return cardContent();
};

// Card 관련 서브 컴포넌트들
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { View } = require('react-native');
  return (
    <View className={`mb-4 ${className}`}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { Text } = require('react-native');
  return (
    <Text 
      className={`text-xl font-semibold text-white ${className}`}
      style={{
        fontSize: 20,
        fontWeight: '600',
        color: colorTokens.text.primary,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { View } = require('react-native');
  return (
    <View className={className}>
      {children}
    </View>
  );
};

// Export types
export type { CardProps };