import React, { memo, useState, useCallback, useRef } from 'react';
import { 
  Image, 
  View, 
  StyleSheet, 
  ImageSourcePropType,
  ActivityIndicator,
  InteractionManager 
} from 'react-native';
import { theme } from '@/constants';

interface OptimizedImageProps {
  source: ImageSourcePropType;
  style?: any;
  placeholder?: React.ReactNode;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  priority?: 'low' | 'normal' | 'high';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  source,
  style,
  placeholder,
  resizeMode = 'cover',
  priority = 'normal',
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');
  const intersectionRef = useRef(false);

  // Lazy loading for low priority images
  const handleIntersection = useCallback(() => {
    if (!intersectionRef.current && priority === 'low') {
      intersectionRef.current = true;
      // Defer loading until interactions complete
      InteractionManager.runAfterInteractions(() => {
        setShouldLoad(true);
      });
    }
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleLayout = useCallback(() => {
    if (priority === 'low') {
      handleIntersection();
    }
  }, [handleIntersection, priority]);

  // Start loading for normal priority images after interaction
  React.useEffect(() => {
    if (priority === 'normal' && !shouldLoad) {
      InteractionManager.runAfterInteractions(() => {
        setShouldLoad(true);
      });
    }
  }, [priority, shouldLoad]);

  if (!shouldLoad) {
    return (
      <View 
        style={[styles.placeholder, style]}
        onLayout={handleLayout}
      >
        {placeholder || <ActivityIndicator color={theme.colors.primary} />}
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.placeholder, style]}>
        {placeholder || <View style={styles.errorPlaceholder} />}
      </View>
    );
  }

  return (
    <View style={style}>
      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          {placeholder || <ActivityIndicator color={theme.colors.primary} />}
        </View>
      )}
      <Image
        source={source}
        style={[style, isLoading && styles.hidden]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        // Performance optimizations
        fadeDuration={0}
        progressiveRenderingEnabled={true}
      />
    </View>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  errorPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.3,
  },
  hidden: {
    opacity: 0,
  },
});