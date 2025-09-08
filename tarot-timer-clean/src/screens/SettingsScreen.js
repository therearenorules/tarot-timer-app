import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground, MysticalButton } from '../components/ui';
import { colors } from '../utils/colors';
import { spacing, typography, borderRadius, shadows } from '../utils/styles';

export const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    darkMode: true,
    language: 'ko',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@tarot_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('@tarot_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleToggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleResetData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 저장된 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@tarot_journal_entries',
                '@tarot_settings'
              ]);
              Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
              // Reset to default settings
              const defaultSettings = {
                notifications: true,
                sound: true,
                vibration: true,
                darkMode: true,
                language: 'ko',
              };
              setSettings(defaultSettings);
            } catch (error) {
              Alert.alert('오류', '데이터 삭제 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  const renderSettingItem = (icon, title, description, value, onToggle) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={colors.dark.accent} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.dark.border, true: colors.dark.accent }}
        thumbColor={value ? colors.dark.foreground : colors.dark.secondaryForeground}
      />
    </View>
  );

  const renderInfoItem = (icon, title, value) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={colors.dark.secondaryForeground} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="settings" size={48} color={colors.dark.accent} />
          </View>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>앱 설정을 관리하세요</Text>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>일반 설정</Text>
            
            {renderSettingItem(
              'notifications',
              '알림',
              '타로 알림을 받습니다',
              settings.notifications,
              () => handleToggleSetting('notifications')
            )}
            
            {renderSettingItem(
              'volume-high',
              '소리',
              '효과음을 재생합니다',
              settings.sound,
              () => handleToggleSetting('sound')
            )}
            
            {renderSettingItem(
              'phone-portrait',
              '진동',
              '피드백 진동을 사용합니다',
              settings.vibration,
              () => handleToggleSetting('vibration')
            )}
            
            {renderSettingItem(
              'moon',
              '다크 모드',
              '어두운 테마를 사용합니다',
              settings.darkMode,
              () => handleToggleSetting('darkMode')
            )}
          </View>

          {/* App Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>앱 정보</Text>
            
            <View style={styles.infoCard}>
              {renderInfoItem('phone-portrait', '앱 버전', '1.0.0')}
              {renderInfoItem('code-working', '빌드 번호', '2024.01')}
              {renderInfoItem('language', '언어', '한국어')}
              {renderInfoItem('calendar', '출시일', '2024년 1월')}
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>데이터 관리</Text>
            
            <View style={styles.dataSection}>
              <View style={styles.warningCard}>
                <Ionicons 
                  name="warning" 
                  size={24} 
                  color={colors.dark.accent} 
                  style={styles.warningIcon}
                />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>데이터 초기화</Text>
                  <Text style={styles.warningDescription}>
                    모든 일기 기록과 설정이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </Text>
                </View>
              </View>

              <MysticalButton
                variant="secondary"
                onPress={handleResetData}
                style={styles.resetButton}
              >
                모든 데이터 삭제
              </MysticalButton>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>소개</Text>
            
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Tarot Timer</Text>
              <Text style={styles.aboutDescription}>
                24시간 타로 타이머는 매 시간마다 새로운 타로 카드와 함께 
                특별한 메시지를 전달하는 신비로운 앱입니다.
              </Text>
              <Text style={styles.aboutDescription}>
                타로의 지혜를 통해 일상에 영감과 통찰을 더해보세요.
              </Text>
              <View style={styles.aboutFooter}>
                <Text style={styles.aboutCredits}>
                  Made with ❤️ for Tarot lovers
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerIcon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.accent,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Section Styles
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginBottom: spacing.md,
  },

  // Setting Item Styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyLarge,
    color: colors.dark.foreground,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
  },

  // Info Card Styles
  infoCard: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...shadows.small,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.dark.foreground,
    fontWeight: '500',
  },

  // Data Management Styles
  dataSection: {
    gap: spacing.md,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    ...shadows.small,
  },
  warningIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    ...typography.titleMedium,
    color: colors.dark.accent,
    marginBottom: spacing.xs,
  },
  warningDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    lineHeight: 20,
  },
  resetButton: {
    alignSelf: 'center',
    minWidth: 160,
  },

  // About Card Styles
  aboutCard: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: borderRadius.medium,
    padding: spacing.xl,
    ...shadows.small,
  },
  aboutTitle: {
    ...typography.titleLarge,
    color: colors.dark.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  aboutDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  aboutFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  aboutCredits: {
    ...typography.bodyMedium,
    color: colors.dark.accent,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});