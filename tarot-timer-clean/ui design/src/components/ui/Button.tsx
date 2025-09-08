import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../utils/colors';
import { typography, shadows } from '../../utils/styles';
import { buttonPressFeedback } from '../../utils/haptics';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ 
  children, 
  onPress, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  style, 
  textStyle,
}: ButtonProps) {
  const handlePress = () => {
    buttonPressFeedback();
    onPress();
  };

  const buttonStyles = [
    styles.container,
    styles[size],
    variant === 'outline' && styles.outline,
    variant === 'secondary' && styles.secondary,
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    textStyle
  ];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        style={buttonStyles}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={textStyles}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.dark.premiumGold : "#fff"} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  
  // Variants
  secondary: {
    backgroundColor: colors.dark.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  
  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  smText: {
    ...typography.bodyMedium,
  },
  mdText: {
    ...typography.bodyLarge,
  },
  lgText: {
    fontSize: 18,
    lineHeight: 24,
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: colors.dark.foreground,
  },
  outlineText: {
    color: colors.dark.foreground,
  },
  
  disabled: {
    opacity: 0.5,
  },
});