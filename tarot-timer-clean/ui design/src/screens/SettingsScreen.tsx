import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Switch from '../components/ui/Switch';
import { 
  SettingsIcon, 
  CrownIcon, 
  SunIcon, 
  GlobeIcon, 
  BellIcon, 
  Volume2Icon 
} from '../components/icons';

import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../utils/colors';
import { typography, spacing } from '../utils/styles';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useLanguage();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  
  // 애니메이션 값
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.02, { duration: 2000 }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleLanguageToggle = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1f3a', '#4a1a4f', '#1a1f3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
              <SettingsIcon color={colors.dark.premiumGold} size={48} />
            </Animated.View>
            <Text style={styles.title}>{t('settings.title')}</Text>
            <Text style={styles.subtitle}>
              {t('settings.subtitle')}
            </Text>
          </View>

          {/* Premium Membership */}
          <Card style={styles.premiumCard} variant="mystical">
            <View style={styles.premiumContent}>
              <View style={styles.premiumHeader}>
                <View style={styles.premiumInfo}>
                  <CrownIcon color={colors.dark.premiumGold} size={24} />
                  <View style={styles.premiumText}>
                    <Text style={styles.premiumTitle}>{t('settings.premium')}</Text>
                    <Text style={styles.premiumStatus}>{t('settings.active')}</Text>
                  </View>
                </View>
                <Badge variant="default" style={styles.activeBadge}>
                  <Text style={styles.activeText}>{t('settings.active')}</Text>
                </Badge>
              </View>
              
              <View style={styles.premiumFeatures}>
                <View style={styles.featureRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.featureText}>{t('settings.premiumSpreads')}</Text>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.featureText}>{t('settings.adFree')}</Text>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.featureText}>{t('settings.unlimitedStorage')}</Text>
                </View>
              </View>
              
              <Button
                variant="outline"
                style={styles.managePremiumButton}
              >
                <Text style={styles.managePremiumText}>{t('settings.managePremium')}</Text>
              </Button>
            </View>
          </Card>

          {/* Display & Theme */}
          <Card style={styles.settingCard}>
            <View style={styles.settingSection}>
              <View style={styles.sectionHeader}>
                <SunIcon color={colors.dark.premiumGold} size={20} />
                <Text style={styles.sectionTitle}>{t('settings.displayTheme')}</Text>
              </View>
              
              <View style={styles.settingsList}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
                    <Text style={styles.settingDescription}>Always on for mystical experience</Text>
                  </View>
                  <Switch value={true} onValueChange={() => {}} disabled={true} />
                </View>
                
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.language')}</Text>
                    <Text style={styles.settingDescription}>
                      {language === 'ko' ? t('settings.korean') : t('settings.english')}
                    </Text>
                  </View>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={handleLanguageToggle}
                    style={styles.languageButton}
                  >
                    <GlobeIcon color={colors.dark.premiumGold} size={16} />
                    <Text style={styles.languageButtonText}>
                      {language === 'ko' ? 'EN' : '한'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </Card>

          {/* Notifications */}
          <Card style={styles.settingCard}>
            <View style={styles.settingSection}>
              <View style={styles.sectionHeader}>
                <BellIcon color={colors.dark.premiumGold} size={20} />
                <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
              </View>
              
              <View style={styles.settingsList}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.spreadCompletion')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('settings.spreadCompletionDesc')}
                    </Text>
                  </View>
                  <Switch value={notifications} onValueChange={setNotifications} />
                </View>
              </View>
            </View>
          </Card>

          {/* Sound & Haptics */}
          <Card style={styles.settingCard}>
            <View style={styles.settingSection}>
              <View style={styles.sectionHeader}>
                <Volume2Icon color={colors.dark.premiumGold} size={20} />
                <Text style={styles.sectionTitle}>{t('settings.soundHaptics')}</Text>
              </View>
              
              <View style={styles.settingsList}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.soundEffects')}</Text>
                    <Text style={styles.settingDescription}>Mystical sounds and chimes</Text>
                  </View>
                  <Switch value={soundEffects} onValueChange={setSoundEffects} />
                </View>
                
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.hapticFeedback')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('settings.hapticFeedbackDesc')}
                    </Text>
                  </View>
                  <Switch value={hapticFeedback} onValueChange={setHapticFeedback} />
                </View>
              </View>
            </View>
          </Card>

          {/* Version Info */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>{t('settings.version')}</Text>
            <Text style={styles.copyrightText}>{t('settings.copyright')}</Text>
          </View>

          {/* Mystical Quote */}
          <Card style={styles.quoteSection}>
            <Text style={styles.quoteText}>
              {t('settings.quote')}
            </Text>
          </Card>

          {/* 하단 여백 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: 120, // 탭바 공간
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  premiumCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  premiumContent: {
    gap: spacing.lg,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  premiumTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
  },
  premiumStatus: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  activeBadge: {
    backgroundColor: colors.dark.premiumGold,
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  premiumFeatures: {
    paddingLeft: spacing.xl,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark.premiumGold,
    marginRight: spacing.sm,
  },
  featureText: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
  },
  managePremiumButton: {
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  managePremiumText: {
    color: colors.dark.premiumGold,
  },
  settingCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  settingSection: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.sm,
  },
  settingsList: {
    gap: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.bodyLarge,
    color: colors.dark.foreground,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: spacing.md,
  },
  languageButtonText: {
    color: colors.dark.premiumGold,
    marginLeft: spacing.xs,
  },
  versionInfo: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.xs,
  },
  versionText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  copyrightText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  quoteSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  quoteText: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});