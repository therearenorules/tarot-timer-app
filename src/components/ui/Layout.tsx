import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { theme } from '@/constants';
import { Text } from './Text';

// Fallback gradient component using View with solid background
const GradientFallback = ({ colors, style, children }: any) => (
  <View style={[style, { backgroundColor: colors[0] }]}>
    {children}
  </View>
);

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Main Layout Component matching design references
 * Features deep purple gradient backgrounds
 */
export function Layout({
  children,
  title,
  subtitle,
  showHeader = true,
  gradient = true,
  style,
  contentStyle,
}: LayoutProps) {
  const backgroundComponent = gradient ? (
    <GradientFallback
      colors={[
        theme.colors.background,
        theme.colors.surface,
        theme.colors.background,
      ]}
      style={StyleSheet.absoluteFill}
    />
  ) : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]} />
  );

  return (
    <View style={[styles.container, style]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      
      {backgroundComponent}
      
      {showHeader && (title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text variant="title1" color={theme.colors.text} style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

/**
 * Screen Header Component matching design references
 */
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  centered?: boolean;
  style?: ViewStyle;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  icon, 
  action, 
  centered = true,
  style 
}: ScreenHeaderProps) {
  return (
    <View style={[styles.screenHeader, centered && styles.screenHeaderCentered, style]}>
      <View style={styles.screenHeaderContent}>
        {icon && (
          <View style={styles.screenHeaderIcon}>
            {icon}
          </View>
        )}
        
        <View style={styles.screenHeaderText}>
          <Text 
            variant="title2" 
            color={theme.colors.text}
            style={[styles.screenHeaderTitle, centered && styles.textCentered]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              variant="body" 
              color={theme.colors.textSecondary}
              style={[styles.screenHeaderSubtitle, centered && styles.textCentered]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        
        {action && (
          <View style={styles.screenHeaderAction}>
            {action}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Content Section Component
 */
interface ContentSectionProps {
  children: React.ReactNode;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function ContentSection({ 
  children, 
  spacing = 'medium',
  style 
}: ContentSectionProps) {
  const spacingValues = {
    none: 0,
    small: theme.spacing.sm,
    medium: theme.spacing.lg,
    large: theme.spacing.xl,
  };

  return (
    <View style={[{ marginBottom: spacingValues[spacing] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  // Screen Header styles
  screenHeader: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  screenHeaderCentered: {
    alignItems: 'center',
  },
  screenHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  screenHeaderIcon: {
    marginRight: theme.spacing.md,
  },
  screenHeaderText: {
    flex: 1,
  },
  screenHeaderTitle: {
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  screenHeaderSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  screenHeaderAction: {
    marginLeft: theme.spacing.md,
  },
  textCentered: {
    textAlign: 'center',
  },
});