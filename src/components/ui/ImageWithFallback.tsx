import React, { useState } from 'react';
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
}

export function ImageWithFallback({
  source,
  fallbackSource,
  style,
  imageStyle,
  placeholder,
  onError,
  onLoad,
  resizeMode = 'cover',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

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
      />
    </View>
  );
}

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