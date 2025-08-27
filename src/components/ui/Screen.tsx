import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function Screen({ 
  children, 
  backgroundColor = theme.colors.background,
  edges = ['top', 'bottom', 'left', 'right']
}: ScreenProps) {
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]}
      edges={edges}
    >
      <View style={[styles.content, { backgroundColor }]}>
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