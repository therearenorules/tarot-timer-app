import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { colors, typography, spacing, shadows } from '../constants/DesignTokens';
import { GradientBackground } from '../components/ui';

export interface SettingsScreenProps {}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  icon?: string;
  badge?: string;
}

const settingsData: SettingItem[] = [
  {
    id: 'notifications',
    title: '알림 설정',
    description: '타로 타이머 및 스프레드 알림',
    type: 'toggle',
    value: true,
    icon: '🔔',
  },
  {
    id: 'soundEffects',
    title: '효과음',
    description: '카드 뽑기 및 타이머 소리',
    type: 'toggle',
    value: true,
    icon: '🔊',
  },
  {
    id: 'mysticalAnimations',
    title: 'Mystical 애니메이션',
    description: '카드 및 UI 신비로운 애니메이션',
    type: 'toggle',
    value: true,
    icon: '✨',
  },
  {
    id: 'autoSave',
    title: '자동 저장',
    description: '메모 및 일기 자동 저장',
    type: 'toggle',
    value: true,
    icon: '💾',
  },
  {
    id: 'dataBackup',
    title: '데이터 백업',
    description: '클라우드 백업 및 복원',
    type: 'action',
    icon: '☁️',
  },
  {
    id: 'cardPack',
    title: '카드팩 관리',
    description: '타로 카드 테마 및 스타일 변경',
    type: 'navigation',
    icon: '🃏',
    badge: 'Premium',
  },
  {
    id: 'statistics',
    title: '통계 보기',
    description: '타로 사용 기록 및 분석',
    type: 'navigation',
    icon: '📊',
  },
  {
    id: 'privacy',
    title: '개인정보 처리방침',
    description: '개인정보 보호 및 이용약관',
    type: 'action',
    icon: '🔒',
  },
  {
    id: 'support',
    title: '고객지원',
    description: '문의하기 및 피드백',
    type: 'action',
    icon: '💬',
  },
  {
    id: 'about',
    title: '앱 정보',
    description: '버전 정보 및 개발자 정보',
    type: 'navigation',
    icon: 'ℹ️',
  },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    soundEffects: true,
    mysticalAnimations: true,
    autoSave: true,
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleToggleSetting = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  const handleActionPress = (settingId: string) => {
    switch (settingId) {
      case 'dataBackup':
        Alert.alert(
          '데이터 백업',
          '클라우드 백업을 시작하시겠습니까?\n\n모든 타로 기록과 메모가 안전하게 백업됩니다.',
          [
            { text: '취소', style: 'cancel' },
            { text: '백업하기', onPress: () => console.log('백업 시작') },
          ]
        );
        break;
      case 'privacy':
        Alert.alert(
          '개인정보 처리방침',
          '개인정보 처리방침 페이지를 열겠습니다.',
          [{ text: '확인' }]
        );
        break;
      case 'support':
        Alert.alert(
          '고객지원',
          '문의사항이 있으시면 support@tarottimer.app 으로 연락주세요.',
          [{ text: '확인' }]
        );
        break;
      default:
        console.log(`${settingId} 액션 실행`);
    }
  };

  const handleNavigationPress = (settingId: string) => {
    switch (settingId) {
      case 'cardPack':
        Alert.alert(
          '카드팩 관리',
          'Premium 기능입니다.\n\n다양한 타로 카드 테마와 스타일을 선택할 수 있습니다.',
          [{ text: '확인' }]
        );
        break;
      case 'statistics':
        Alert.alert(
          '통계 보기',
          '타로 사용 통계 화면으로 이동합니다.',
          [{ text: '확인' }]
        );
        break;
      case 'about':
        Alert.alert(
          '앱 정보',
          'Tarot Timer App v1.0.0\n\n24시간 타로 타이머와 스프레드 기능을 제공하는 앱입니다.',
          [{ text: '확인' }]
        );
        break;
      default:
        console.log(`${settingId} 네비게이션 실행`);
    }
  };

  const renderSettingItem = (item: SettingItem) => {
    const isPremium = item.badge === 'Premium';
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          {
            backgroundColor: colors.background.secondary,
            borderRadius: 16,
            padding: spacing.lg,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: isPremium ? `${colors.primary.main}40` : `${colors.text.secondary}20`,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          shadows.medium,
          isPremium && {
            backgroundColor: `${colors.primary.main}10`,
            shadowColor: colors.primary.main,
          },
        ]}
        onPress={() => {
          if (item.type === 'action') {
            handleActionPress(item.id);
          } else if (item.type === 'navigation') {
            handleNavigationPress(item.id);
          }
        }}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {/* Icon */}
          <View
            style={{
              width: 48,
              height: 48,
              backgroundColor: isPremium ? `${colors.primary.main}20` : `${colors.text.secondary}10`,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text
                style={[
                  typography.bodyMedium,
                  { color: colors.text.primary, flex: 1 }
                ]}
              >
                {item.title}
              </Text>
              {item.badge && (
                <View
                  style={{
                    backgroundColor: `${colors.primary.main}30`,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: `${colors.primary.main}50`,
                    marginLeft: spacing.sm,
                  }}
                >
                  <Text
                    style={[
                      typography.caption,
                      { color: colors.primary.main }
                    ]}
                  >
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.text.secondary }
              ]}
            >
              {item.description}
            </Text>
          </View>
        </View>

        {/* Control */}
        <View style={{ marginLeft: spacing.md }}>
          {item.type === 'toggle' ? (
            <Switch
              value={settings[item.id] ?? false}
              onValueChange={() => handleToggleSetting(item.id)}
              trackColor={{
                false: colors.text.secondary + '30',
                true: colors.primary.main + '50',
              }}
              thumbColor={
                settings[item.id] ? colors.primary.main : colors.text.secondary
              }
            />
          ) : (
            <View
              style={{
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.text.secondary,
                  transform: [{ rotate: '90deg' }],
                }}
              >
                ⌄
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground variant="main" style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'transparent',
            opacity: fadeAnim,
          },
        ]}
      >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={[
              typography.titleLarge,
              {
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: spacing.sm,
              }
            ]}
          >
            설정
          </Text>
          <Text
            style={[
              typography.bodyMedium,
              {
                color: colors.text.secondary,
                textAlign: 'center',
              }
            ]}
          >
            앱 설정을 관리하세요
          </Text>
        </View>

        {/* App Settings Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: spacing.xs }}>⚙️</Text>
            <Text
              style={[
                typography.titleMedium,
                { color: colors.primary.main }
              ]}
            >
              앱 설정
            </Text>
          </View>

          {settingsData.slice(0, 4).map(renderSettingItem)}
        </View>

        {/* Data & Premium Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: spacing.xs }}>💎</Text>
            <Text
              style={[
                typography.titleMedium,
                { color: colors.primary.main }
              ]}
            >
              데이터 & 프리미엄
            </Text>
          </View>

          {settingsData.slice(4, 7).map(renderSettingItem)}
        </View>

        {/* Support & Info Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: spacing.xs }}>📞</Text>
            <Text
              style={[
                typography.titleMedium,
                { color: colors.primary.main }
              ]}
            >
              지원 & 정보
            </Text>
          </View>

          {settingsData.slice(7).map(renderSettingItem)}
        </View>

        {/* Footer */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: `${colors.text.secondary}20`,
          }}
        >
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary, textAlign: 'center' }
            ]}
          >
            🔮 Tarot Timer App 🔮
          </Text>
          <Text
            style={[
              typography.caption,
              {
                color: colors.text.secondary,
                textAlign: 'center',
                marginTop: spacing.xs,
              }
            ]}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
      </Animated.View>
    </GradientBackground>
  );
};