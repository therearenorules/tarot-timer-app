import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../utils/colors';
import { typography } from '../../utils/styles';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({ 
  children, 
  variant = 'default',
  style,
  textStyle
}: BadgeProps) {
  const badgeStyles = [
    styles.container,
    styles[variant],
    style
  ];

  const badgeTextStyles = [
    styles.text,
    styles[`${variant}Text`],
    textStyle
  ];

  return (
    <View style={badgeStyles}>
      <Text style={badgeTextStyles}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  default: {
    backgroundColor: colors.dark.premiumGold,
  },
  secondary: {
    backgroundColor: colors.dark.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  destructive: {
    backgroundColor: '#dc2626',
  },
  
  // Text styles
  text: {
    ...typography.caption,
    fontWeight: '500',
  },
  defaultText: {
    color: '#000000',
  },
  secondaryText: {
    color: colors.dark.foreground,
  },
  outlineText: {
    color: colors.dark.foreground,
  },
  destructiveText: {
    color: colors.dark.foreground,
  },
});