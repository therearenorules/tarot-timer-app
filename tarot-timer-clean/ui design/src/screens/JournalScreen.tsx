import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { BookOpenIcon, ClockIcon, CalendarIcon, LayoutIcon, StarIcon } from '../components/icons';

import { useLanguage } from '../contexts/LanguageContext';
import { getDailyTarotSaves, getSavedSpreads, DailyTarotSave, SavedSpread } from '../utils/storage';
import { colors } from '../utils/colors';
import { typography, spacing } from '../utils/styles';

export default function JournalScreen() {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'daily' | 'spreads'>('daily');
  const [dailyTarotSaves, setDailyTarotSaves] = useState<DailyTarotSave[]>([]);
  const [savedSpreads, setSavedSpreads] = useState<SavedSpread[]>([]);
  
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const dailySaves = await getDailyTarotSaves();
    const spreadSaves = await getSavedSpreads();
    setDailyTarotSaves(dailySaves);
    setSavedSpreads(spreadSaves);
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleDailyTarotSelect = (dailyTarot: DailyTarotSave) => {
    // TODO: Navigate to daily tarot viewer
    console.log('Selected daily tarot:', dailyTarot);
  };

  const handleSpreadSelect = (spread: SavedSpread) => {
    // TODO: Navigate to spread viewer
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
              <BookOpenIcon color={colors.dark.premiumGold} size={48} />
            </Animated.View>
            <Text style={styles.title}>{t('journal.title')}</Text>
            <Text style={styles.subtitle}>
              {t('journal.subtitle')}
            </Text>
          </View>

          {/* 섹션 토글 */}
          <View style={styles.sectionToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeSection === 'daily' && styles.toggleButtonActive
              ]}
              onPress={() => setActiveSection('daily')}
            >
              <Text style={[
                styles.toggleText,
                activeSection === 'daily' && styles.toggleTextActive
              ]}>
                {t('journal.dailyTarot')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeSection === 'spreads' && styles.toggleButtonActive
              ]}
              onPress={() => setActiveSection('spreads')}
            >
              <Text style={[
                styles.toggleText,
                activeSection === 'spreads' && styles.toggleTextActive
              ]}>
                {t('journal.spreadRecords')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 일일 타로 섹션 */}
          {activeSection === 'daily' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <ClockIcon color={colors.dark.premiumGold} size={20} />
                  <Text style={styles.sectionTitle}>{t('journal.dailyReadings')}</Text>
                </View>
                <Badge style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {dailyTarotSaves.length} {t('journal.records')}
                  </Text>
                </Badge>
              </View>

              {dailyTarotSaves.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <StarIcon color="rgba(212, 175, 55, 0.5)" size={48} />
                    <Text style={styles.emptyTitle}>{t('journal.noReadings')}</Text>
                    <Text style={styles.emptyDescription}>
                      {t('journal.noReadingsDesc')}
                    </Text>
                  </View>
                </Card>
              ) : (
                <View style={styles.recordsList}>
                  {dailyTarotSaves.map((save) => (
                    <TouchableOpacity
                      key={save.id}
                      onPress={() => handleDailyTarotSelect(save)}
                      activeOpacity={0.8}
                    >
                      <Card style={styles.recordCard}>
                        <View style={styles.recordHeader}>
                          <View style={styles.recordInfo}>
                            <View style={styles.dateRow}>
                              <CalendarIcon color={colors.dark.premiumGold} size={16} />
                              <Text style={styles.dateText}>
                                {new Date(save.date).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                              </Text>
                            </View>
                            <Text style={styles.recordType}>24시간 타로 리딩</Text>
                          </View>
                          <Badge style={styles.savedBadge}>
                            <Text style={styles.savedText}>{t('journal.saved')}</Text>
                          </Badge>
                        </View>

                        {/* 카드 미리보기 */}
                        <View style={styles.cardPreview}>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.previewScroll}
                          >
                            {save.hourlyCards.slice(0, 8).map((card, index) => (
                              <View key={index} style={styles.previewCard}>
                                <Image
                                  source={{ uri: card.imageUrl }}
                                  style={styles.previewImage}
                                  resizeMode="cover"
                                />
                              </View>
                            ))}
                            {save.hourlyCards.length > 8 && (
                              <View style={styles.moreCard}>
                                <Text style={styles.moreText}>+{save.hourlyCards.length - 8}</Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>

                        {/* 인사이트 미리보기 */}
                        {save.insights && (
                          <View style={styles.insightsPreview}>
                            <Text style={styles.insightsText} numberOfLines={2}>
                              {save.insights}
                            </Text>
                          </View>
                        )}

                        {/* 메모 카운트 */}
                        <View style={styles.recordFooter}>
                          <View style={styles.memoCount}>
                            <ClockIcon color={colors.dark.premiumGold} size={12} />
                            <Text style={styles.memoCountText}>
                              {Object.keys(save.memos || {}).length}개 시간대 메모
                            </Text>
                          </View>
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleDailyTarotSelect(save)}
                          >
                            <Text style={styles.viewButtonText}>{t('journal.view')}</Text>
                          </Button>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 스프레드 기록 섹션 */}
          {activeSection === 'spreads' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LayoutIcon color={colors.dark.premiumGold} size={20} />
                  <Text style={styles.sectionTitle}>{t('journal.spreadRecords')}</Text>
                </View>
                <Badge style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {savedSpreads.length} {t('journal.records')}
                  </Text>
                </Badge>
              </View>

              {savedSpreads.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <LayoutIcon color="rgba(212, 175, 55, 0.5)" size={48} />
                    <Text style={styles.emptyTitle}>{t('journal.noSpreads')}</Text>
                    <Text style={styles.emptyDescription}>
                      {t('journal.noSpreadsDesc')}
                    </Text>
                  </View>
                </Card>
              ) : (
                <View style={styles.recordsList}>
                  {savedSpreads.map((spread) => (
                    <TouchableOpacity
                      key={spread.id}
                      onPress={() => handleSpreadSelect(spread)}
                      activeOpacity={0.8}
                    >
                      <Card style={styles.recordCard}>
                        <View style={styles.recordHeader}>
                          <View style={styles.recordInfo}>
                            <Text style={styles.spreadTitle}>{spread.title}</Text>
                            <View style={styles.dateRow}>
                              <CalendarIcon color={colors.dark.premiumGold} size={16} />
                              <Text style={styles.dateText}>
                                {new Date(spread.date).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Text>
                            </View>
                          </View>
                          <Badge style={styles.savedBadge}>
                            <Text style={styles.savedText}>{t('journal.saved')}</Text>
                          </Badge>
                        </View>

                        <View style={styles.spreadTypeContainer}>
                          <Badge style={styles.spreadTypeBadge}>
                            <Text style={styles.spreadTypeText}>{spread.spreadName}</Text>
                          </Badge>
                        </View>

                        {/* 인사이트 미리보기 */}
                        <View style={styles.insightsPreview}>
                          <Text style={styles.insightsText} numberOfLines={2}>
                            {spread.insights}
                          </Text>
                        </View>

                        <View style={styles.recordFooter}>
                          <View style={styles.spreadInfo}>
                            <Text style={styles.cardCountText}>
                              {spread.cards.length}장 카드
                            </Text>
                          </View>
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleSpreadSelect(spread)}
                          >
                            <Text style={styles.viewButtonText}>{t('journal.view')}</Text>
                          </Button>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Mystical Quote */}
          <Card style={styles.quoteSection}>
            <Text style={styles.quoteText}>
              {t('journal.quote')}
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
  sectionToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.dark.premiumGold,
  },
  toggleText: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.sm,
  },
  countBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  countText: {
    color: colors.dark.premiumGold,
    fontSize: 12,
  },
  emptyCard: {
    padding: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  recordsList: {
    gap: spacing.lg,
  },
  recordCard: {
    padding: spacing.lg,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  recordInfo: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.bodyMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.xs,
  },
  recordType: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  spreadTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginBottom: spacing.xs,
  },
  savedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  savedText: {
    color: '#22c55e',
    fontSize: 12,
  },
  cardPreview: {
    marginBottom: spacing.md,
  },
  previewScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  previewCard: {
    width: 32,
    height: 48,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  moreCard: {
    width: 32,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  insightsPreview: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  insightsText: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoCountText: {
    ...typography.caption,
    color: colors.dark.premiumGold,
    marginLeft: spacing.xs,
  },
  spreadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCountText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  spreadTypeContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  spreadTypeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  spreadTypeText: {
    color: colors.dark.premiumGold,
    fontSize: 12,
  },
  viewButtonText: {
    color: colors.dark.foreground,
    fontSize: 14,
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