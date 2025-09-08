/**
 * TarotImage - React Native용 이미지 컴포넌트
 * SVG 및 PNG 이미지를 처리하고 테마 적응
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { theme } from '@/constants';
import { 
  TarotCardBack, 
  CardPlaceholder, 
  AppLogoMain, 
  AppLogoIcon, 
  SacredGeometryPattern,
  MysticalTextureLight,
  MysticalTextureDark,
  SparkleEffect,
  ImageName 
} from '../../../assets/images';

interface TarotImageProps {
  name: ImageName;
  width?: number;
  height?: number;
  style?: ViewStyle;
  color?: string;
}

// 이미지 매핑
const IMAGE_MAP = {
  'tarot-card-back': TarotCardBack,
  'card-placeholder': CardPlaceholder,
  'app-logo-main': AppLogoMain,
  'app-logo-icon': AppLogoIcon,
  'sacred-geometry-pattern': SacredGeometryPattern,
  'mystical-texture-light': MysticalTextureLight,
  'mystical-texture-dark': MysticalTextureDark,
  'sparkle-effect': SparkleEffect,
};

export const TarotImage: React.FC<TarotImageProps> = ({
  name,
  width = 100,
  height = 100,
  style,
  color
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // 다크 모드에 따른 텍스처 선택
  const getImageSource = (imageName: ImageName) => {
    if (imageName === 'mystical-texture-light' && isDark) {
      return IMAGE_MAP['mystical-texture-dark'];
    }
    if (imageName === 'mystical-texture-dark' && !isDark) {
      return IMAGE_MAP['mystical-texture-light'];
    }
    return IMAGE_MAP[imageName];
  };

  const imageSource = getImageSource(name);

  // SVG 색상 적용 (필요한 경우)
  const svgColor = color || theme.colors.text;

  return (
    <View style={[styles.container, style]}>
      <SvgXml 
        xml={imageSource} 
        width={width} 
        height={height}
        color={svgColor}
      />
    </View>
  );
};

// 특별한 이미지 컴포넌트들
export const TarotCardBackImage: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="tarot-card-back" {...props} />
);

export const AppLogo: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="app-logo-main" {...props} />
);

export const SparkleEffectImage: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="sparkle-effect" {...props} />
);

export const MysticalBackground: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="sacred-geometry-pattern" {...props} />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});