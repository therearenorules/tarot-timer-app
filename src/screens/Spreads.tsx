import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { tokens } from '../constants/DesignTokens';
import { SPREAD_TYPES, type SpreadType } from '../utils/tarot-data';
import { useLanguage } from '../providers/LanguageProvider';
import { TouchFeedback } from '../components/TouchFeedback';
import { MysticalPulse, GentleGlow } from '../components/AnimationComponents';
import { TarotCards, Crown, Star, Sparkles, Zap } from '../components/mystical-ui/icons';

interface SpreadsProps {
  onSpreadSelect?: (spread: SpreadType) => void;
}

export const Spreads: React.FC<SpreadsProps> = ({ onSpreadSelect }) => {
  const { t, language } = useLanguage();

  const handleSpreadSelect = (spread: SpreadType) => {
    if (onSpreadSelect) {
      onSpreadSelect(spread);
    } else {
      Alert.alert(
        t('spreads.title'), 
        `${language === 'ko' ? spread.nameKr : spread.name} ${t('spreads.beginReading')}`
      );
    }
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mystical Header */}
        <View style={styles.header}>
          <GentleGlow style={styles.headerIconContainer}>
            <MysticalPulse style={styles.headerIcon}>
              <TarotCards size={48} color={tokens.colors.primary} />
            </MysticalPulse>
          </GentleGlow>
          
          <LinearGradient
            colors={[tokens.colors.primary, '#ffffff', tokens.colors.primary]}
            style={styles.titleGradientMask}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.title}>{t('spreads.title')}</Text>
          </LinearGradient>
          
          <Text style={styles.subtitle}>{t('spreads.subtitle')}</Text>
        </View>

        {/* Enhanced Spread Cards */}
        <View style={styles.spreadContainer}>
          {SPREAD_TYPES.map((spread) => (
            <GentleGlow key={spread.id} style={styles.cardGlow}>
              <TouchFeedback 
                onPress={() => handleSpreadSelect(spread)}
                touchType="card"
                hapticFeedback
              >
                <BlurView intensity={20} tint="light" style={styles.spreadCard}>
                  <View style={styles.cardContent}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitle}>
                        <GentleGlow style={styles.cardIconGlow}>
                          <TarotCards size={24} color={tokens.colors.primary} />
                        </GentleGlow>
                        <Text style={styles.cardName}>
                          {language === 'ko' ? spread.nameKr : spread.name}
                        </Text>
                        {spread.isPremium && (
                          <GentleGlow style={styles.premiumBadgeGlow}>
                            <BlurView intensity={10} tint="light" style={styles.premiumBadge}>
                              <Crown size={12} color="#0f0a1a" />
                              <Text style={styles.premiumText}>{t('spreads.premium')}</Text>
                            </BlurView>
                          </GentleGlow>
                        )}
                      </View>
                      <Text style={styles.cardAlternateName}>
                        {language === 'ko' ? spread.name : spread.nameKr}
                      </Text>
                    </View>

                    {/* Description */}
                    <BlurView intensity={5} tint="light" style={styles.descriptionCard}>
                      <Text style={styles.description}>
                        {language === 'ko' ? spread.descriptionKr : spread.description}
                      </Text>
                    </BlurView>

                    {/* Action Button */}
                    <TouchFeedback 
                      onPress={() => handleSpreadSelect(spread)}
                      touchType="button"
                      hapticFeedback
                    >
                      <LinearGradient
                        colors={[tokens.colors.primary, '#fbbf24']}
                        style={styles.actionButton}
                      >
                        <Zap size={16} color="#0f0a1a" />
                        <Text style={styles.actionButtonText}>{t('spreads.beginReading')}</Text>
                      </LinearGradient>
                    </TouchFeedback>
                  </View>
                </BlurView>
              </TouchFeedback>
            </GentleGlow>
          ))}
        </View>

        {/* Premium Feature Highlight */}
        <GentleGlow style={styles.premiumHighlightGlow}>
          <BlurView intensity={25} tint="light" style={styles.premiumHighlight}>
            <View style={styles.premiumContent}>
              <GentleGlow style={styles.premiumIconGlow}>
                <MysticalPulse style={styles.premiumIcon}>
                  <Crown size={48} color={tokens.colors.primary} />
                </MysticalPulse>
              </GentleGlow>
              
              <Text style={styles.premiumTitle}>{t('spreads.premiumTitle')}</Text>
              <Text style={styles.premiumDescription}>{t('spreads.premiumDesc')}</Text>
              
              <BlurView intensity={10} tint="light" style={styles.premiumStatusBadge}>
                <Star size={16} color="#0f0a1a" />
                <Text style={styles.premiumStatusText}>{t('spreads.premiumActive')}</Text>
              </BlurView>
            </View>
          </BlurView>
        </GentleGlow>

        {/* Mystical Quote */}
        <BlurView intensity={10} tint="light" style={styles.quoteCard}>
          <Text style={styles.quote}>{t('spreads.quote')}</Text>
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
  spreadContainer: {
    gap: tokens.spacing['2xl'],
    marginBottom: tokens.spacing['2xl'],
  },
  cardGlow: {
    borderRadius: tokens.borderRadius['3xl'],
  },
  spreadCard: {
    borderRadius: tokens.borderRadius['3xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: tokens.spacing['2xl'],
  },
  cardHeader: {
    marginBottom: tokens.spacing.lg,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  cardIconGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  cardName: {
    fontSize: tokens.fontSize.titleLarge,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  premiumBadgeGlow: {
    borderRadius: tokens.borderRadius.full,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  cardAlternateName: {
    fontSize: tokens.fontSize.bodySmall,
    color: 'rgba(212, 175, 55, 0.8)',
    fontWeight: '500',
  },
  descriptionCard: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: tokens.spacing.lg,
  },
  description: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: '#0f0a1a',
  },
  premiumHighlightGlow: {
    borderRadius: tokens.borderRadius['2xl'],
    marginBottom: tokens.spacing['2xl'],
  },
  premiumHighlight: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  premiumContent: {
    padding: tokens.spacing['2xl'],
    alignItems: 'center',
  },
  premiumIconGlow: {
    marginBottom: tokens.spacing.lg,
  },
  premiumIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  premiumTitle: {
    fontSize: tokens.fontSize.titleLarge,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  premiumDescription: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: tokens.spacing.lg,
  },
  premiumStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumStatusText: {
    fontSize: tokens.fontSize.bodyMedium,
    fontWeight: '700',
    color: '#0f0a1a',
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