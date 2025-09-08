import { Tabs } from 'expo-router';
import React from 'react';
import { ClockIcon, Icon, SettingsIcon } from '@/components/ui/Icon';
import { theme } from '@/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: `${theme.colors.border}80`,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: theme.colors.premiumGold,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: '타이머',
          tabBarIcon: ({ color, focused, size }) => (
            <ClockIcon 
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="spreads" 
        options={{ 
          title: '스프레드',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name="layout"
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="diary" 
        options={{ 
          title: '일기',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name="book-open"
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: '설정',
          tabBarIcon: ({ color, focused, size }) => (
            <SettingsIcon 
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="ui-demo" 
        options={{ 
          title: 'UI데모',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name="star"
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="timer-demo" 
        options={{ 
          title: '타이머2',
          href: null, // Hide from tab bar, accessible via navigation
        }} 
      />
      <Tabs.Screen 
        name="dev-tools" 
        options={{ 
          title: '개발도구',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name="settings"
              size={size || 24} 
              color={color} 
            />
          ),
        }} 
      />
    </Tabs>
  );
}