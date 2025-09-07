import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/DesignTokens';
import { TarotAnimations } from '../../constants/Animations';

export interface MemoPadProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  variant?: 'default' | 'mystical' | 'minimal';
  size?: 'compact' | 'regular' | 'large';
  showWordCount?: boolean;
  showTimestamp?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
  onSave?: (text: string) => void;
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const MemoPad: React.FC<MemoPadProps> = ({
  value,
  onChangeText,
  placeholder = 'Write your thoughts...',
  maxLength = 1000,
  variant = 'default',
  size = 'regular',
  showWordCount = true,
  showTimestamp = false,
  autoFocus = false,
  editable = true,
  multiline = true,
  numberOfLines = 5,
  style,
  inputStyle,
  onFocus,
  onBlur,
  onSave,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textInputRef = useRef<TextInput>(null);
  
  const focusAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;

  useEffect(() => {
    if (isFocused) {
      focusAnimation.value = withTiming(1, {
        duration: TarotAnimations.timing.fast,
        easing: TarotAnimations.easing.easeOut,
      });

      if (variant === 'mystical') {
        glowAnimation.value = withTiming(1, {
          duration: TarotAnimations.timing.medium,
          easing: TarotAnimations.easing.mystical,
        });
      }
    } else {
      focusAnimation.value = withTiming(0, {
        duration: TarotAnimations.timing.fast,
        easing: TarotAnimations.easing.easeIn,
      });
      glowAnimation.value = withTiming(0, {
        duration: TarotAnimations.timing.medium,
      });
    }
  }, [isFocused, variant, focusAnimation, glowAnimation]);

  const getSizeConfig = () => {
    switch (size) {
      case 'compact':
        return {
          minHeight: 80,
          padding: spacing.md,
          fontSize: typography.size.bodySmall,
          lineHeight: typography.size.bodySmall * typography.lineHeight.normal,
        };
      case 'large':
        return {
          minHeight: 200,
          padding: spacing['3xl'],
          fontSize: typography.size.bodyLarge,
          lineHeight: typography.size.bodyLarge * typography.lineHeight.relaxed,
        };
      default: // regular
        return {
          minHeight: 120,
          padding: spacing['2xl'],
          fontSize: typography.size.bodyMedium,
          lineHeight: typography.size.bodyMedium * typography.lineHeight.relaxed,
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'mystical':
        return {
          backgroundColor: colors.card.background,
          borderWidth: 1,
          borderColor: colors.primary.main,
          borderRadius: radius['2xl'],
          ...shadows.mystical,
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.card.border,
          borderRadius: 0,
        };
      default:
        return {
          backgroundColor: colors.card.background,
          borderWidth: 1,
          borderColor: colors.card.border,
          borderRadius: radius.xl,
          ...shadows.medium,
        };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = variant === 'mystical' && isFocused
      ? colors.primary.main
      : isFocused
        ? colors.primary.light
        : variant === 'mystical'
          ? colors.primary.main
          : colors.card.border;

    const shadowOpacity = variant === 'mystical'
      ? glowAnimation.value * 0.8
      : focusAnimation.value * 0.3;

    const shadowRadius = variant === 'mystical'
      ? glowAnimation.value * 16 + 8
      : focusAnimation.value * 8 + 4;

    return {
      borderColor: withTiming(borderColor, { duration: TarotAnimations.timing.fast }),
      shadowOpacity,
      shadowRadius,
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleSave = () => {
    if (onSave) {
      onSave(value);
      setLastSaved(new Date());
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sizeConfig = getSizeConfig();
  const variantStyles = getVariantStyles();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.keyboardAvoidingView, style]}
    >
      <AnimatedView
        style={[
          styles.container,
          variantStyles,
          animatedStyle,
        ]}
        testID={testID}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              {
                minHeight: sizeConfig.minHeight,
                padding: sizeConfig.padding,
                fontSize: sizeConfig.fontSize,
                lineHeight: sizeConfig.lineHeight,
                color: editable ? colors.text.primary : colors.text.secondary,
              },
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoFocus={autoFocus}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            textAlignVertical="top"
            testID={`${testID}-input`}
          />
        </ScrollView>

        {(showWordCount || showTimestamp || onSave) && (
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {showWordCount && (
                <Text style={styles.countText}>
                  {wordCount} words • {charCount}/{maxLength} chars
                </Text>
              )}
              {showTimestamp && lastSaved && (
                <Text style={styles.timestampText}>
                  Saved at {formatTimestamp(lastSaved)}
                </Text>
              )}
            </View>

            {onSave && (
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  variant === 'mystical' && styles.saveButtonMystical,
                ]}
                onPress={handleSave}
                disabled={!editable || value.trim().length === 0}
                testID={`${testID}-save`}
              >
                <Text 
                  style={[
                    styles.saveButtonText,
                    variant === 'mystical' && styles.saveButtonTextMystical,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </AnimatedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  } as ViewStyle,

  container: {
    flex: 1,
    overflow: 'hidden',
  } as ViewStyle,

  scrollContainer: {
    flex: 1,
  } as ViewStyle,

  textInput: {
    flex: 1,
    textAlignVertical: 'top',
    fontFamily: typography.fontFamily.default,
    fontWeight: typography.weight.regular,
  } as TextStyle,

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
    backgroundColor: colors.background.secondary,
  } as ViewStyle,

  footerLeft: {
    flex: 1,
  } as ViewStyle,

  countText: {
    fontSize: typography.size.caption,
    color: colors.text.tertiary,
    fontWeight: typography.weight.regular,
  } as TextStyle,

  timestampText: {
    fontSize: typography.size.caption,
    color: colors.text.quaternary,
    fontWeight: typography.weight.regular,
    marginTop: 2,
  } as TextStyle,

  saveButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    ...shadows.small,
  } as ViewStyle,

  saveButtonMystical: {
    ...shadows.mystical,
  } as ViewStyle,

  saveButtonText: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.medium,
    color: colors.background.primary,
    textAlign: 'center',
  } as TextStyle,

  saveButtonTextMystical: {
    color: colors.background.primary,
    fontWeight: typography.weight.semibold,
  } as TextStyle,
});

export default MemoPad;