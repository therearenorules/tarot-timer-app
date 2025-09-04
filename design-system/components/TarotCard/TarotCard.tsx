import React, { useState } from 'react';
import { View, Text, Image, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colorTokens, spacingTokens } from '../../tokens';

// Types
interface TarotCardProps {
  card?: {
    id: string;
    name: string;
    nameKr: string;
    imageUrl: string;
    keywords?: string[];
    keywordsKr?: string[];
    meaning?: string;
    meaningKr?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isRevealed?: boolean;
  showInfo?: boolean;
  onPress?: () => void;
  onReveal?: () => void;
  style?: ViewStyle;
  className?: string;
  language?: 'ko' | 'en';
}

/**
 * 타로 카드 컴포넌트
 * 레퍼런스 디자인의 카드 스타일과 플리핑 애니메이션 구현
 */
export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  size = 'md',
  isRevealed = false,
  showInfo = true,
  onPress,
  onReveal,
  style,
  className,
  language = 'ko',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const flipValue = useSharedValue(isRevealed ? 180 : 0);

  // 사이즈별 스타일 정의 (레퍼런스 비율 유지: 2:3)
  const sizeStyles = {
    sm: { width: 80, height: 120, borderRadius: 8 },
    md: { width: 120, height: 180, borderRadius: 12 },
    lg: { width: 160, height: 240, borderRadius: 16 },
    xl: { width: 200, height: 300, borderRadius: 20 },
  };

  // 플립 애니메이션 처리
  const handleFlip = () => {
    if (isRevealed) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    flipValue.value = withTiming(180, { duration: 600 }, (finished) => {
      if (finished) {
        runOnJS(() => onReveal?.())();
      }
    });
  };

  // 프레스 핸들러
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    } else {
      handleFlip();
    }
  };

  // 앞면 애니메이션 스타일
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 180], [0, 180]);
    const opacity = interpolate(flipValue.value, [0, 90, 180], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // 뒷면 애니메이션 스타일
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 180], [180, 360]);
    const opacity = interpolate(flipValue.value, [0, 90, 180], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // 카드 뒷면 (레퍼런스의 보라색 그라데이션)
  const renderCardBack = () => (
    <Animated.View style={[frontAnimatedStyle, { position: 'absolute' }]}>
      <LinearGradient
        colors={[colorTokens.background.primary, colorTokens.background.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          sizeStyles[size],
          {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colorTokens.surface.border,
            shadowColor: colorTokens.brand.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        {/* 타로 카드 백 패턴 */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colorTokens.brand.secondary,
              marginBottom: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colorTokens.background.primary, fontSize: 20 }}>✨</Text>
          </View>
          
          <View
            style={{
              width: '80%',
              height: 3,
              backgroundColor: colorTokens.brand.secondary,
              borderRadius: 2,
            }}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // 카드 앞면 (실제 타로 카드 이미지)
  const renderCardFront = () => (
    <Animated.View style={[backAnimatedStyle, { position: 'absolute' }]}>
      <View
        style={[
          sizeStyles[size],
          {
            backgroundColor: '#000',
            borderRadius: sizeStyles[size].borderRadius,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: colorTokens.brand.secondary,
            shadowColor: colorTokens.brand.secondary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 12,
          },
        ]}
      >
        {/* 카드 이미지 */}
        <Image
          source={{ uri: card?.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' }}
          style={{
            width: '100%',
            flex: 1,
            resizeMode: 'cover',
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* 카드 정보 오버레이 */}
        {showInfo && card && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 12,
            }}
          >
            <Text 
              style={{
                color: colorTokens.text.primary,
                fontSize: size === 'sm' ? 10 : size === 'md' ? 12 : 14,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {language === 'ko' ? card.nameKr : card.name}
            </Text>
            
            {card.keywordsKr && size !== 'sm' && (
              <Text 
                style={{
                  color: colorTokens.brand.secondary,
                  fontSize: size === 'md' ? 10 : 11,
                  textAlign: 'center',
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {language === 'ko' ? card.keywordsKr.slice(0, 2).join(', ') : card.keywords?.slice(0, 2).join(', ')}
              </Text>
            )}
          </LinearGradient>
        )}
        
        {/* 로딩 인디케이터 */}
        {!imageLoaded && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorTokens.background.secondary,
          }}>
            <Text style={{ color: colorTokens.text.secondary }}>Loading...</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.95 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
      className={className}
    >
      <View style={[sizeStyles[size], { position: 'relative' }]}>
        {renderCardBack()}
        {renderCardFront()}
      </View>
    </Pressable>
  );
};

// 타로 카드 플레이스홀더
export const TarotCardPlaceholder: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}> = ({ size = 'md', style }) => {
  const sizeStyles = {
    sm: { width: 80, height: 120, borderRadius: 8 },
    md: { width: 120, height: 180, borderRadius: 12 },
    lg: { width: 160, height: 240, borderRadius: 16 },
    xl: { width: 200, height: 300, borderRadius: 20 },
  };

  return (
    <View
      style={[
        sizeStyles[size],
        {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderStyle: 'dashed',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: colorTokens.text.tertiary, fontSize: 12 }}>
        Empty Slot
      </Text>
    </View>
  );
};

// Export types
export type { TarotCardProps };