import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../utils/colors';
import { typography, spacing, borderRadius, shadows } from '../../utils/styles';

export const MemoPad = ({ 
  title = '메모',
  placeholder = '당신의 생각을 자유롭게 적어보세요...',
  value = '',
  onChangeText,
  maxLength = 1000,
  editable = true,
  style = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradients.mystical}
        style={styles.padContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        </View>

        {/* Memo Area */}
        <View style={[
          styles.memoArea,
          isFocused && styles.memoAreaFocused
        ]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.dark.secondaryForeground}
              multiline={true}
              textAlignVertical="top"
              maxLength={maxLength}
              editable={editable}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </ScrollView>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <Text style={styles.decorativeText}>✨</Text>
          <View style={styles.decorativeLine} />
          <Text style={styles.decorativeText}>🌙</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export const MemoEntry = ({
  date,
  content,
  cardName,
  onPress,
  onDelete,
  style = {}
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date: formattedDate, time } = formatDate(date);

  return (
    <TouchableOpacity
      style={[styles.entryContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.dark.card, colors.dark.background]}
        style={styles.entryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Entry Header */}
        <View style={styles.entryHeader}>
          <View>
            <Text style={styles.entryDate}>{formattedDate}</Text>
            <Text style={styles.entryTime}>{time}</Text>
          </View>
          {cardName && (
            <View style={styles.entryCard}>
              <Text style={styles.entryCardText}>{cardName}</Text>
            </View>
          )}
        </View>

        {/* Entry Content Preview */}
        <View style={styles.entryContent}>
          <Text 
            style={styles.entryText} 
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {content}
          </Text>
        </View>

        {/* Delete Button */}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.medium,
  },
  padContainer: {
    padding: spacing.lg,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.titleLarge,
    color: colors.dark.accent,
    fontWeight: 'bold',
  },
  charCount: {
    ...typography.caption,
    color: colors.dark.secondaryForeground,
    opacity: 0.7,
  },
  memoArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.dark.border,
    minHeight: 200,
  },
  memoAreaFocused: {
    borderColor: colors.dark.accent,
    ...shadows.mysticalGlow,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  textInput: {
    ...typography.bodyLarge,
    color: colors.dark.foreground,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  decorativeElements: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  decorativeText: {
    fontSize: 16,
    opacity: 0.6,
  },
  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.border,
    marginHorizontal: spacing.sm,
    opacity: 0.3,
  },

  // MemoEntry Styles
  entryContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    ...shadows.small,
  },
  entryGradient: {
    padding: spacing.md,
    position: 'relative',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  entryDate: {
    ...typography.bodyMedium,
    color: colors.dark.accent,
    fontWeight: 'bold',
  },
  entryTime: {
    ...typography.caption,
    color: colors.dark.secondaryForeground,
    marginTop: 2,
  },
  entryCard: {
    backgroundColor: colors.dark.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  entryCardText: {
    ...typography.caption,
    color: colors.dark.background,
    fontWeight: 'bold',
  },
  entryContent: {
    marginBottom: spacing.sm,
  },
  entryText: {
    ...typography.bodyMedium,
    color: colors.dark.foreground,
    lineHeight: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
  },
  deleteButtonText: {
    fontSize: 16,
    opacity: 0.6,
  },
});