import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground, MemoPad, MemoEntry, MysticalButton } from '../components/ui';
import { colors } from '../utils/colors';
import { spacing, typography } from '../utils/styles';
import { getCurrentHourCard } from '../data/tarotSystem';

export const JournalScreen = () => {
  const [memoText, setMemoText] = useState('');
  const [memoEntries, setMemoEntries] = useState([]);
  const [isWritingMode, setIsWritingMode] = useState(false);

  useEffect(() => {
    loadMemoEntries();
  }, []);

  const loadMemoEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem('@tarot_journal_entries');
      if (entries) {
        setMemoEntries(JSON.parse(entries));
      }
    } catch (error) {
      console.error('Failed to load memo entries:', error);
    }
  };

  const saveMemoEntries = async (entries) => {
    try {
      await AsyncStorage.setItem('@tarot_journal_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save memo entries:', error);
    }
  };

  const handleSaveMemo = () => {
    if (memoText.trim()) {
      const currentTime = new Date();
      const currentCard = getCurrentHourCard();

      const newEntry = {
        id: Date.now().toString(),
        date: currentTime.toISOString(),
        content: memoText.trim(),
        cardName: currentCard.name,
        cardAdvice: currentCard.advice,
        cardSymbol: currentCard.symbol,
      };

      const updatedEntries = [newEntry, ...memoEntries];
      setMemoEntries(updatedEntries);
      saveMemoEntries(updatedEntries);
      setMemoText('');
      setIsWritingMode(false);

      Alert.alert('저장 완료', '메모가 성공적으로 저장되었습니다.');
    }
  };

  const handleDeleteEntry = (entryId) => {
    Alert.alert(
      '삭제 확인',
      '이 메모를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            const updatedEntries = memoEntries.filter(entry => entry.id !== entryId);
            setMemoEntries(updatedEntries);
            saveMemoEntries(updatedEntries);
          }
        }
      ]
    );
  };

  const renderWritingMode = () => (
    <View style={styles.writingContainer}>
      <MemoPad
        title="새로운 메모 작성"
        placeholder="오늘의 타로 경험이나 느낀 점을 자유롭게 적어보세요..."
        value={memoText}
        onChangeText={setMemoText}
        style={styles.memoPad}
      />
      
      <View style={styles.actionButtons}>
        <MysticalButton 
          variant="secondary"
          size="medium"
          onPress={() => {
            setMemoText('');
            setIsWritingMode(false);
          }}
          style={styles.cancelButton}
        >
          취소
        </MysticalButton>
        
        <MysticalButton 
          size="medium"
          onPress={handleSaveMemo}
          disabled={!memoText.trim()}
          style={styles.saveButton}
        >
          저장하기
        </MysticalButton>
      </View>
    </View>
  );

  const renderJournalList = () => (
    <View style={styles.journalContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>나의 타로 기록</Text>
        <Text style={styles.listSubtitle}>
          {memoEntries.length}개의 기록
        </Text>
      </View>

      {memoEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={64} color={colors.dark.secondaryForeground} />
          <Text style={styles.emptyStateTitle}>아직 기록이 없습니다</Text>
          <Text style={styles.emptyStateDescription}>
            첫 번째 타로 경험을 기록해보세요
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.entriesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesContent}
        >
          {memoEntries.map((entry) => (
            <MemoEntry
              key={entry.id}
              date={entry.date}
              content={entry.content}
              cardName={entry.cardName}
              onDelete={() => handleDeleteEntry(entry.id)}
              style={styles.memoEntry}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="book" size={48} color={colors.dark.accent} />
          </View>
          <Text style={styles.title}>타로 다이어리</Text>
          <Text style={styles.subtitle}>매일의 타로 기록을 남겨보세요</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isWritingMode ? renderWritingMode() : renderJournalList()}
        </View>

        {/* Floating Action Button */}
        {!isWritingMode && (
          <View style={styles.fab}>
            <MysticalButton
              onPress={() => setIsWritingMode(true)}
              style={styles.fabButton}
              variant="accent"
            >
              ✍️ 새 기록
            </MysticalButton>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerIcon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.accent,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Writing Mode Styles
  writingContainer: {
    flex: 1,
  },
  memoPad: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },

  // Journal List Styles
  journalContainer: {
    flex: 1,
  },
  listHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  listTitle: {
    ...typography.titleLarge,
    color: colors.dark.foreground,
    marginBottom: spacing.xs,
  },
  listSubtitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    ...typography.titleMedium,
    color: colors.dark.secondaryForeground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
    opacity: 0.7,
  },
  entriesList: {
    flex: 1,
  },
  entriesContent: {
    paddingBottom: spacing.xxl,
  },
  memoEntry: {
    marginBottom: spacing.md,
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    left: spacing.lg,
  },
  fabButton: {
    width: '100%',
  },
});