import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows, layout } from '../../constants/DesignTokens';
import { TarotAnimations } from '../../constants/Animations';

export interface TabItem {
  id: string;
  label: string;
  icon?: string; // 이모지 또는 아이콘 문자
  badge?: number; // 뱃지 수
  disabled?: boolean;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabPress: (tabId: string) => void;
  variant?: 'default' | 'mystical' | 'minimal';
  size?: 'compact' | 'regular' | 'large';
  position?: 'bottom' | 'top';
  showBadges?: boolean;
  animated?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabPress,
  variant = 'default',
  size = 'regular',
  position = 'bottom',
  showBadges = true,
  animated = true,
  style,
  testID,
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'compact':
        return {
          height: 60,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          iconSize: typography.size.bodyMedium,
          labelSize: typography.size.caption,
          minTabWidth: 60,
        };
      case 'large':
        return {
          height: 80,
          paddingHorizontal: spacing['3xl'],
          paddingVertical: spacing.lg,
          iconSize: typography.size.titleMedium,
          labelSize: typography.size.bodyMedium,
          minTabWidth: 100,
        };
      default: // regular
        return {
          height: layout.tabBar.height,
          paddingHorizontal: spacing['2xl'],
          paddingVertical: spacing.md,
          iconSize: layout.tabBar.iconSize,
          labelSize: layout.tabBar.labelSize,
          minTabWidth: 80,
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'mystical':
        return {
          backgroundColor: colors.components.tabNavigation.backgroundColor,
          borderTopWidth: 1,
          borderTopColor: colors.primary.main,
          shadowColor: colors.primary.main,
          ...shadows.mystical,
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          shadowOpacity: 0,
        };
      default:
        return {
          backgroundColor: colors.components.tabNavigation.backgroundColor,
          borderTopWidth: colors.components.tabNavigation.borderTopWidth,
          borderTopColor: colors.components.tabNavigation.borderTopColor,
          ...shadows.medium,
        };
    }
  };

  const renderTabItem = (tab: TabItem, index: number) => {
    const isActive = tab.id === activeTabId;
    const sizeConfig = getSizeConfig();

    const animatedStyle = useAnimatedStyle(() => {
      const scale = animated && isActive 
        ? withTiming(1.05, { duration: TarotAnimations.timing.fast })
        : withTiming(1, { duration: TarotAnimations.timing.fast });

      const opacity = tab.disabled ? 0.5 : 1;

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    const handlePress = () => {
      if (tab.disabled) return;
      onTabPress(tab.id);
    };

    const getTabTextColor = (): string => {
      if (tab.disabled) return colors.text.quaternary;
      if (isActive) {
        return variant === 'mystical' 
          ? colors.primary.main 
          : colors.components.tabNavigation.tab.active.color;
      }
      return colors.components.tabNavigation.tab.inactive.color;
    };

    return (
      <AnimatedTouchableOpacity
        key={tab.id}
        style={[
          styles.tabItem,
          {
            minWidth: sizeConfig.minTabWidth,
            paddingVertical: colors.components.tabNavigation.tab.paddingVertical,
            paddingHorizontal: colors.components.tabNavigation.tab.paddingHorizontal,
          },
          animatedStyle,
        ]}
        onPress={handlePress}
        disabled={tab.disabled}
        activeOpacity={0.7}
        testID={`${testID}-tab-${tab.id}`}
      >
        {tab.icon && (
          <View style={styles.iconContainer}>
            <Text 
              style={[
                styles.tabIcon, 
                { 
                  fontSize: sizeConfig.iconSize,
                  color: getTabTextColor(),
                }
              ]}
            >
              {tab.icon}
            </Text>
            {showBadges && tab.badge && tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {tab.badge > 99 ? '99+' : tab.badge.toString()}
                </Text>
              </View>
            )}
          </View>
        )}
        
        <Text 
          style={[
            styles.tabLabel, 
            { 
              fontSize: sizeConfig.labelSize,
              color: getTabTextColor(),
              fontWeight: isActive ? typography.weight.medium : typography.weight.regular,
            }
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>

        {isActive && variant !== 'minimal' && (
          <View 
            style={[
              styles.activeIndicator, 
              { 
                backgroundColor: variant === 'mystical' 
                  ? colors.primary.main 
                  : colors.components.tabNavigation.tab.active.color 
              }
            ]} 
          />
        )}
      </AnimatedTouchableOpacity>
    );
  };

  const sizeConfig = getSizeConfig();
  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
        },
        variantStyles,
        position === 'top' && styles.topPosition,
        style,
      ]}
      testID={testID}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => renderTabItem(tab, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  topPosition: {
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  } as ViewStyle,

  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 600, // 큰 화면에서 탭이 너무 퍼지지 않도록
  } as ViewStyle,

  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    gap: spacing.xs,
  } as ViewStyle,

  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  tabIcon: {
    textAlign: 'center',
  } as TextStyle,

  tabLabel: {
    textAlign: 'center',
    lineHeight: undefined, // React Native가 계산하도록
  } as TextStyle,

  activeIndicator: {
    position: 'absolute',
    bottom: -spacing.sm,
    left: '25%',
    right: '25%',
    height: 2,
    borderRadius: radius.xs,
  } as ViewStyle,

  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.status.error,
    borderRadius: radius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  } as ViewStyle,

  badgeText: {
    fontSize: 10,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 12,
  } as TextStyle,
});

export default TabNavigation;