import React from 'react';
import { TextInput, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { theme } from '@/constants';

interface TextareaProps extends Omit<TextInputProps, 'style'> {
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

function Textarea({
  style,
  inputStyle,
  placeholderTextColor = theme.colors.textSecondary,
  ...props
}: TextareaProps) {
  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    minHeight: 64,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...style,
  };

  const textInputStyle: TextStyle = {
    color: theme.colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
    ...inputStyle,
  };

  return (
    <TextInput
      style={textInputStyle}
      placeholderTextColor={placeholderTextColor}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

export { Textarea };
