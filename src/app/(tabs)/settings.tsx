import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Screen, Text, Button } from '@/components';
import { theme, APP_CONFIG } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, useSettingsState, useSettingsActions } from '@/contexts/SettingsContext';

const settingsData = [
  {
    section: '알림',
    items: [
      {
        id: 'hourly-notifications',
        title: '시간별 알림',
        description: '새로운 카드마다 알림 받기',
        type: 'toggle' as const,
        value: false,
      },
      {
        id: 'daily-reminder',
        title: '일일 알림',
        description: '카드 확인 알림',
        type: 'toggle' as const,
        value: true,
      },
    ],
  },
  {
    section: '리딩 설정',
    items: [
      {
        id: 'deck-selection',
        title: '활성 덱',
        description: '클래식 타로',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'auto-save',
        title: '자동 저장',
        description: '완료된 리딩 자동 저장',
        type: 'toggle' as const,
        value: true,
      },
    ],
  },
  {
    section: '앱 설정',
    items: [
      {
        id: 'theme',
        title: '테마',
        description: '라이트',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'data-backup',
        title: '백업 및 복원',
        description: '리딩 데이터 관리',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
    ],
  },
  {
    section: '지원',
    items: [
      {
        id: 'help',
        title: '도움말 및 FAQ',
        description: '앱 사용 도움 받기',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'feedback',
        title: '피드백 보내기',
        description: '앱 개선에 도움 주기',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
    ],
  },
];

export default function SettingsScreen() {
  const { state } = useSettings();
  const { 
    loadSettings, 
    toggleNotifications, 
    toggleHourlyNotifications, 
    toggleDailyReminder,
    updateSetting,
    setTheme,
    resetToDefaults
  } = useSettingsActions();

  // 설정 로드
  useEffect(() => {
    loadSettings().catch((error) => {
      console.error('Failed to load settings:', error);
      Alert.alert('설정 로드 실패', '설정을 불러올 수 없습니다.');
    });
  }, [loadSettings]);

  const handleToggle = async (id: string, value: boolean) => {
    try {
      switch (id) {
        case 'hourly-notifications':
          await toggleHourlyNotifications(value);
          break;
        case 'daily-reminder':
          await toggleDailyReminder(value);
          break;
        case 'auto-save':
          await updateSetting('autoSaveReadings', value);
          break;
        default:
          await toggleNotifications(value);
      }
    } catch (error) {
      Alert.alert('설정 저장 실패', '설정을 저장할 수 없습니다.');
    }
  };

  const handleThemeChange = async () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    try {
      await setTheme(newTheme);
      Alert.alert('테마 변경', `${newTheme === 'light' ? '라이트' : '다크'} 모드로 변경되었습니다.`);
    } catch (error) {
      Alert.alert('테마 변경 실패', '테마를 변경할 수 없습니다.');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      '설정 초기화',
      '모든 설정을 기본값으로 되돌리시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '초기화', 
          style: 'destructive',
          onPress: async () => {
            try {
              await resetToDefaults();
              Alert.alert('초기화 완료', '모든 설정이 기본값으로 복원되었습니다.');
            } catch (error) {
              Alert.alert('초기화 실패', '설정을 초기화할 수 없습니다.');
            }
          }
        }
      ]
    );
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="title2" style={styles.title}>
            설정
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            타로 경험을 맞춤 설정하세요
          </Text>
        </View>

        {settingsData.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text variant="title3" style={styles.sectionTitle}>
              {section.section}
            </Text>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index === section.items.length - 1 && styles.lastItem,
                  ]}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                  disabled={item.type === 'toggle'}
                >
                  <View style={styles.settingContent}>
                    <View style={styles.settingText}>
                      <Text variant="body">{item.title}</Text>
                      <Text variant="caption" color={theme.colors.textSecondary}>
                        {item.description}
                      </Text>
                    </View>
                    
                    <View style={styles.settingControl}>
                      {item.type === 'toggle' ? (
                        <Switch
                          value={
                            item.id === 'hourly-notifications' ? state.hourlyNotifications :
                            item.id === 'daily-reminder' ? state.dailyReminder :
                            item.id === 'auto-save' ? state.autoSaveReadings :
                            state.notificationsEnabled
                          }
                          onValueChange={(value) => handleToggle(item.id, value)}
                          trackColor={{
                            false: theme.colors.mystical.border,
                            true: theme.colors.premiumGold + '40'
                          }}
                          thumbColor={
                            (item.id === 'hourly-notifications' ? state.hourlyNotifications :
                             item.id === 'daily-reminder' ? state.dailyReminder :
                             item.id === 'auto-save' ? state.autoSaveReadings :
                             state.notificationsEnabled)
                              ? theme.colors.premiumGold
                              : theme.colors.surface
                          }
                          disabled={state.isLoading}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={
                            item.id === 'theme' ? handleThemeChange : 
                            undefined
                          }
                          disabled={state.isLoading}
                        >
                          <Ionicons 
                            name={item.icon} 
                            size={20} 
                            color={theme.colors.textSecondary} 
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 현재 테마 정보 */}
        <View style={styles.currentStateSection}>
          <Text variant="h4" style={styles.stateTitle}>
            현재 설정
          </Text>
          <View style={styles.stateInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              테마: {state.theme === 'light' ? '라이트 모드' : '다크 모드'}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              언어: {state.language === 'ko' ? '한국어' : 'English'}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              선택된 덱: {state.selectedDeckId}
            </Text>
          </View>
        </View>

        {/* 설정 리셋 버튼 */}
        <View style={styles.resetSection}>
          <Button
            title="설정 초기화"
            onPress={handleResetSettings}
            style={styles.resetButton}
            variant="outline"
            disabled={state.isLoading}
          />
        </View>

        {/* 에러 표시 */}
        {state.error && (
          <View style={styles.errorSection}>
            <Text variant="caption" color={theme.colors.error}>
              오류: {state.error}
            </Text>
          </View>
        )}

        <View style={styles.appInfo}>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.appInfoText}>
            {APP_CONFIG.name} v{APP_CONFIG.version}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.appInfoText}>
            {APP_CONFIG.description}
          </Text>
          {state.isLoading && (
            <Text variant="caption" color={theme.colors.premiumGold} style={styles.appInfoText}>
              설정을 저장하는 중...
            </Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.premiumGold,
    fontWeight: '600',
    letterSpacing: -0.5, // 한국어 최적화
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
    overflow: 'hidden',
    // 신비로운 그림자 효과
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  settingText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  settingControl: {
    marginLeft: theme.spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  appInfoText: {
    textAlign: 'center',
  },
  bottomPadding: {
    height: theme.spacing.xl,
  },
  currentStateSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.mystical.border,
  },
  stateTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.premiumGold,
    fontWeight: '600',
  },
  stateInfo: {
    gap: theme.spacing.xs,
  },
  resetSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resetButton: {
    minWidth: 140,
  },
  errorSection: {
    backgroundColor: theme.colors.error + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
  },
});