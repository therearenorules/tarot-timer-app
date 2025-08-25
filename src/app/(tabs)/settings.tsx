import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Screen, Text } from '@/components';
import { theme, APP_CONFIG } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const settingsData = [
  {
    section: 'Notifications',
    items: [
      {
        id: 'hourly-notifications',
        title: 'Hourly Reminders',
        description: 'Get notified for each new card',
        type: 'toggle' as const,
        value: false,
      },
      {
        id: 'daily-reminder',
        title: 'Daily Reminder',
        description: 'Remind me to check my cards',
        type: 'toggle' as const,
        value: true,
      },
    ],
  },
  {
    section: 'Reading Preferences',
    items: [
      {
        id: 'deck-selection',
        title: 'Active Deck',
        description: 'Classic Tarot',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'auto-save',
        title: 'Auto-save Readings',
        description: 'Automatically save completed readings',
        type: 'toggle' as const,
        value: true,
      },
    ],
  },
  {
    section: 'App Settings',
    items: [
      {
        id: 'theme',
        title: 'Theme',
        description: 'Light',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'data-backup',
        title: 'Backup & Restore',
        description: 'Manage your reading data',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
    ],
  },
  {
    section: 'Support',
    items: [
      {
        id: 'help',
        title: 'Help & FAQ',
        description: 'Get help using the app',
        type: 'navigation' as const,
        icon: 'chevron-forward' as const,
      },
      {
        id: 'feedback',
        title: 'Send Feedback',
        description: 'Help us improve the app',
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
            Settings
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Customize your tarot experience
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
                            false: theme.colors.border, 
                            true: theme.colors.primary + '40' 
                          }}
                          thumbColor={
                            toggleStates[item.id] 
                              ? theme.colors.primary 
                              : theme.colors.background
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
    color: theme.colors.primary,
  },
  sectionContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
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