import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Screen, Text } from '@/components';
import { theme } from '@/constants';

interface LoadingScreenProps {
  message?: string;
  error?: string;
  onRetry?: () => void;
}

export function LoadingScreen({ 
  message = 'Loading...', 
  error,
  onRetry 
}: LoadingScreenProps) {
  if (error) {
    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text variant="title3" color={theme.colors.accent}>
              ⚠️ Error
            </Text>
            <Text variant="body" style={styles.errorMessage}>
              {error}
            </Text>
            {onRetry && (
              <Pressable onPress={onRetry}>
                <Text 
                  variant="body" 
                  color={theme.colors.primary}
                  style={styles.retryButton}
                >
                  Tap to retry
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary}
          style={styles.spinner}
        />
        <Text variant="body" color={theme.colors.textSecondary}>
          {message}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  spinner: {
    marginBottom: theme.spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: 280,
  },
  errorMessage: {
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    lineHeight: 22,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    textDecorationLine: 'underline',
  },
});