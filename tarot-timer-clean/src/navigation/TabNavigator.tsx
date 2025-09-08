import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { ClockIcon, LayoutIcon, BookOpenIcon, SettingsIcon } from '../../assets/icons';

import { colors, gradients } from '../utils/colors';
import { spacing } from '../utils/styles';
import { TimerScreen } from '../screens/TimerScreen';
import { SpreadsScreen } from '../screens/SpreadsScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {

          let iconName;
          if (route.name === 'Timer') {
            iconName = 'time-outline';
          } else if (route.name === 'Spreads') {
            iconName = 'grid-outline';
          } else if (route.name === 'Journal') {
            iconName = 'book-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons 
                name={iconName as any}
                size={size} 
                color={color}
                style={{ 
                  opacity: focused ? 1 : 0.7,
                  transform: [{ scale: focused ? 1.1 : 1 }]
                }}
              />
            </View>
          );
        },
        tabBarActiveTintColor: colors.dark.accent,
        tabBarInactiveTintColor: colors.dark.secondaryForeground,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={gradients.mystical as any}
            style={StyleSheet.absoluteFillObject}
          />
        ),
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{
          tabBarLabel: '타이머',
        }}
      />
      <Tab.Screen 
        name="Spreads" 
        component={SpreadsScreen}
        options={{
          tabBarLabel: '스프레드',
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarLabel: '다이어리',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    height: 80,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconContainerActive: {
    backgroundColor: `${colors.dark.accent}20`,
    shadowColor: colors.dark.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});