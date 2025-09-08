import React from 'react';
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
import { LayoutIcon, CrownIcon, ZapIcon } from '../components/icons';

import { useLanguage } from '../contexts/LanguageContext';
import { SPREAD_TYPES } from '../utils/tarot-data';
import { colors } from '../utils/colors';
import { typography, spacing } from '../utils/styles';

export default function SpreadsScreen() {
  const { t, language } = useLanguage();
  
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

  const handleSpreadSelect = (spread: any) => {
    // TODO: Navigate to spread detail
    console.log('Selected spread:', spread);
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
              <LayoutIcon color={colors.dark.premiumGold} size={48} />
            </Animated.View>
            <Text style={styles.title}>{t('spreads.title')}</Text>
            <Text style={styles.subtitle}>
              {t('spreads.subtitle')}
            </Text>
          </View>

          {/* 스프레드 카드들 */}
          <View style={styles.spreadsContainer}>
            {SPREAD_TYPES.map((spread) => (
              <TouchableOpacity
                key={spread.id}
                onPress={() => handleSpreadSelect(spread)}
                activeOpacity={0.8}
              >
                <Card style={styles.spreadCard} variant="mystical">
                  <View style={styles.spreadHeader}>
                    <View style={styles.spreadInfo}>
                      <View style={styles.spreadTitleRow}>
                        <LayoutIcon color={colors.dark.premiumGold} size={20} />
                        <Text style={styles.spreadName}>
                          {language === 'ko' ? spread.nameKr : spread.name}
                        </Text>
                        {spread.isPremium && (
                          <Badge variant="default" style={styles.premiumBadge}>
                            <CrownIcon color="#000" size={12} style={styles.crownIcon} />
                            <Text style={styles.premiumText}>{t('spreads.premium')}</Text>
                          </Badge>
                        )}
                      </View>
                      <Text style={styles.spreadSubName}>
                        {language === 'ko' ? spread.name : spread.nameKr}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.spreadDescription}>
                    <Text style={styles.descriptionText}>
                      {language === 'ko' ? spread.descriptionKr : spread.description}
                    </Text>
                  </View>

                  <Button
                    onPress={() => handleSpreadSelect(spread)}
                    style={styles.spreadButton}
                  >
                    <ZapIcon color="#000" size={16} style={styles.zapIcon} />
                    <Text style={styles.buttonText}>{t('spreads.beginReading')}</Text>
                  </Button>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* 프리미엄 하이라이트 */}
          <Card style={styles.premiumCard} variant="mystical">
            <View style={styles.premiumContent}>
              <Animated.View style={[styles.premiumIconContainer, animatedIconStyle]}>
                <CrownIcon color={colors.dark.premiumGold} size={48} />
              </Animated.View>
              <Text style={styles.premiumTitle}>{t('spreads.premiumTitle')}</Text>
              <Text style={styles.premiumDescription}>
                {t('spreads.premiumDesc')}
              </Text>
              <Badge variant="default" style={styles.premiumActiveBadge}>
                <Text style={styles.premiumActiveText}>{t('spreads.premiumActive')}</Text>
              </Badge>
            </View>
          </Card>

          {/* Mystical Quote */}
          <Card style={styles.quoteSection}>
            <Text style={styles.quoteText}>
              {t('spreads.quote')}
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
  spreadsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  spreadCard: {
    padding: spacing.lg,
  },
  spreadHeader: {
    marginBottom: spacing.md,
  },
  spreadInfo: {
    flex: 1,
  },
  spreadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  spreadName: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.sm,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.premiumGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: spacing.sm,
  },
  crownIcon: {
    marginRight: 4,
  },
  premiumText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  spreadSubName: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.6)',
  },
  spreadDescription: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  descriptionText: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  spreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zapIcon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumCard: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumIconContainer: {
    marginBottom: spacing.md,
  },
  premiumTitle: {
    ...typography.titleLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  premiumDescription: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  premiumActiveBadge: {
    backgroundColor: colors.dark.premiumGold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  premiumActiveText: {
    color: '#000',
    fontWeight: 'bold',
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