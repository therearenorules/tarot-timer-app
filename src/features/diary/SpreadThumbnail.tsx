import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Alert } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { formatDate } from '@/lib';
import { Spread } from '@/lib/database/types';

interface Props {
  spread: Spread;
  onPress: () => void;
  onDelete: () => void;
}

export const SpreadThumbnail = memo<Props>(({ spread, onPress, onDelete }) => {
  const handleLongPress = () => {
    Alert.alert(
      'Spread Options',
      `Manage "${spread.title || spread.spreadType}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View', onPress: onPress },
        { text: 'Delete', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  const spreadTypeDisplayName = spread.spreadType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <TouchableOpacity 
      style={styles.thumbnail} 
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {spread.imageUri ? (
          <Image 
            source={{ uri: spread.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🔮</Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              No Image
            </Text>
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.typeBadge}>
            <Text variant="caption" color={theme.colors.background} style={styles.typeBadgeText}>
              {spreadTypeDisplayName}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text variant="body" numberOfLines={2} style={styles.title}>
          {spread.title || `${spreadTypeDisplayName} Reading`}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {formatDate(new Date(spread.createdAt))}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

SpreadThumbnail.displayName = 'SpreadThumbnail';

const styles = StyleSheet.create({
  thumbnail: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    flex: 1,
    maxWidth: '48%',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  typeBadge: {
    backgroundColor: theme.colors.secondary + 'CC',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
});