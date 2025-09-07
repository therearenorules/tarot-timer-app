import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  TarotCard,
  TabNavigation,
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from '../components/ui';

const { width: screenWidth } = Dimensions.get('window');

interface DailyRecord {
  date: string;
  spreadType: string;
  cardCount: number;
  cards: Array<{
    hour: number;
    name: string;
    image: string;
    memo?: string;
  }>;
  totalMemos: number;
}

interface SpreadRecord {
  id: string;
  date: string;
  spreadType: string;
  cardCount: number;
  completedAt: string;
  imageUrl?: string;
}

export const JournalScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'daily' | 'spreads'>('daily');
  const [selectedRecord, setSelectedRecord] = useState<DailyRecord | null>(null);

  const fadeAnimation = useSharedValue(1);

  // 모크 데일리 기록들
  const mockDailyRecords: DailyRecord[] = [
    {
      date: '2025년 1월 7일 화요일',
      spreadType: '데일리',
      cardCount: 14,
      totalMemos: 5,
      cards: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        name: `Card ${i}`,
        image: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop&seed=${i}`,
        memo: i < 14 && Math.random() > 0.6 ? `${i}시의 느낌과 생각` : undefined,
      })),
    },
    {
      date: '2025년 1월 6일 월요일',
      spreadType: '데일리',
      cardCount: 18,
      totalMemos: 7,
      cards: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        name: `Card ${i}`,
        image: `https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=300&h=500&fit=crop&seed=${i + 24}`,
        memo: i < 18 && Math.random() > 0.5 ? `${i}시의 기록` : undefined,
      })),
    },
    {
      date: '2025년 1월 5일 일요일',
      spreadType: '데일리',
      cardCount: 24,
      totalMemos: 12,
      cards: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        name: `Card ${i}`,
        image: `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop&seed=${i + 48}`,
        memo: Math.random() > 0.4 ? `${i}시의 완전한 기록` : undefined,
      })),
    },
  ];

  // 모크 스프레드 기록들
  const mockSpreadRecords: SpreadRecord[] = [
    {
      id: '1',
      date: '2025-01-07',
      spreadType: '3카드 스프레드',
      cardCount: 3,
      completedAt: '오후 2:30',
    },
    {
      id: '2',
      date: '2025-01-06',
      spreadType: 'AB선택 스프레드',
      cardCount: 7,
      completedAt: '오후 7:15',
    },
    {
      id: '3',
      date: '2025-01-05',
      spreadType: '켈틱 크로스',
      cardCount: 10,
      completedAt: '오전 11:45',
    },
    {
      id: '4',
      date: '2025-01-04',
      spreadType: '5카드 스프레드',
      cardCount: 5,
      completedAt: '오후 4:20',
    },
  ];

  const tabItems = [
    { id: 'daily', label: '데일리 타로일기', icon: '📖' },
    { id: 'spreads', label: '스프레드 기록', icon: '🎴' },
  ];

  const renderDailyRecord = (record: DailyRecord, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.recordCard}
      onPress={() => setSelectedRecord(record)}
    >
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.recordDate}>{record.date}</Text>
          <View style={styles.recordStats}>
            <Text style={styles.statText}>카드 {record.cardCount}장</Text>
            <Text style={styles.statDivider}>•</Text>
            <Text style={styles.statText}>메모 {record.totalMemos}개</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: `${colors.primary.main}20` },
          { borderColor: `${colors.primary.main}50` },
        ]}>
          <Text style={[styles.statusText, { color: colors.primary.main }]}>
            {record.spreadType}
          </Text>
        </View>
      </View>

      <View style={styles.cardPreview}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardPreviewContent}
        >
          {record.cards.filter(card => card.hour < record.cardCount).slice(0, 8).map((card, cardIndex) => (
            <View key={cardIndex} style={styles.previewCard}>
              <TarotCard
                size="small"
                variant="revealed"
                cardImage={card.image}
                style={styles.previewCardImage}
              />
              <Text style={styles.previewCardLabel}>
                {card.hour.toString().padStart(2, '0')}:00
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  const renderSpreadRecord = (record: SpreadRecord, index: number) => (
    <TouchableOpacity
      key={record.id}
      style={styles.recordCard}
      onPress={() => console.log('스프레드 상세', record.id)}
    >
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.recordTitle}>{record.spreadType}</Text>
          <Text style={styles.recordSubtitle}>
            {new Date(record.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })} • {record.completedAt}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: `${colors.status.info}20` },
          { borderColor: `${colors.status.info}50` },
        ]}>
          <Text style={[styles.statusText, { color: colors.status.info }]}>
            {record.cardCount}장
          </Text>
        </View>
      </View>

      <View style={styles.spreadPreview}>
        <Text style={styles.spreadDescription}>
          완료된 스프레드 리딩 • 저장된 이미지와 메모를 확인하세요
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => {
    if (!selectedRecord) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedRecord.date}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedRecord(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatNumber}>{selectedRecord.cardCount}</Text>
                <Text style={styles.modalStatLabel}>공개된 카드</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatNumber}>{selectedRecord.totalMemos}</Text>
                <Text style={styles.modalStatLabel}>작성한 메모</Text>
              </View>
            </View>

            <View style={styles.modalCards}>
              <Text style={styles.modalSectionTitle}>24시간 카드 기록</Text>
              <View style={styles.modalCardsGrid}>
                {selectedRecord.cards.map((card, index) => (
                  <View key={index} style={styles.modalCardItem}>
                    <TarotCard
                      size="small"
                      variant={index < selectedRecord.cardCount ? 'revealed' : 'placeholder'}
                      cardImage={index < selectedRecord.cardCount ? card.image : undefined}
                      style={styles.modalCardImage}
                    />
                    <Text style={styles.modalCardTime}>
                      {index.toString().padStart(2, '0')}:00
                    </Text>
                    {card.memo && (
                      <View style={styles.memoIndicator}>
                        <Text style={styles.memoIndicatorText}>📝</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {selectedRecord.cards.filter(card => card.memo).length > 0 && (
              <View style={styles.modalMemos}>
                <Text style={styles.modalSectionTitle}>작성된 메모</Text>
                {selectedRecord.cards
                  .filter(card => card.memo)
                  .map((card, index) => (
                    <View key={index} style={styles.memoItem}>
                      <Text style={styles.memoTime}>
                        {card.hour.toString().padStart(2, '0')}:00
                      </Text>
                      <Text style={styles.memoContent}>{card.memo}</Text>
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>📖 Journal</Text>
          <Text style={styles.subtitle}>
            타로 리딩의 기록과 성찰
          </Text>
        </View>

        {/* 탭 네비게이션 */}
        <View style={styles.tabContainer}>
          <TabNavigation
            tabs={tabItems}
            activeTabId={activeSection}
            onTabPress={(tabId) => setActiveSection(tabId as 'daily' | 'spreads')}
            variant="minimal"
            size="compact"
            position="top"
            style={styles.tabNavigation}
          />
        </View>

        {/* 콘텐츠 */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollContent}
        >
          {activeSection === 'daily' ? (
            <View style={styles.dailySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>데일리 타로일기</Text>
                <Text style={styles.sectionCount}>{mockDailyRecords.length}일 기록</Text>
              </View>
              
              <View style={styles.recordsList}>
                {mockDailyRecords.map(renderDailyRecord)}
              </View>
            </View>
          ) : (
            <View style={styles.spreadsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>스프레드 기록</Text>
                <Text style={styles.sectionCount}>{mockSpreadRecords.length}개 기록</Text>
              </View>
              
              <View style={styles.recordsList}>
                {mockSpreadRecords.map(renderSpreadRecord)}
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* 상세 모달 */}
      {selectedRecord && renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  content: {
    flex: 1,
    padding: spacing['2xl'],
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },

  title: {
    fontSize: typography.size.displayLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  tabContainer: {
    marginBottom: spacing['2xl'],
  },

  tabNavigation: {
    backgroundColor: colors.card.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.card.border,
  },

  scrollContent: {
    flex: 1,
  },

  dailySection: {
    paddingBottom: spacing['4xl'],
  },

  spreadsSection: {
    paddingBottom: spacing['4xl'],
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },

  sectionTitle: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  sectionCount: {
    fontSize: typography.size.bodySmall,
    color: colors.text.tertiary,
    backgroundColor: `${colors.primary.main}20`,
    borderColor: `${colors.primary.main}50`,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  recordsList: {
    gap: spacing.lg,
  },

  recordCard: {
    backgroundColor: colors.card.background,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: spacing['2xl'],
    ...shadows.medium,
  },

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  recordDate: {
    fontSize: typography.size.titleSmall,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  recordTitle: {
    fontSize: typography.size.titleSmall,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  recordSubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.text.secondary,
  },

  recordStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  statText: {
    fontSize: typography.size.bodySmall,
    color: colors.text.secondary,
  },

  statDivider: {
    fontSize: typography.size.bodySmall,
    color: colors.text.quaternary,
  },

  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },

  statusText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
  },

  cardPreview: {
    marginTop: spacing.md,
  },

  cardPreviewContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  previewCard: {
    alignItems: 'center',
    gap: spacing.xs,
  },

  previewCardImage: {
    width: 40,
    height: 60,
  },

  previewCardLabel: {
    fontSize: typography.size.overline,
    color: colors.text.tertiary,
  },

  spreadPreview: {
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.card.border,
  },

  spreadDescription: {
    fontSize: typography.size.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.size.bodySmall * typography.lineHeight.relaxed,
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },

  modalContent: {
    backgroundColor: colors.card.background,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.primary.main,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 400,
    ...shadows.mystical,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },

  modalTitle: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.semibold,
    color: colors.primary.main,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
  },

  modalStats: {
    flexDirection: 'row',
    padding: spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },

  modalStat: {
    flex: 1,
    alignItems: 'center',
  },

  modalStatNumber: {
    fontSize: typography.size.titleLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },

  modalStatLabel: {
    fontSize: typography.size.caption,
    color: colors.text.secondary,
  },

  modalStatDivider: {
    width: 1,
    backgroundColor: colors.card.border,
    marginHorizontal: spacing.lg,
  },

  modalCards: {
    padding: spacing['2xl'],
  },

  modalSectionTitle: {
    fontSize: typography.size.titleSmall,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  modalCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },

  modalCardItem: {
    width: (screenWidth - spacing['2xl'] * 4 - spacing.md * 5) / 6,
    alignItems: 'center',
    position: 'relative',
  },

  modalCardImage: {
    width: '100%',
    aspectRatio: 0.6,
    marginBottom: spacing.xs,
  },

  modalCardTime: {
    fontSize: typography.size.overline,
    color: colors.text.tertiary,
  },

  memoIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },

  memoIndicatorText: {
    fontSize: 8,
  },

  modalMemos: {
    padding: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
  },

  memoItem: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.card.border,
  },

  memoTime: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.medium,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },

  memoContent: {
    fontSize: typography.size.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.size.bodySmall * typography.lineHeight.relaxed,
  },
});

export default JournalScreen;