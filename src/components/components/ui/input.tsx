import React from 'react';
import { TextInput, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { theme } from '@/constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

function Input({
  style,
  inputStyle,
  placeholderTextColor = theme.colors.textSecondary,
  ...props
}: InputProps) {
  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    ...style,
  };

  const textInputStyle: TextStyle = {
    color: theme.colors.text,
    fontSize: 16,
    ...inputStyle,
  };

  return (
    <TextInput
      style={textInputStyle}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export { Input };
