import React, { useState, useMemo } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import { theme } from '@/constants';
import { Text } from './Text';
import { MoonIcon, SparklesIcon } from './Icon';
import { TarotCardBackImage } from './TarotImage';

/**
 * 🎴 React Native Tarot Card Component (Figma UI Enhanced)
 * 
 * Premium tarot card component optimized for React Native with Figma UI design.
 * 
 * Features:
 * - Touch interactions with Figma UI styling
 * - Loading states with mystical shimmer
 * - Responsive sizing for mobile devices
 * - Accessibility support
 * - Performance optimized with React.memo
 * - Figma UI design tokens integration
 */

export type CardSize = 'small' | 'medium' | 'large';
export type CardState = 'face-down' | 'face-up' | 'loading' | 'error';

interface TarotCardData {
  id: string;
  name: string;
  nameKr: string;
  description?: string;
  descriptionKr?: string;
  keywords?: string[];
  keywordsKr?: string[];
  imageUrl?: string;
}

interface TarotCardProps {
  // Core props
  card?: TarotCardData;
  size?: CardSize;
  state?: CardState;
  
  // Interactive props
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  
  // Display props
  showTitle?: boolean;
  showDescription?: boolean;
  
  // Animation props
  glowIntensity?: 'subtle' | 'normal' | 'intense';
  
  // Event handlers
  onPress?: () => void;
  onFlip?: () => void;
  
  // Style props
  style?: ViewStyle;
}

/**
 * React Native Tarot Card Component with Figma UI Design
 */
export const TarotCard = React.memo<TarotCardProps>(({
  card,
  size = 'medium',
  state = 'face-down',
  interactive = true,
  selected = false,
  disabled = false,
  showTitle = true,
  showDescription = false,
  glowIntensity = 'normal',
  onPress,
  onFlip,
  style,
}) => {
  // Component state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Figma UI size configurations for mobile
  const sizeConfig = useMemo(() => {
    const configs = {
      small: { 
        width: 90, 
        height: 135, 
        borderRadius: theme.borderRadius.md, 
        titleSize: 12,
        padding: theme.spacing.sm,
      },
      medium: { 
        width: 120, 
        height: 180, 
        borderRadius: theme.borderRadius.lg, 
        titleSize: 14,
        padding: theme.spacing.md,
      },
      large: { 
        width: 200, 
        height: 300, 
        borderRadius: theme.borderRadius.lg, 
        titleSize: 16,
        padding: theme.spacing.lg,
      },
    };
    return configs[size];
  }, [size]);

  // Figma UI Glow effect configuration
  const glowConfig = useMemo(() => {
    const configs = {
      subtle: { shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
      normal: { shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
      intense: { shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
    };
    return configs[glowIntensity];
  }, [glowIntensity]);

  // Handle press events
  const handlePress = () => {
    if (disabled || !interactive) return;
    
    if (state === 'face-down' && onFlip) {
      onFlip();
    } else if (onPress) {
      onPress();
    }
  };

  // Get container styles
  const getContainerStyle = (): ViewStyle => {
    return {
      width: sizeConfig.width,
      height: sizeConfig.height,
      borderRadius: sizeConfig.borderRadius,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: selected 
        ? theme.colors.premiumGold 
        : state === 'face-up' && card 
          ? `${theme.colors.premiumGold}40`
          : `${theme.colors.border}80`,
      overflow: 'hidden',
      opacity: disabled ? 0.5 : 1,
      // Figma UI enhanced shadows
      shadowColor: selected || (state === 'face-up' && card) 
        ? theme.colors.premiumGold 
        : theme.colors.mystical.shadow,
      shadowOffset: { width: 0, height: 4 },
      ...glowConfig,
      // Mystical border effect
      ...(selected && {
        borderColor: theme.colors.premiumGold,
        shadowColor: theme.colors.premiumGold,
      }),
    };
  };

  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.premiumGold} 
      />
      <Text 
        style={[styles.loadingText, { fontSize: sizeConfig.titleSize }]}
        color={theme.colors.textSecondary}
      >
        Loading...
      </Text>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>❌</Text>
      <Text 
        style={[styles.errorText, { fontSize: sizeConfig.titleSize }]}
        color={theme.colors.error}
      >
        Error
      </Text>
    </View>
  );

  // Render face-down card with Figma UI card back
  const renderFaceDown = () => (
    <View style={styles.faceDownContainer}>
      <TarotCardBackImage 
        name="tarot-card-back"
        width={sizeConfig.width - 8}
        height={sizeConfig.height - 8}
        style={styles.cardBackImage}
      />
      {showTitle && (
        <View style={styles.faceDownTitleContainer}>
          <Text 
            style={[styles.faceDownTitle, { fontSize: sizeConfig.titleSize }]}
            color={theme.colors.textTertiary}
          >
            Tap to reveal
          </Text>
        </View>
      )}
    </View>
  );

  // Render face-up card
  const renderFaceUp = () => {
    if (!card) return null;

    return (
      <View style={styles.faceUpContainer}>
        {card.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: card.imageUrl }}
              style={[styles.cardImage, { borderRadius: sizeConfig.borderRadius - 4 }]}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              resizeMode="cover"
            />
            {!imageLoaded && !imageError && (
              <View style={styles.imageLoading}>
                <ActivityIndicator 
                  size="small" 
                  color={theme.colors.premiumGold} 
                />
              </View>
            )}
          </View>
        )}
        
        {showTitle && (
          <View style={[styles.titleContainer, { padding: sizeConfig.padding }]}>
            <Text 
              style={[styles.cardTitle, { fontSize: sizeConfig.titleSize }]}
              color={theme.colors.text}
              numberOfLines={2}
            >
              {card.nameKr || card.name}
            </Text>
            
            {showDescription && card.descriptionKr && (
              <Text 
                style={[styles.cardDescription, { fontSize: sizeConfig.titleSize - 2 }]}
                color={theme.colors.textSecondary}
                numberOfLines={3}
              >
                {card.descriptionKr}
              </Text>
            )}
          </View>
        )}

        {/* Figma UI mystical corners */}
        <View style={styles.mysticalCorners}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
    );
  };

  // Render content based on state
  const renderContent = () => {
    switch (state) {
      case 'loading':
        return renderLoading();
      case 'error':
        return renderError();
      case 'face-up':
        return renderFaceUp();
      case 'face-down':
      default:
        return renderFaceDown();
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={handlePress}
      disabled={disabled || !interactive}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={
        state === 'face-up' && card 
          ? `Tarot card: ${card.nameKr || card.name}` 
          : 'Hidden tarot card'
      }
      accessibilityHint={
        state === 'face-down' 
          ? 'Tap to reveal the card' 
          : card?.descriptionKr || 'View card details'
      }
    >
      {renderContent()}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontWeight: '500',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  errorIcon: {
    fontSize: 24,
  },
  errorText: {
    fontWeight: '600',
  },
  
  faceDownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardBackImage: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  faceDownTitleContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: `${theme.colors.background}80`,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  faceDownTitle: {
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  faceUpContainer: {
    flex: 1,
    position: 'relative',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    flex: 1,
    width: '100%',
  } as ImageStyle,
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${theme.colors.surface}90`,
  },
  
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${theme.colors.background}90`,
    paddingVertical: theme.spacing.sm,
  },
  cardTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    textAlign: 'center',
    lineHeight: 16,
  },

  // Figma UI mystical corners
  mysticalCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: theme.colors.premiumGold,
    borderWidth: 2,
  },
  topLeft: {
    top: 4,
    left: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 4,
    right: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 4,
    left: 4,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 4,
    right: 4,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
});

TarotCard.displayName = 'TarotCard';