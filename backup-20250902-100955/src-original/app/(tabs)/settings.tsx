import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Screen, Text } from '@/components';
import { theme, APP_CONFIG } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

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
  const [toggleStates, setToggleStates] = React.useState<Record<string, boolean>>({
    'hourly-notifications': false,
    'daily-reminder': true,
    'auto-save': true,
  });

  const handleToggle = (id: string, value: boolean) => {
    setToggleStates(prev => ({ ...prev, [id]: value }));
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
                          value={toggleStates[item.id] ?? false}
                          onValueChange={(value) => handleToggle(item.id, value)}
                          trackColor={{
                            false: theme.colors.mystical.border,
                            true: theme.colors.premiumGold + '40'
                          }}
                          thumbColor={
                            toggleStates[item.id]
                              ? theme.colors.premiumGold
                              : theme.colors.surface
                          }
                        />
                      ) : (
                        <Ionicons 
                          name={item.icon} 
                          size={20} 
                          color={theme.colors.textSecondary} 
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.appInfoText}>
            {APP_CONFIG.name} v{APP_CONFIG.version}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.appInfoText}>
            {APP_CONFIG.description}
          </Text>
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
});