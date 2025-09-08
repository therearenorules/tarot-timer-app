import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignTokens } from '../../constants/DesignTokens';

interface MysticalButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const MysticalButton: React.FC<MysticalButtonProps> = ({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
}) => {
  const buttonText = children || title;
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.container, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={DesignTokens.colors.button.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[styles.primaryText, textStyle]}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, styles.secondaryContainer, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.secondaryText, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: DesignTokens.spacing.borderRadius.button,
    overflow: 'hidden',
    ...DesignTokens.shadows.button,
  },
  gradient: {
    paddingVertical: DesignTokens.spacing.buttonPadding.vertical,
    paddingHorizontal: DesignTokens.spacing.buttonPadding.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryContainer: {
    backgroundColor: DesignTokens.colors.accent.overlay,
    borderWidth: 1,
    borderColor: DesignTokens.colors.button.border,
    paddingVertical: DesignTokens.spacing.buttonPadding.vertical,
    paddingHorizontal: DesignTokens.spacing.buttonPadding.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: DesignTokens.colors.button.text,
    fontSize: DesignTokens.fonts.sizes.bodyLarge,
    fontWeight: DesignTokens.fonts.weights.semibold,
  },
  secondaryText: {
    color: DesignTokens.colors.text.primary,
    fontSize: DesignTokens.fonts.sizes.bodyLarge,
    fontWeight: DesignTokens.fonts.weights.medium,
  },
});