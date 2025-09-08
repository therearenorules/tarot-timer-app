// 기본 DailyTarotViewer 화면 (임시 구현)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '../constants/DesignTokens';
import { ChevronLeft } from '../components/mystical-ui/icons';

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: any[];
  memos?: { [hour: number]: string };
}

export interface DailyTarotViewerProps {
  dailyTarot: DailyTarotSave;
  onBack: () => void;
}

export const DailyTarotViewer: React.FC<DailyTarotViewerProps> = ({ dailyTarot, onBack }) => {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={tokens.colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>데일리 타로</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>📅 {dailyTarot.date}</Text>
        <Text style={styles.subtitle}>데일리 타로 뷰어 구현 중...</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardText}>ID: {dailyTarot.id}</Text>
          <Text style={styles.cardText}>카드 개수: {dailyTarot.hourlyCards.length}장</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing['2xl'],
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
  },
  backButton: {
    padding: tokens.spacing.sm,
  },
  headerTitle: {
    fontSize: tokens.fontSize.titleMedium,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.foreground,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: tokens.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: tokens.fontSize.displayLarge,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  subtitle: {
    fontSize: tokens.fontSize.bodyLarge,
    color: tokens.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: tokens.spacing['4xl'],
  },
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing['2xl'],
    minWidth: 200,
    alignItems: 'center',
    ...tokens.shadows.medium,
  },
  cardText: {
    fontSize: tokens.fontSize.bodyMedium,
    color: tokens.colors.foreground,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
});