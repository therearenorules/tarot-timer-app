import React, { useState, useCallback, memo } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType, ViewStyle, Text } from 'react-native';
import { theme } from '@/constants';

interface ImageWithFallbackProps {
  source: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
  style?: ViewStyle;
  imageStyle?: any;
  placeholder?: React.ReactNode;
  onError?: () => void;
  onLoad?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  showLoadingIndicator?: boolean;
  retryCount?: number;
}

export const ImageWithFallback = memo<ImageWithFallbackProps>(({
  source,
  fallbackSource,
  style,
  imageStyle,
  placeholder,
  onError,
  onLoad,
  resizeMode = 'cover',
  showLoadingIndicator = false,
  retryCount = 1,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRetryCount, setCurrentRetryCount] = useState(0);

  const handleError = useCallback(() => {
    if (currentRetryCount < retryCount) {
      // Retry loading the image
      setCurrentRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [currentRetryCount, retryCount, onError]);

  const handleLoad = useCallback(() => {
    setHasError(false);
    setIsLoading(false);
    setCurrentRetryCount(0); // Reset retry count on successful load
    onLoad?.();
  }, [onLoad]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const errorSource = fallbackSource || {
    uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K',
  };

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        {placeholder || (
          <View style={styles.errorContainer}>
            <Image
              source={errorSource}
              style={styles.errorImage}
              resizeMode="contain"
            />
            <Text style={styles.errorText}>Image failed to load</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={imageStyle}
        resizeMode={resizeMode}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorImage: {
    width: 40,
    height: 40,
    marginBottom: theme.spacing.sm,
    opacity: 0.5,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});