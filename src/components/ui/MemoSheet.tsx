import React from 'react';
import { Modal, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';

interface Props {
  visible: boolean;
  hour: number;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function MemoSheet({ visible, hour, value, onChangeText, onSave, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.sheet}>
          <Text variant="title3" style={styles.title}>Hour {hour.toString().padStart(2, '0')} Memo</Text>
          <TextInput
            style={styles.input}
            multiline
            value={value}
            onChangeText={onChangeText}
            placeholder="Write your insight for this hour..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          <View style={styles.actions}>
            <Button title="Cancel" onPress={onClose} variant="outline" style={styles.button} />
            <Button title="Save" onPress={onSave} variant="primary" style={styles.button} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});




