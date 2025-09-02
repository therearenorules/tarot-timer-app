import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  mysticalBackground?: boolean; // Add mystical gradient background option
}

export function Screen({
  children,
  backgroundColor = theme.colors.background,
  edges = ['top', 'bottom', 'left', 'right'],
  mysticalBackground = false
}: ScreenProps) {
  const containerStyle = [
    styles.container,
    mysticalBackground ? { backgroundColor: 'transparent' } : { backgroundColor }
  ];

  const contentStyle = [
    styles.content,
    mysticalBackground ? { backgroundColor: 'transparent' } : { backgroundColor }
  ];

  return (
    <SafeAreaView
      style={containerStyle}
      edges={edges}
    >
      <View style={contentStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
});