import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../utils/styles';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  return (
    <GradientBackground>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="settings" size={48} color={colors.accent} />
            <Text style={styles.title}>설정</Text>
            <Text style={styles.subtitle}>앱 설정을 관리해보세요</Text>
          </View>
          
          <View style={styles.settingsContainer}>
            {/* Theme Setting */}
            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingLeft}>
                <Ionicons 
                  name={isDark ? "moon" : "sunny"} 
                  size={24} 
                  color={colors.accent} 
                  style={styles.settingIcon} 
                />
                <View>
                  <Text style={styles.settingTitle}>테마</Text>
                  <Text style={styles.settingDescription}>
                    {isDark ? '다크 모드' : '라이트 모드'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={isDark ? colors.background : colors.foreground}
              />
            </TouchableOpacity>

            {/* Other Settings Placeholder */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons 
                  name="notifications" 
                  size={24} 
                  color={colors.secondaryForeground} 
                  style={styles.settingIcon} 
                />
                <View>
                  <Text style={styles.settingTitle}>알림</Text>
                  <Text style={styles.settingDescription}>곧 추가될 예정</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons 
                  name="language" 
                  size={24} 
                  color={colors.secondaryForeground} 
                  style={styles.settingIcon} 
                />
                <View>
                  <Text style={styles.settingTitle}>언어</Text>
                  <Text style={styles.settingDescription}>곧 추가될 예정</Text>
                </View>
              </View>
            </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: 20,
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
  settingsContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingTitle: {
    ...(typography.bodyLarge as any),
    color: colors.foreground,
    fontWeight: '600',
  },
  settingDescription: {
    ...(typography.bodySmall as any),
    color: colors.secondaryForeground,
    marginTop: 2,
  },
});