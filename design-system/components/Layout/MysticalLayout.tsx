import React from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colorTokens, spacingTokens } from '../../tokens';

// Types
interface MysticalLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  showStatusBar?: boolean;
  statusBarStyle?: 'light' | 'dark';
  backgroundVariant?: 'primary' | 'secondary' | 'solid';
  padding?: boolean;
  className?: string;
  style?: ViewStyle;
}

/**
 * 메인 레이아웃 컴포넌트
 * 레퍼런스의 보라색 그라데이션 배경과 Safe Area 처리
 */
export const MysticalLayout: React.FC<MysticalLayoutProps> = ({
  children,
  scrollable = true,
  safeArea = true,
  showStatusBar = true,
  statusBarStyle = 'light',
  backgroundVariant = 'primary',
  padding = true,
  className,
  style,
}) => {
  const insets = useSafeAreaInsets();

  // 배경 그라데이션 설정
  const getBackgroundColors = () => {
    switch (backgroundVariant) {
      case 'primary':
        return [
          colorTokens.background.primary,   // #4A1A4F
          colorTokens.background.secondary, // #2D1B69
          colorTokens.background.tertiary,  // #1A1F3A
        ];
      case 'secondary':
        return [
          colorTokens.background.secondary,
          colorTokens.background.tertiary,
          colorTokens.background.primary,
        ];
      case 'solid':
        return [
          colorTokens.background.primary,
          colorTokens.background.primary,
        ];
      default:
        return [
          colorTokens.background.primary,
          colorTokens.background.secondary,
          colorTokens.background.tertiary,
        ];
    }
  };

  // 베이스 컨테이너 스타일
  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: safeArea ? insets.top : 0,
    paddingBottom: safeArea ? insets.bottom : 0,
    paddingLeft: safeArea ? insets.left : 0,
    paddingRight: safeArea ? insets.right : 0,
    ...style,
  };

  // 콘텐츠 스타일
  const contentStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: padding ? 20 : 0,
    paddingVertical: padding ? 16 : 0,
  };

  // 배경 렌더링
  const renderBackground = () => (
    <LinearGradient
      colors={getBackgroundColors()}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  );

  // 신비로운 패턴 오버레이 (선택사항)
  const renderMysticalPattern = () => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.1,
      }}
    >
      {/* CSS의 mystic-pattern과 유사한 효과 */}
      {Array.from({ length: 20 }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: colorTokens.brand.secondary,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </View>
  );

  // 스크롤 가능한 컨테이너
  const ScrollableContainer = ({ children }: { children: React.ReactNode }) => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={contentStyle}>
        {children}
      </View>
    </ScrollView>
  );

  // 고정 컨테이너  
  const FixedContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={contentStyle}>
      {children}
    </View>
  );

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container style={containerStyle} className={className}>
      {/* Status Bar */}
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
      )}

      {/* 배경 그라데이션 */}
      {renderBackground()}

      {/* 신비로운 패턴 */}
      {renderMysticalPattern()}

      {/* 메인 콘텐츠 */}
      {scrollable ? (
        <ScrollableContainer>{children}</ScrollableContainer>
      ) : (
        <FixedContainer>{children}</FixedContainer>
      )}
    </Container>
  );
};

// 섹션 컴포넌트
export const MysticalSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  spacing?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
}> = ({
  children,
  title,
  subtitle,
  spacing = 'md',
  centered = false,
  className,
}) => {
  const { View, Text } = require('react-native');
  
  const spacingMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <View
      style={{
        marginBottom: spacingMap[spacing],
        alignItems: centered ? 'center' : 'stretch',
      }}
      className={className}
    >
      {title && (
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: colorTokens.text.primary,
            textAlign: centered ? 'center' : 'left',
            marginBottom: subtitle ? 8 : 16,
          }}
        >
          {title}
        </Text>
      )}
      
      {subtitle && (
        <Text
          style={{
            fontSize: 16,
            color: colorTokens.text.secondary,
            textAlign: centered ? 'center' : 'left',
            marginBottom: 16,
            lineHeight: 24,
          }}
        >
          {subtitle}
        </Text>
      )}
      
      {children}
    </View>
  );
};

// 컨테이너 래퍼 
export const MysticalContainer: React.FC<{
  children: React.ReactNode;
  maxWidth?: number;
  centered?: boolean;
  padding?: boolean;
  className?: string;
}> = ({
  children,
  maxWidth = 600,
  centered = true,
  padding = true,
  className,
}) => {
  const { View } = require('react-native');
  
  return (
    <View
      style={{
        maxWidth,
        width: '100%',
        alignSelf: centered ? 'center' : 'flex-start',
        paddingHorizontal: padding ? 16 : 0,
      }}
      className={className}
    >
      {children}
    </View>
  );
};

// Export types
export type { MysticalLayoutProps };