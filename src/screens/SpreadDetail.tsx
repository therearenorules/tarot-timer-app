import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { tokens } from '../constants/DesignTokens';
import { useLanguage } from '../providers/LanguageProvider';
import { TouchFeedback } from '../components/TouchFeedback';
import { MysticalPulse, GentleGlow, FadeIn } from '../components/AnimationComponents';
import { ArrowLeft, TarotCards, Star, Sparkles } from '../components/mystical-ui/icons';

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description?: string;
  descriptionKr?: string;
  isPremium?: boolean;
}

interface SpreadDetailProps {
  spread: SpreadType;
  onBack: () => void;
}

export const SpreadDetail: React.FC<SpreadDetailProps> = ({ spread, onBack }) => {
  const { t, language } = useLanguage();

  const handleStartSpread = () => {
    Alert.alert(
      t('spreads.title'),
      `${language === 'ko' ? spread.nameKr : spread.name} ${t('spreads.beginReading')}`
    );
  };

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

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchFeedback onPress={onBack} touchType="button" hapticFeedback>
            <BlurView intensity={20} tint="light" style={styles.backButton}>
              <ArrowLeft size={24} color="#ffffff" />
            </BlurView>
          </TouchFeedback>
          
          <LinearGradient
            colors={[tokens.colors.primary, '#ffffff', tokens.colors.primary]}
            style={styles.headerTitleGradient}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.headerTitle}>{t('spreads.title')}</Text>
          </LinearGradient>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Spread Icon */}
          <FadeIn style={styles.iconContainer}>
            <GentleGlow style={styles.iconGlow}>
              <MysticalPulse style={styles.icon}>
                <TarotCards size={80} color={tokens.colors.primary} />
              </MysticalPulse>
            </GentleGlow>
          </FadeIn>

          {/* Spread Title */}
          <FadeIn style={styles.titleContainer}>
            <View style={styles.titleHeader}>
              <Text style={styles.spreadTitle}>
                {language === 'ko' ? spread.nameKr : spread.name}
              </Text>
              {spread.isPremium && (
                <GentleGlow style={styles.premiumBadgeGlow}>
                  <BlurView intensity={15} tint="light" style={styles.premiumBadge}>
                    <Star size={16} color="#0f0a1a" />
                    <Text style={styles.premiumText}>{t('spreads.premium')}</Text>
                  </BlurView>
                </GentleGlow>
              )}
            </View>
            
            <Text style={styles.alternateTitle}>
              {language === 'ko' ? spread.name : spread.nameKr}
            </Text>
          </FadeIn>

          {/* Description */}
          <FadeIn>
            <GentleGlow style={styles.descriptionGlow}>
              <BlurView intensity={20} tint="light" style={styles.descriptionCard}>
                <View style={styles.descriptionHeader}>
                  <Sparkles size={20} color={tokens.colors.primary} />
                  <Text style={styles.descriptionLabel}>스프레드 설명</Text>
                </View>
                <Text style={styles.description}>
                  {language === 'ko' ? spread.descriptionKr || spread.description : spread.description}
                </Text>
              </BlurView>
            </GentleGlow>
          </FadeIn>

          {/* Spread Information */}
          <FadeIn>
            <GentleGlow style={styles.infoGlow}>
              <BlurView intensity={20} tint="light" style={styles.infoCard}>
                <Text style={styles.infoTitle}>스프레드 정보</Text>
                <View style={styles.infoContent}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>ID:</Text>
                    <Text style={styles.infoValue}>{spread.id}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>타입:</Text>
                    <Text style={styles.infoValue}>
                      {spread.isPremium ? 'Premium' : 'Standard'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>상태:</Text>
                    <BlurView intensity={10} tint="light" style={styles.statusBadge}>
                      <Text style={styles.statusText}>사용 가능</Text>
                    </BlurView>
                  </View>
                </View>
              </BlurView>
            </GentleGlow>
          </FadeIn>

          {/* Action Button */}
          <FadeIn>
            <TouchFeedback onPress={handleStartSpread} touchType="button" hapticFeedback>
              <LinearGradient
                colors={[tokens.colors.primary, '#fbbf24']}
                style={styles.startButton}
              >
                <TarotCards size={20} color="#0f0a1a" />
                <Text style={styles.startButtonText}>{t('spreads.beginReading')}</Text>
              </LinearGradient>
            </TouchFeedback>
          </FadeIn>

          {/* Mystical Quote */}
          <BlurView intensity={10} tint="light" style={styles.quoteCard}>
            <Text style={styles.quote}>
              "The cards are a window to your inner wisdom. Trust the journey."
            </Text>
          </BlurView>
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing['2xl'],
    paddingTop: tokens.spacing['2xl'],
    paddingBottom: tokens.spacing.lg,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleGradient: {
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: 'transparent',
    textAlign: 'center',
  },
  placeholder: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing['2xl'],
    gap: tokens.spacing['2xl'],
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing['2xl'],
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  spreadTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  premiumBadgeGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  alternateTitle: {
    fontSize: tokens.fontSize.bodyLarge,
    color: 'rgba(212, 175, 55, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  descriptionGlow: {
    borderRadius: tokens.borderRadius['2xl'],
  },
  descriptionCard: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  descriptionLabel: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: '#ffffff',
  },
  description: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    padding: tokens.spacing.lg,
  },
  infoGlow: {
    borderRadius: tokens.borderRadius['2xl'],
  },
  infoCard: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  infoTitle: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: '#ffffff',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: tokens.fontSize.bodyMedium,
    color: '#ffffff',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statusText: {
    fontSize: 12,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  quoteCard: {
    padding: tokens.spacing['2xl'],
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: tokens.spacing.lg,
  },
  quote: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});