import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants';
import { Text } from './Text';

export interface TabItem {
  id: string;
  title: string;
  titleKo: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface TabBarProps {
  items: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  style?: ViewStyle;
}

/**
 * Bottom Tab Bar Component matching design references
 * Features dark purple background with golden accents
 */
export function TabBar({ items, activeTab, onTabPress, style }: TabBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabBar}>
        {items.map((item) => {
          const isActive = item.id === activeTab;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => onTabPress(item.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={item.titleKo}
              accessibilityState={{ selected: isActive }}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </View>
              
              <Text
                variant="caption"
                color={isActive ? theme.colors.premiumGold : theme.colors.textSecondary}
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {item.titleKo}
              </Text>
              
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Individual Tab Item Component
 */
interface TabBarItemProps {
  item: TabItem;
  isActive: boolean;
  onPress: () => void;
}

export function TabBarItem({ item, isActive, onPress }: TabBarItemProps) {
  return (
    <TouchableOpacity
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={item.titleKo}
      accessibilityState={{ selected: isActive }}
    >
      <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
        {isActive && item.activeIcon ? item.activeIcon : item.icon}
      </View>
      
      <Text
        variant="caption"
        color={isActive ? theme.colors.premiumGold : theme.colors.textSecondary}
        style={[styles.tabLabel, isActive && styles.tabLabelActive]}
      >
        {item.titleKo}
      </Text>
      
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.md, // Extra padding for safe area
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    minHeight: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    position: 'relative',
    minHeight: 50,
  },
  tabItemActive: {
    // Active state styling handled by children components
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  iconContainerActive: {
    // Enhanced active icon styling
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  tabLabelActive: {
    fontWeight: '600',
    // Golden text color handled by Text component
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 2,
    backgroundColor: theme.colors.premiumGold,
    borderRadius: 1,
  },
});