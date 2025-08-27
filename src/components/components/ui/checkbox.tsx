import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { theme } from '@/constants';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  const checkboxStyle: ViewStyle = {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: disabled ? theme.colors.border : theme.colors.primary,
    backgroundColor: checked ? theme.colors.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
    >
      <View style={checkboxStyle}>
        {checked && (
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 1,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

export { Checkbox };