import React, { createContext, useContext, useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { Button } from './button';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onPress?: () => void;
}

function DialogTrigger({ children, asChild = false, onPress }: DialogTriggerProps) {
  const context = useContext(DialogContext);

  const handlePress = () => {
    onPress?.();
    context?.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement;
    return React.cloneElement(childElement, {
      onPress: handlePress,
    } as any);
  }

  return (
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function DialogContent({ children, style }: DialogContentProps) {
  const context = useContext(DialogContext);

  if (!context?.open) return null;

  return (
    <Modal
      visible={context.open}
      transparent
      animationType="fade"
      onRequestClose={() => context.onOpenChange(false)}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => context.onOpenChange(false)}
      >
        <Pressable style={[styles.content, style]} onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function DialogHeader({ children, style }: DialogHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function DialogTitle({ children, style }: DialogTitleProps) {
  return (
    <Text variant="h4" style={[styles.title, style]}>
      {children}
    </Text>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function DialogDescription({ children, style }: DialogDescriptionProps) {
  return (
    <Text
      variant="body"
      color={theme.colors.textSecondary}
      style={[styles.description, style]}
    >
      {children}
    </Text>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function DialogFooter({ children, style }: DialogFooterProps) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
});

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};