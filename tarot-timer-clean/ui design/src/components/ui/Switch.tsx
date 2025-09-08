import React from 'react';
import { Switch as RNSwitch, Platform } from 'react-native';
import { colors } from '../../utils/colors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: 'rgba(255,255,255,0.2)',
        true: colors.dark.premiumGold,
      }}
      thumbColor={
        Platform.OS === 'ios' 
          ? '#ffffff' 
          : value 
            ? '#000000' 
            : '#ffffff'
      }
      ios_backgroundColor="rgba(255,255,255,0.2)"
    />
  );
}