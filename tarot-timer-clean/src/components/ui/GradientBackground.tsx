import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { MysticalParticles } from './MysticalParticles';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showParticles?: boolean;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  style, 
  showParticles = true 
}) => {
  const { theme } = useTheme();
  
  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {showParticles && <MysticalParticles particleCount={12} />}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});