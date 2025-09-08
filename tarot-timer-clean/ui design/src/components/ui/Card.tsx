import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { globalStyles } from '../../utils/styles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: boolean;
  variant?: 'default' | 'mystical';
}

export default function Card({ children, style, blur = false, variant = 'default' }: CardProps) {
  if (blur) {
    return (
      <BlurView intensity={20} style={[styles.container, style]}>
        <View style={[styles.content, variant === 'mystical' && styles.mysticalContent]}>
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[
      styles.container, 
      variant === 'mystical' ? globalStyles.mysticalCard : globalStyles.card,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  mysticalContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
});