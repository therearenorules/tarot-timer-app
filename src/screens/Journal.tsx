import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { tokens } from '../constants/DesignTokens';
import { loadDailyTarotSaves, type DailyTarotSave } from '../utils/tarot';
import { useLanguage } from '../providers/LanguageProvider';
import { TouchFeedback } from '../components/TouchFeedback';
import { MysticalPulse, GentleGlow, FadeIn } from '../components/AnimationComponents';
import { BookOpen, Calendar, Eye, Clock, X } from '../components/mystical-ui/icons';
import { formatDate, formatHour } from '../utils/journal-helpers';

interface JournalProps {
  onSavedSpreadView?: (savedSpread: any) => void;
  onDailyTarotView?: (dailyTarot: DailyTarotSave) => void;
}

export const Journal: React.FC<JournalProps> = ({ 
  onSavedSpreadView, 
  onDailyTarotView 
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'daily' | 'spreads'>('daily');
  const [savedReadings, setSavedReadings] = useState<DailyTarotSave[]>([]);
  const [selectedReading, setSelectedReading] = useState<DailyTarotSave | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const readings = loadDailyTarotSaves();
    setSavedReadings(readings);
  }, []);

  const handleReadingClick = (reading: DailyTarotSave) => {
    setSelectedReading(reading);
    setIsDialogOpen(true);
  };

  const renderTabButton = (tab: 'daily' | 'spreads', icon: any, label: string) => (
    <TouchFeedback 
      key={tab}
      onPress={() => setActiveTab(tab)}
      touchType="tab"
      hapticFeedback
    >
      <BlurView 
        intensity={activeTab === tab ? 30 : 10} 
        tint="light" 
        style={[
          styles.tabButton,
          activeTab === tab && styles.activeTab
        ]}
      >
        {React.createElement(icon, { 
          size: 16, 
          color: activeTab === tab ? '#0f0a1a' : 'rgba(255, 255, 255, 0.7)' 
        })}
        <Text style={[
          styles.tabText,
          activeTab === tab && styles.activeTabText
        ]}>
          {label}
        </Text>
      </BlurView>
    </TouchFeedback>
  );

  const renderEmptyState = (icon: any, title: string, description: string) => (
    <GentleGlow style={styles.emptyStateGlow}>
      <BlurView intensity={20} tint="light" style={styles.emptyState}>
        <View style={styles.emptyContent}>
          <GentleGlow style={styles.emptyIconGlow}>
            <MysticalPulse style={styles.emptyIcon}>
              {React.createElement(icon, { size: 64, color: tokens.colors.primary })}
            </MysticalPulse>
          </GentleGlow>
          <Text style={styles.emptyTitle}>{title}</Text>
          <Text style={styles.emptyDescription}>{description}</Text>
        </View>
      </BlurView>
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
              <BookOpen size={48} color={tokens.colors.primary} />
            </MysticalPulse>
          </GentleGlow>
          
          <LinearGradient
            colors={[tokens.colors.primary, '#ffffff', tokens.colors.primary]}
            style={styles.titleGradientMask}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.title}>{t('journal.title')}</Text>
          </LinearGradient>
          
          <Text style={styles.subtitle}>{t('journal.subtitle')}</Text>
        </View>

        {/* Journal Tabs */}
        <GentleGlow style={styles.tabsGlow}>
          <BlurView intensity={15} tint="light" style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              {renderTabButton('daily', Clock, t('journal.dailyTarot'))}
              {renderTabButton('spreads', BookOpen, t('journal.spreadRecords'))}
            </View>
          </BlurView>
        </GentleGlow>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'daily' && (
            <FadeIn>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  <Calendar size={20} color={tokens.colors.primary} /> {t('journal.dailyReadings')}
                </Text>
                <BlurView intensity={10} tint="light" style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {savedReadings.length} {t('journal.records')}
                  </Text>
                </BlurView>
              </View>
              
              {savedReadings.length === 0 ? (
                renderEmptyState(
                  Clock,
                  t('journal.noReadings'),
                  t('journal.noReadingsDesc')
                )
              ) : (
                <View style={styles.recordsList}>
                  {savedReadings.map((reading) => (
                    <GentleGlow key={reading.id} style={styles.recordGlow}>
                      <TouchFeedback 
                        onPress={() => handleReadingClick(reading)}
                        touchType="card"
                        hapticFeedback
                      >
                        <BlurView intensity={20} tint="light" style={styles.recordCard}>
                          <View style={styles.recordContent}>
                            <View style={styles.recordHeader}>
                              <Text style={styles.recordTitle}>
                                {formatDate(reading.date, language)}
                              </Text>
                              <BlurView intensity={10} tint="light" style={styles.recordBadge}>
                                <Text style={styles.recordBadgeText}>24-Hour Reading</Text>
                              </BlurView>
                            </View>
                            
                            <Text style={styles.recordDescription}>
                              {reading.insights || 'A precious day\'s tarot reading'}
                            </Text>
                            
                            <View style={styles.recordMeta}>
                              <Text style={styles.recordMetaText}>
                                {reading.hourlyCards.length} {t('spreads.cards')}
                              </Text>
                              <Text style={styles.recordMetaText}>•</Text>
                              <Text style={styles.recordMetaText}>
                                {new Date(reading.savedAt).toLocaleTimeString(
                                  language === 'ko' ? 'ko-KR' : 'en-US', 
                                  { hour: '2-digit', minute: '2-digit' }
                                )} {t('journal.saved')}
                              </Text>
                            </View>
                            
                            <TouchFeedback 
                              onPress={() => handleReadingClick(reading)}
                              touchType="button"
                              hapticFeedback
                            >
                              <LinearGradient
                                colors={['rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.2)']}
                                style={styles.viewButton}
                              >
                                <Eye size={14} color={tokens.colors.primary} />
                                <Text style={styles.viewButtonText}>{t('journal.view')}</Text>
                              </LinearGradient>
                            </TouchFeedback>
                          </View>
                        </BlurView>
                      </TouchFeedback>
                    </GentleGlow>
                  ))}
                </View>
              )}
            </FadeIn>
          )}
          
          {activeTab === 'spreads' && (
            <FadeIn>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  <BookOpen size={20} color={tokens.colors.primary} /> {t('journal.spreadRecords')}
                </Text>
                <BlurView intensity={10} tint="light" style={styles.countBadge}>
                  <Text style={styles.countText}>0 {t('journal.records')}</Text>
                </BlurView>
              </View>
              
              {renderEmptyState(
                BookOpen,
                t('journal.noSpreads'),
                t('journal.noSpreadsDesc')
              )}
            </FadeIn>
          )}
        </View>

        {/* Mystical Quote */}
        <BlurView intensity={10} tint="light" style={styles.quoteCard}>
          <Text style={styles.quote}>{t('journal.quote')}</Text>
        </BlurView>

        {/* Bottom padding for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Reading Detail Modal */}
      <Modal
        visible={isDialogOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.modalBlur}>
            <TouchableOpacity 
              style={styles.modalBackdrop}
              onPress={() => setIsDialogOpen(false)}
              activeOpacity={1}
            />
            
            <FadeIn style={styles.modalContent}>
              <BlurView intensity={40} tint="light" style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    <Clock size={20} color={tokens.colors.primary} />
                    {selectedReading && formatDate(selectedReading.date, language)}
                  </Text>
                  <TouchFeedback 
                    onPress={() => setIsDialogOpen(false)}
                    touchType="button"
                    hapticFeedback
                  >
                    <BlurView intensity={20} tint="light" style={styles.closeButton}>
                      <X size={20} color="#ffffff" />
                    </BlurView>
                  </TouchFeedback>
                </View>
                
                {selectedReading && (
                  <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.modalBody}>
                      <Text style={styles.modalSectionTitle}>24-Hour Tarot Cards</Text>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.cardsScroll}
                      >
                        <View style={styles.cardsContainer}>
                          {selectedReading.hourlyCards.map((card, index) => (
                            <View key={`${card.id}-${index}`} style={styles.cardItem}>
                              <BlurView intensity={10} tint="light" style={styles.cardImageContainer}>
                                <Text style={styles.cardPlaceholder}>🃏</Text>
                              </BlurView>
                              <Text style={styles.cardHour}>{formatHour(index)}</Text>
                              <Text style={styles.cardName}>
                                {language === 'ko' ? card.nameKr : card.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </ScrollView>
                      
                      <Text style={styles.modalSectionTitle}>Sacred Notes</Text>
                      <BlurView intensity={15} tint="light" style={styles.notesContainer}>
                        <Text style={styles.notesText}>
                          {selectedReading.insights || 'No special notes for this day.'}
                        </Text>
                      </BlurView>
                      
                      <View style={styles.modalFooter}>
                        <Text style={styles.footerLabel}>Saved Time</Text>
                        <Text style={styles.footerValue}>
                          {new Date(selectedReading.savedAt).toLocaleDateString(
                            language === 'ko' ? 'ko-KR' : 'en-US'
                          )} {new Date(selectedReading.savedAt).toLocaleTimeString(
                            language === 'ko' ? 'ko-KR' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </BlurView>
            </FadeIn>
          </BlurView>
        </View>
      </Modal>
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
  tabsGlow: {
    borderRadius: tokens.borderRadius.xl,
    marginBottom: tokens.spacing['2xl'],
  },
  tabsContainer: {
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  tabsList: {
    flexDirection: 'row',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
  },
  activeTab: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabText: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0f0a1a',
    fontWeight: '700',
  },
  tabContent: {
    marginBottom: tokens.spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: '#ffffff',
  },
  countBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  countText: {
    fontSize: tokens.fontSize.bodySmall,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  emptyStateGlow: {
    borderRadius: tokens.borderRadius['2xl'],
  },
  emptyState: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  emptyContent: {
    padding: tokens.spacing['4xl'],
    alignItems: 'center',
  },
  emptyIconGlow: {
    marginBottom: tokens.spacing.lg,
  },
  emptyIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  emptyDescription: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  recordsList: {
    gap: tokens.spacing.lg,
  },
  recordGlow: {
    borderRadius: tokens.borderRadius['2xl'],
  },
  recordCard: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  recordContent: {
    padding: tokens.spacing.lg,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  recordTitle: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  recordBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  recordBadgeText: {
    fontSize: 10,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  recordDescription: {
    fontSize: tokens.fontSize.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: tokens.spacing.sm,
    lineHeight: 18,
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  recordMetaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  viewButtonText: {
    fontSize: 12,
    color: tokens.colors.primary,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
  },
  modalBlur: {
    flex: 1,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: tokens.spacing['2xl'],
  },
  modal: {
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalScroll: {
    flex: 1,
  },
  modalBody: {
    padding: tokens.spacing.lg,
  },
  modalSectionTitle: {
    fontSize: tokens.fontSize.bodyLarge,
    fontWeight: '700',
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.md,
  },
  cardsScroll: {
    marginBottom: tokens.spacing.lg,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    paddingHorizontal: 4,
  },
  cardItem: {
    alignItems: 'center',
    width: 64,
  },
  cardImageContainer: {
    width: 64,
    height: 96,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  cardPlaceholder: {
    fontSize: 24,
  },
  cardHour: {
    fontSize: 12,
    color: tokens.colors.primary,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
  notesContainer: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: tokens.spacing.lg,
  },
  notesText: {
    fontSize: tokens.fontSize.bodyMedium,
    color: '#ffffff',
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerValue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});