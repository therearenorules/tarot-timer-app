import React, { memo } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Share
} from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import { formatDate } from '@/lib';
import { Spread } from '@/lib/database/types';

interface Props {
  spread: Spread;
  onClose: () => void;
  onShare: (imageUri: string) => Promise<void>;
  onDelete: () => void;
}

export const SpreadDetailModal = memo<Props>(({ spread, onClose, onShare, onDelete }) => {
  const spreadTypeDisplayName = spread.spreadType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleShare = async () => {
    if (!spread.imageUri) {
      Alert.alert('No Image', 'This spread has no image to share');
      return;
    }

    try {
      await onShare(spread.imageUri);
    } catch (error) {
      console.error('Failed to share spread:', error);
      Alert.alert('Error', 'Failed to share spread');
    }
  };

  const handleShareNative = async () => {
    if (!spread.imageUri) {
      Alert.alert('No Image', 'This spread has no image to share');
      return;
    }

    try {
      const result = await Share.share({
        url: spread.imageUri,
        title: spread.title || `${spreadTypeDisplayName} Reading`,
        message: `Check out my ${spreadTypeDisplayName} tarot reading from ${formatDate(new Date(spread.createdAt))}`,
      });
    } catch (error) {
      console.error('Failed to share spread:', error);
      Alert.alert('Error', 'Failed to share spread');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Spread',
      `Are you sure you want to delete "${spread.title || spreadTypeDisplayName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text variant="body" color={theme.colors.primary} style={styles.closeButtonText}>
            ← Back
          </Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text variant="body" color={theme.colors.error} style={styles.deleteButtonText}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text variant="title2" style={styles.title}>
            {spread.title || `${spreadTypeDisplayName} Reading`}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {formatDate(new Date(spread.createdAt))}
          </Text>
          <View style={styles.typeBadge}>
            <Text variant="caption" color={theme.colors.secondary} style={styles.typeBadgeText}>
              {spreadTypeDisplayName}
            </Text>
          </View>
        </View>

        <View style={styles.imageSection}>
          {spread.imageUri ? (
            <Image 
              source={{ uri: spread.imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>🔮</Text>
              <Text variant="title3" color={theme.colors.textSecondary}>
                No Image Available
              </Text>
              <Text variant="body" color={theme.colors.textSecondary} style={styles.placeholderText}>
                This spread was created without capturing an image
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {spread.imageUri && (
          <Button
            title="📱 Share"
            onPress={handleShareNative}
            style={styles.actionButton}
            variant="primary"
          />
        )}
        <Button
          title="🗑️ Delete"
          onPress={handleDelete}
          style={[styles.actionButton, styles.deleteActionButton]}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
});

SpreadDetailModal.displayName = 'SpreadDetailModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  deleteButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  typeBadge: {
    backgroundColor: theme.colors.secondary + '20',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  imageSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
  },
  placeholderText: {
    textAlign: 'center',
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  actions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  deleteActionButton: {
    borderColor: theme.colors.error,
  },
});