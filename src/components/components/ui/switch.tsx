import React from 'react';
import { Switch as RNSwitch, ViewStyle } from 'react-native';
import { theme } from '@/constants';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: SwitchProps) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.border,
        true: theme.colors.primary,
      }}
      thumbColor={checked ? '#FFFFFF' : '#FFFFFF'}
      style={style}
    />
  );
}

export { Switch };