/**
 * 🌌 Mystical Gradient Components
 * Reusable gradient components for the mystical tarot experience
 */

import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewStyle } from 'react-native';
import { MysticalColors } from '../../tokens/mystical-colors';

interface GradientProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

// 🌌 Main Cosmic Background Gradient
export const CosmicBackgroundGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={MysticalColors.gradients.cosmicBackground}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]}
    style={[
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🔮 Enhanced Mystical Purple Gradient
export const MysticalPurpleGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={MysticalColors.gradients.mysticalPurple}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.25, 0.5, 0.75, 1]}
    style={[
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// ✨ Sacred Gold Gradient
export const SacredGoldGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={MysticalColors.gradients.sacredGold}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    locations={[0, 0.33, 0.66, 1]}
    style={[
      {
        borderRadius: 12,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🌟 Aurum Glow Gradient (for buttons)
export const AurumGlowGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={MysticalColors.gradients.auramGlow}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.5, 1]}
    style={[
      {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🎭 Card Overlay Gradient
export const CardOverlayGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    locations={[0, 0.6, 1]}
    style={[
      {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🌙 Hour Card Overlay Gradient
export const HourCardOverlayGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    locations={[0, 0.5, 1]}
    style={[
      {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 8,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 💫 Radial Glow Effect
export const RadialGlowGradient: React.FC<GradientProps & { color?: string }> = ({ 
  style, 
  children, 
  color = MysticalColors.sacred.premiumGold 
}) => (
  <LinearGradient
    colors={[
      color + '40',  // 40% opacity center
      color + '20',  // 20% opacity
      color + '10',  // 10% opacity
      'transparent'  // Transparent edge
    ]}
    start={{ x: 0.5, y: 0.5 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.3, 0.7, 1]}
    style={[
      {
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        borderRadius: 50,
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🎨 Glass Morphism Gradient
export const GlassMorphismGradient: React.FC<GradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={[
      'rgba(255, 255, 255, 0.15)',
      'rgba(255, 255, 255, 0.05)',
      'rgba(255, 255, 255, 0.1)'
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.5, 1]}
    style={[
      {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      style
    ]}
  >
    {children}
  </LinearGradient>
);

// 🌅 Dynamic Time-based Gradient
export const TimeBasedGradient: React.FC<GradientProps & { hour: number }> = ({ 
  style, 
  children, 
  hour 
}) => {
  // Generate gradient colors based on time of day
  const getTimeColors = (hour: number) => {
    if (hour >= 6 && hour < 12) {
      // Morning - lighter mystical colors
      return [
        MysticalColors.cosmic.celestialBright,
        MysticalColors.cosmic.luminousPurple,
        MysticalColors.cosmic.transcendent
      ];
    } else if (hour >= 12 && hour < 18) {
      // Afternoon - vibrant colors
      return [
        MysticalColors.cosmic.etherealMid,
        MysticalColors.cosmic.celestialBright,
        MysticalColors.cosmic.mysticalDepth
      ];
    } else if (hour >= 18 && hour < 22) {
      // Evening - warm transition
      return [
        MysticalColors.cosmic.voidPurple,
        MysticalColors.cosmic.etherealMid,
        MysticalColors.cosmic.deepSpace
      ];
    } else {
      // Night - deepest mystical
      return [
        MysticalColors.cosmic.deepSpace,
        MysticalColors.cosmic.voidPurple,
        MysticalColors.cosmic.transcendent
      ];
    }
  };

  return (
    <LinearGradient
      colors={getTimeColors(hour)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        style
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default {
  CosmicBackgroundGradient,
  MysticalPurpleGradient,
  SacredGoldGradient,
  AurumGlowGradient,
  CardOverlayGradient,
  HourCardOverlayGradient,
  RadialGlowGradient,
  GlassMorphismGradient,
  TimeBasedGradient,
};