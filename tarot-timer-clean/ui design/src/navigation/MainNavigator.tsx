import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import TimerScreen from '../screens/TimerScreen';
import SpreadsScreen from '../screens/SpreadsScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SpreadDetailScreen from '../screens/SpreadDetailScreen';
import DailyTarotViewerScreen from '../screens/DailyTarotViewerScreen';

import { ClockIcon, LayoutIcon, BookOpenIcon, SettingsIcon } from '../components/icons';
import { colors } from '../utils/colors';
import { useLanguage } from '../contexts/LanguageContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderTopColor: 'rgba(212, 175, 55, 0.2)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 75,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.dark.premiumGold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{
          tabBarLabel: t('nav.timer'),
          tabBarIcon: ({ color, size }) => (
            <ClockIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Spreads" 
        component={SpreadsScreen}
        options={{
          tabBarLabel: t('nav.spreads'),
          tabBarIcon: ({ color, size }) => (
            <LayoutIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarLabel: t('nav.journal'),
          tabBarIcon: ({ color, size }) => (
            <BookOpenIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: t('nav.settings'),
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1a1f3a" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="SpreadDetail" component={SpreadDetailScreen} />
        <Stack.Screen name="DailyTarotViewer" component={DailyTarotViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}