import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../utils/styles';

export const JournalScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  return (
    <GradientBackground>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="book" size={48} color={colors.accent} />
            <Text style={styles.title}>타로 다이어리</Text>
            <Text style={styles.subtitle}>매일의 타로 기록을 남겨보세요</Text>
          </View>
          
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>곧 추가될 예정입니다</Text>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...(typography.displayLarge as any),
    color: colors.foreground,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    ...(typography.bodyMedium as any),
    color: colors.secondaryForeground,
    textAlign: 'center',
  },
  comingSoon: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
  },
  comingSoonText: {
    ...(typography.bodyLarge as any),
    color: colors.secondaryForeground,
    textAlign: 'center',
  },
});