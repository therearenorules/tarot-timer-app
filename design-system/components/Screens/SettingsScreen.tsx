import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MysticalLayout, MysticalSection, MysticalContainer } from '../Layout/MysticalLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { Switch, SwitchGroup } from '../Switch/Switch';
import { colorTokens } from '../../tokens';

// Types
interface SettingsScreenProps {
  language?: 'ko' | 'en';
  darkMode?: boolean;
  notifications?: boolean;
  premiumActive?: boolean;
  onLanguageChange?: (lang: 'ko' | 'en') => void;
  onDarkModeToggle?: (enabled: boolean) => void;
  onNotificationsToggle?: (enabled: boolean) => void;
  onManagePremium?: () => void;
}

/**
 * 설정 화면 컴포넌트
 * 레퍼런스 setting01.png 디자인을 정확히 구현
 */
export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language = 'ko',
  darkMode = true,
  notifications = true,
  premiumActive = true,
  onLanguageChange,
  onDarkModeToggle,
  onNotificationsToggle,
  onManagePremium,
}) => {
  // 헤더 렌더링
  const renderHeader = () => (
    <MysticalSection centered spacing="lg">
      {/* 설정 아이콘 */}
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colorTokens.brand.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 28, color: colorTokens.background.primary }}>⚙️</Text>
      </View>

      {/* 타이틀 */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: '700',
          color: colorTokens.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Settings
      </Text>

      {/* 서브타이틀 */}
      <Text
        style={{
          fontSize: 16,
          color: colorTokens.text.secondary,
          textAlign: 'center',
        }}
      >
        당신의 신비로운 경험을 설정해보세요
      </Text>
    </MysticalSection>
  );

  // 프리미엄 섹션
  const renderPremiumSection = () => (
    <MysticalSection spacing="md">
      <Card variant="glass" size="md">
        <CardContent>
          <View style={{ paddingVertical: 8 }}>
            {/* 프리미엄 헤더 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colorTokens.brand.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: colorTokens.background.primary }}>👑</Text>
                </View>
                
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colorTokens.text.primary,
                  }}
                >
                  프리미엄 멤버십
                </Text>
              </View>

              {/* 활성화 배지 */}
              <View
                style={{
                  backgroundColor: colorTokens.brand.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colorTokens.background.primary,
                  }}
                >
                  활성화
                </Text>
              </View>
            </View>

            {/* 프리미엄 혜택 */}
            <View style={{ marginBottom: 20 }}>
              {[
                '프리미엄 스프레드 접근',
                '광고 없는 경험',
                '무제한 저장공간',
              ].map((benefit, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: colorTokens.brand.secondary,
                      marginRight: 8,
                      fontSize: 16,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colorTokens.text.secondary,
                    }}
                  >
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>

            {/* 관리 버튼 */}
            <Button
              variant="outline"
              size="md"
              fullWidth
              onPress={onManagePremium}
            >
              프리미엄 관리
            </Button>
          </View>
        </CardContent>
      </Card>
    </MysticalSection>
  );

  // 화면 & 테마 섹션
  const renderDisplaySection = () => (
    <MysticalSection spacing="md">
      <Card variant="glass" size="md">
        <CardContent>
          <View style={{ paddingVertical: 8 }}>
            {/* 섹션 헤더 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: colorTokens.brand.secondary }}>🌙</Text>
              </View>
              
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colorTokens.text.primary,
                }}
              >
                화면 및 테마
              </Text>
            </View>

            {/* 다크 모드 스위치 */}
            <SwitchGroup
              label="다크 모드"
              description="Always on for mystical experience"
              value={darkMode}
              onValueChange={onDarkModeToggle || (() => {})}
            />

            {/* 언어 선택 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colorTokens.text.primary,
                  }}
                >
                  언어
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colorTokens.brand.secondary,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colorTokens.background.primary,
                  }}
                >
                  한국어
                </Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </MysticalSection>
  );

  // 알림 섹션
  const renderNotificationSection = () => (
    <MysticalSection spacing="md">
      <Card variant="glass" size="md">
        <CardContent>
          <View style={{ paddingVertical: 8 }}>
            {/* 섹션 헤더 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: colorTokens.brand.secondary }}>🔔</Text>
              </View>
              
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colorTokens.text.primary,
                }}
              >
                알림
              </Text>
            </View>

            {/* 스프레드 완료 알림 */}
            <SwitchGroup
              label="스프레드 완료"
              description="카드 리딩이 완료되면 알림"
              value={notifications}
              onValueChange={onNotificationsToggle || (() => {})}
            />
          </View>
        </CardContent>
      </Card>
    </MysticalSection>
  );

  return (
    <MysticalLayout
      safeArea={true}
      scrollable={true}
      backgroundVariant="primary"
      padding={true}
    >
      <MysticalContainer maxWidth={400} centered>
        {renderHeader()}
        {renderPremiumSection()}
        {renderDisplaySection()}
        {renderNotificationSection()}
        
        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </MysticalContainer>
    </MysticalLayout>
  );
};

// Export types
export type { SettingsScreenProps };