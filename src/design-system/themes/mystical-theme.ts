/**
 * 🔮 Complete Mystical Theme System
 * Unified theme combining all design tokens for the tarot experience
 */

import { MysticalColors } from '../tokens/mystical-colors';
import { MysticalTypography } from '../tokens/typography';
import { MysticalSpacing } from '../tokens/spacing';

export const MysticalTheme = {
  // Color system
  colors: MysticalColors,
  
  // Typography system  
  typography: MysticalTypography,
  
  // Spacing system
  spacing: MysticalSpacing,

  // Shadow definitions
  shadows: {
    mysticalGlow: {
      shadowColor: MysticalColors.sacred.aurum,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    goldGlow: {
      shadowColor: MysticalColors.sacred.premiumGold,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    cosmicGlow: {
      shadowColor: MysticalColors.glow.cosmic,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    cardShadow: {
      shadowColor: MysticalColors.sacred.premiumGold,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    buttonShadow: {
      shadowColor: MysticalColors.sacred.aurum,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    }
  },

  // Component style presets
  components: {
    // Screen containers
    screenContainer: {
      flex: 1,
      backgroundColor: MysticalColors.cosmic.deepSpace,
    },
    
    // Background gradients
    cosmicBackground: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    // Header styles
    mysticalHeader: {
      alignItems: 'center' as const,
      paddingTop: MysticalSpacing.components.header.paddingTop,
      paddingBottom: MysticalSpacing.components.header.paddingBottom,
      paddingHorizontal: MysticalSpacing.components.header.paddingHorizontal,
    },

    // Title styles
    cosmicTitle: {
      ...MysticalTypography.styles.mysticalTitle,
      color: MysticalColors.sacred.aurum,
      textAlign: 'center' as const,
      marginBottom: MysticalSpacing.components.header.titleMarginBottom,
      textShadowColor: MysticalColors.sacred.aurum,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 15,
    },

    // Subtitle styles
    mysticalSubtitle: {
      ...MysticalTypography.styles.subtitle,
      color: MysticalColors.text.primary,
      textAlign: 'center' as const,
      marginBottom: MysticalSpacing.components.header.subtitleMarginBottom,
      textShadowColor: MysticalColors.glow.cosmic,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },

    // Card styles
    mysticalCard: {
      backgroundColor: MysticalColors.components.card.background,
      borderRadius: MysticalSpacing.borderRadius.lg,
      borderWidth: 1,
      borderColor: MysticalColors.components.card.border,
      padding: MysticalSpacing.components.card.padding,
      margin: MysticalSpacing.components.card.margin,
    },

    // Glass morphism effect
    glassMorphism: {
      backgroundColor: MysticalColors.components.glass.background,
      borderRadius: MysticalSpacing.borderRadius.lg,
      borderWidth: 1,
      borderColor: MysticalColors.components.glass.border,
      backdropFilter: 'blur(20px)',
    },

    // Button styles
    primaryButton: {
      backgroundColor: MysticalColors.components.button.primary,
      paddingVertical: MysticalSpacing.components.button.paddingVertical,
      paddingHorizontal: MysticalSpacing.components.button.paddingHorizontal,
      borderRadius: MysticalSpacing.components.button.borderRadius,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    secondaryButton: {
      backgroundColor: MysticalColors.components.button.secondary,
      paddingVertical: MysticalSpacing.components.button.paddingVertical,
      paddingHorizontal: MysticalSpacing.components.button.paddingHorizontal,
      borderRadius: MysticalSpacing.components.button.borderRadius,
      borderWidth: 1,
      borderColor: MysticalColors.sacred.premiumGold,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    // Icon container
    iconContainer: {
      position: 'relative' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    // Tab bar styles
    tabBar: {
      backgroundColor: MysticalColors.cosmic.voidPurple + MysticalColors.opacity[95],
      borderTopWidth: 1,
      borderTopColor: MysticalColors.sacred.premiumGold + MysticalColors.opacity[30],
      paddingBottom: MysticalSpacing.spacing[2],
      paddingTop: MysticalSpacing.spacing[4],
      height: MysticalSpacing.components.tabBar.height,
    },

    tabButton: {
      flex: 1,
      alignItems: 'center' as const,
      paddingVertical: MysticalSpacing.components.tabBar.buttonPadding,
      paddingHorizontal: MysticalSpacing.spacing[1],
      borderRadius: MysticalSpacing.borderRadius.md,
      backgroundColor: 'transparent',
    },

    tabButtonActive: {
      backgroundColor: MysticalColors.sacred.premiumGold + MysticalColors.opacity[20],
    },

    // Input styles
    textInput: {
      backgroundColor: MysticalColors.components.glass.background,
      borderRadius: MysticalSpacing.borderRadius.base,
      borderWidth: 1,
      borderColor: MysticalColors.components.glass.border,
      padding: MysticalSpacing.spacing[4],
      color: MysticalColors.text.primary,
      ...MysticalTypography.styles.bodyMedium,
    },

    // Time display
    timeDisplay: {
      alignItems: 'center' as const,
      marginTop: MysticalSpacing.spacing[6],
    },

    timeValue: {
      ...MysticalTypography.styles.timeDisplay,
      color: MysticalColors.text.primary,
      textShadowColor: MysticalColors.sacred.premiumGold + MysticalColors.opacity[60],
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },

    timeLabel: {
      ...MysticalTypography.styles.timeLabel,
      color: MysticalColors.sacred.premiumGold + MysticalColors.opacity[80],
      textTransform: 'uppercase' as const,
      marginBottom: MysticalSpacing.spacing[1],
    },

    // Keyword tags
    keywordTag: {
      backgroundColor: MysticalColors.sacred.premiumGold + MysticalColors.opacity[20],
      borderRadius: MysticalSpacing.borderRadius.sm,
      paddingHorizontal: MysticalSpacing.spacing[2],
      paddingVertical: MysticalSpacing.spacing[1],
      margin: MysticalSpacing.spacing[1],
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },

    keywordText: {
      ...MysticalTypography.styles.keyword,
      color: MysticalColors.sacred.premiumGold,
    },

    // Loading spinner container
    loadingContainer: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: MysticalSpacing.spacing[8],
    },

    // Floating elements
    floatingElement: {
      position: 'absolute' as const,
    },

    // Glow effects
    glowEffect: {
      position: 'absolute' as const,
      backgroundColor: MysticalColors.sacred.premiumGold,
      opacity: 0.3,
      borderRadius: MysticalSpacing.borderRadius.full,
    }
  },

  // Animation configurations
  animations: {
    timing: MysticalSpacing.timing,
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    }
  }
};

export default MysticalTheme;