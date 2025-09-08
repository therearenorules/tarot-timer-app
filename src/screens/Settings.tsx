import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { tokens } from '../constants/DesignTokens';
import { useLanguage } from '../providers/LanguageProvider';
import { TouchFeedback } from '../components/TouchFeedback';
import { MysticalPulse, GentleGlow, FadeIn } from '../components/AnimationComponents';
import { 
  Settings as SettingsIcon, 
  Crown, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  Star,
  Shield,
  Settings as SettingsGear,
  Bell as NotificationBell,
  Volume2,
  VolumeX
} from '../components/mystical-ui/icons';

export const Settings: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert(
      t('settings.displayTheme'),
      `${t('settings.darkMode')} ${!isDarkMode ? t('settings.on') : t('settings.off')}`
    );
  };

  const handleNotificationToggle = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleHapticToggle = () => {
    setIsHapticEnabled(!isHapticEnabled);
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
  };

  const renderSettingItem = (
    icon: any,
    title: string,
    subtitle: string | null,
    value: boolean,
    onToggle: () => void,
    badge: string | null = null
  ) => (
    <GentleGlow style={styles.settingItemGlow}>
      <BlurView intensity={20} tint="light" style={styles.settingItem}>
        <View style={styles.settingContent}>
          <View style={styles.settingInfo}>
            <GentleGlow style={styles.settingIconGlow}>
              {React.createElement(icon, { size: 20, color: tokens.colors.primary })}
            </GentleGlow>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{title}</Text>
              {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
          </View>
          
          <View style={styles.settingControl}>
            {badge && (
              <BlurView intensity={10} tint="light" style={styles.settingBadge}>
                <Text style={styles.settingBadgeText}>{badge}</Text>
              </BlurView>
            )}
            <Switch
              value={value}
              onValueChange={onToggle}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.2)',
                true: tokens.colors.primary
              }}
              thumbColor={value ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
            />
          </View>
        </View>
      </BlurView>
    </GentleGlow>
  );

  const renderActionButton = (
    icon: any,
    title: string,
    subtitle: string | null = null,
    onPress: () => void
  ) => (
    <GentleGlow style={styles.actionButtonGlow}>
      <TouchFeedback onPress={onPress} touchType="button" hapticFeedback>
        <BlurView intensity={15} tint="light" style={styles.actionButton}>
          <View style={styles.actionContent}>
            <GentleGlow style={styles.actionIconGlow}>
              {React.createElement(icon, { size: 18, color: tokens.colors.primary })}
            </GentleGlow>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{title}</Text>
              {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
            </View>
          </View>
        </BlurView>
      </TouchFeedback>
    </GentleGlow>
  );

  return (
    <LinearGradient 
      colors={['#0f0a1a', '#2a1f3d', '#0f0a1a']} 
      style={styles.container}
    >
      {/* Mystical Background Effects */}
      <View style={styles.backgroundEffects}>
        <MysticalPulse style={[styles.floatingDot, { top: 64, left: 48, width: 4, height: 4 }]}>
          <View style={[styles.goldDot, { width: 4, height: 4 }]} />
        </MysticalPulse>
        <GentleGlow style={[styles.floatingDot, { top: 128, right: 32, width: 2, height: 2 }]}>
          <View style={[styles.whiteDot, { width: 2, height: 2 }]} />
        </GentleGlow>
        <MysticalPulse style={[styles.floatingDot, { bottom: 192, left: 80, width: 6, height: 6 }]}>
          <View style={[styles.goldDot, { width: 6, height: 6 }]} />
        </MysticalPulse>
        <GentleGlow style={[styles.floatingDot, { top: 256, right: 64, width: 2, height: 2 }]}>
          <View style={[styles.whiteDot, { width: 2, height: 2 }]} />
        </GentleGlow>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mystical Header */}
        <View style={styles.header}>
          <GentleGlow style={styles.headerIconContainer}>
            <MysticalPulse style={styles.headerIcon}>
              <SettingsIcon size={48} color={tokens.colors.primary} />
            </MysticalPulse>
          </GentleGlow>
          
          <LinearGradient
            colors={[tokens.colors.primary, '#ffffff', tokens.colors.primary]}
            style={styles.titleGradientMask}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.title}>{t('settings.title')}</Text>
          </LinearGradient>
          
          <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
        </View>

        {/* Premium Section */}
        <FadeIn>
          <GentleGlow style={styles.premiumSectionGlow}>
            <BlurView intensity={25} tint="light" style={styles.premiumSection}>
              <View style={styles.premiumHeader}>
                <GentleGlow style={styles.premiumIconGlow}>
                  <MysticalPulse style={styles.premiumIcon}>
                    <Crown size={24} color={tokens.colors.primary} />
                  </MysticalPulse>
                </GentleGlow>
                <Text style={styles.premiumTitle}>{t('settings.premium')}</Text>
                <BlurView intensity={10} tint="light" style={styles.activeBadge}>
                  <Star size={12} color="#0f0a1a" />
                  <Text style={styles.activeBadgeText}>{t('settings.active')}</Text>
                </BlurView>
              </View>
              
              <View style={styles.premiumFeatures}>
                <View style={styles.premiumFeature}>
                  <Text style={styles.featureText}>✓ {t('settings.premiumSpreads')}</Text>
                  <BlurView intensity={10} tint="light" style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{t('settings.active')}</Text>
                  </BlurView>
                </View>
                <View style={styles.premiumFeature}>
                  <Text style={styles.featureText}>✓ {t('settings.adFree')}</Text>
                  <BlurView intensity={10} tint="light" style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{t('settings.active')}</Text>
                  </BlurView>
                </View>
                <View style={styles.premiumFeature}>
                  <Text style={styles.featureText}>✓ {t('settings.unlimitedStorage')}</Text>
                  <BlurView intensity={10} tint="light" style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{t('settings.active')}</Text>
                  </BlurView>
                </View>
              </View>
              
              <TouchFeedback 
                onPress={() => Alert.alert(t('settings.premium'), t('settings.managePremium'))}
                touchType="button"
                hapticFeedback
              >
                <LinearGradient
                  colors={[tokens.colors.primary, '#fbbf24']}
                  style={styles.manageButton}
                >
                  <Crown size={16} color="#0f0a1a" />
                  <Text style={styles.manageButtonText}>{t('settings.managePremium')}</Text>
                </LinearGradient>
              </TouchFeedback>
            </BlurView>
          </GentleGlow>
        </FadeIn>

        {/* Display & Theme */}
        <FadeIn>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Sun size={18} color={tokens.colors.primary} /> {t('settings.displayTheme')}
            </Text>
            
            {renderSettingItem(
              isDarkMode ? Moon : Sun,
              t('settings.darkMode'),
              null,
              isDarkMode,
              handleThemeToggle,
              isDarkMode ? t('settings.on') : t('settings.off')
            )}
            
            {renderSettingItem(
              Globe,
              t('settings.language'),
              null,
              language === 'en',
              handleLanguageToggle,
              language === 'ko' ? t('settings.korean') : t('settings.english')
            )}
          </View>
        </FadeIn>

        {/* Notifications */}
        <FadeIn>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <NotificationBell size={18} color={tokens.colors.primary} /> {t('settings.notifications')}
            </Text>
            
            {renderSettingItem(
              NotificationBell,
              t('settings.spreadCompletion'),
              t('settings.spreadCompletionDesc'),
              isNotificationsEnabled,
              handleNotificationToggle,
              isNotificationsEnabled ? t('settings.on') : t('settings.off')
            )}
          </View>
        </FadeIn>

        {/* Sound & Haptic */}
        <FadeIn>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Volume2 size={18} color={tokens.colors.primary} /> {t('settings.soundHaptics')}
            </Text>
            
            {renderSettingItem(
              isSoundEnabled ? Volume2 : VolumeX,
              t('settings.soundEffects'),
              null,
              isSoundEnabled,
              handleSoundToggle,
              isSoundEnabled ? t('settings.on') : t('settings.off')
            )}
            
            {renderSettingItem(
              SettingsGear,
              t('settings.hapticFeedback'),
              t('settings.hapticFeedbackDesc'),
              isHapticEnabled,
              handleHapticToggle,
              isHapticEnabled ? t('settings.on') : t('settings.off')
            )}
          </View>
        </FadeIn>

        {/* Privacy & Security */}
        <FadeIn>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Shield size={18} color={tokens.colors.primary} /> {t('settings.privacySecurity')}
            </Text>
            
            <View style={styles.actionsList}>
              {renderActionButton(
                Shield,
                t('settings.privacyPolicy'),
                null,
                () => Alert.alert(t('settings.privacyPolicy'), 'Privacy policy details')
              )}
              {renderActionButton(
                Shield,
                t('settings.dataManagement'),
                null,
                () => Alert.alert(t('settings.dataManagement'), 'Data management options')
              )}
            </View>
          </View>
        </FadeIn>

        {/* Support */}
        <FadeIn>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <SettingsGear size={18} color={tokens.colors.primary} /> {t('settings.support')}
            </Text>
            
            <View style={styles.actionsList}>
              {renderActionButton(
                SettingsGear,
                t('settings.helpFaq'),
                null,
                () => Alert.alert(t('settings.support'), 'Help & FAQ')
              )}
              {renderActionButton(
                Star,
                t('settings.supportDev'),
                null,
                () => Alert.alert(t('settings.support'), 'Support developer')
              )}
            </View>
          </View>
        </FadeIn>

        {/* App Version */}
        <BlurView intensity={10} tint="light" style={styles.versionCard}>
          <Text style={styles.versionText}>{t('settings.version')}</Text>
          <Text style={styles.copyrightText}>{t('settings.copyright')}</Text>
        </BlurView>

        {/* Mystical Quote */}
        <BlurView intensity={10} tint="light" style={styles.quoteCard}>
          <Text style={styles.quote}>{t('settings.quote')}</Text>
        </BlurView>

        {/* Bottom padding for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
  },
  goldDot: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 50,
  },
  whiteDot: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    padding: tokens.spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    paddingTop: tokens.spacing['2xl'],
    paddingBottom: tokens.spacing['2xl'],
    marginBottom: tokens.spacing['2xl'],
  },
  headerIconContainer: {
    marginBottom: tokens.spacing.lg,
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  titleGradientMask: {
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: 'transparent',
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
  premiumSectionGlow: {
    borderRadius: tokens.borderRadius['2xl'],
    marginBottom: tokens.spacing['2xl'],
  },
  premiumSection: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  premiumIconGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  premiumIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  premiumTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  premiumFeatures: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
  },
  featureText: {
    fontSize: tokens.fontSize.bodyMedium,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  featureBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  featureBadgeText: {
    fontSize: 10,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.lg,
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  manageButtonText: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  section: {
    marginBottom: tokens.spacing['2xl'],
  },
  sectionTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: tokens.spacing.lg,
  },
  settingItemGlow: {
    borderRadius: tokens.borderRadius.xl,
    marginBottom: tokens.spacing.md,
  },
  settingItem: {
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  settingContent: {
    padding: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flex: 1,
  },
  settingIconGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: tokens.fontSize.bodyMedium,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  settingBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  settingBadgeText: {
    fontSize: 10,
    color: tokens.colors.primary,
    fontWeight: '700',
  },
  actionsList: {
    gap: tokens.spacing.md,
  },
  actionButtonGlow: {
    borderRadius: tokens.borderRadius.lg,
  },
  actionButton: {
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  actionIconGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: tokens.fontSize.bodyMedium,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  versionCard: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
  },
  quoteCard: {
    padding: tokens.spacing['2xl'],
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: tokens.spacing['2xl'],
  },
  quote: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 80,
  },
});