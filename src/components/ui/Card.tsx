import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '@/constants';
import { Text } from './Text';

export type CardVariant = 'default' | 'elevated' | 'premium' | 'mystical';
export type CardSize = 'small' | 'medium' | 'large' | 'full';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: ViewStyle;
  noPadding?: boolean;
  glowEffect?: boolean;
}

/**
 * Enhanced Card Component matching design references
 * Features purple backgrounds with golden accents
 */
export function Card({
  children,
  variant = 'default',
  size = 'medium',
  style,
  noPadding = false,
  glowEffect = false,
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg, // Large radius matching design
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    };

    // Size styles
    const sizeStyles: Record<CardSize, ViewStyle> = {
      small: {
        padding: noPadding ? 0 : theme.spacing.md,
        minHeight: 80,
      },
      medium: {
        padding: noPadding ? 0 : theme.spacing.lg,
        minHeight: 120,
      },
      large: {
        padding: noPadding ? 0 : theme.spacing.xl,
        minHeight: 200,
      },
      full: {
        padding: noPadding ? 0 : theme.spacing.lg,
        flex: 1,
      },
    };

    // Variant styles matching design references
    const variantStyles: Record<CardVariant, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.surface, // Purple surface
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.mystical.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 2,
      },
      elevated: {
        backgroundColor: theme.colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: theme.colors.borderSecondary,
        shadowColor: theme.colors.mystical.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
      },
      premium: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.premiumGold,
        shadowColor: theme.colors.premiumGold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 6,
      },
      mystical: {
        backgroundColor: theme.colors.backgroundTertiary,
        borderWidth: 1,
        borderColor: theme.colors.mystical.border,
        shadowColor: theme.colors.mystical.glow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getGlowStyle = (): ViewStyle => {
    if (!glowEffect) return {};
    
    return {
      shadowColor: theme.colors.premiumGold,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 8,
    };
  };

  return (
    <View 
      style={[
        getCardStyle(),
        glowEffect && getGlowStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Card Header Component
 */
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ title, subtitle, children, style }: CardHeaderProps) {
  return (
    <View style={[styles.cardHeader, style]}>
      {children || (
        <View>
          {title && (
            <Text 
              variant="title3" 
              color={theme.colors.text}
              style={styles.cardTitle}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text 
              variant="body" 
              color={theme.colors.textSecondary}
              style={styles.cardSubtitle}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Card Content Component
 */
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
}

/**
 * Card Footer Component
 */
interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <View style={[styles.cardFooter, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    marginTop: theme.spacing.md,
  },
});