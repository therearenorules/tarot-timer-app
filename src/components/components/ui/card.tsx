import React from 'react';
import { View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';

interface CardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardHeaderProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardTitleProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

interface CardDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

interface CardContentProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardFooterProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardActionProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

function Card({ style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardHeader({ style, children, ...props }: CardHeaderProps) {
  return (
    <View
      style={[
        styles.cardHeader,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardTitle({ style, children, ...props }: CardTitleProps) {
  const titleStyle = {
    marginBottom: theme.spacing.xs,
    ...style,
  };

  return (
    <Text
      variant="h4"
      style={titleStyle}
      {...props}
    >
      {children}
    </Text>
  );
}

function CardDescription({ style, children, ...props }: CardDescriptionProps) {
  const descriptionStyle = {
    marginBottom: theme.spacing.sm,
    ...style,
  };

  return (
    <Text
      variant="body"
      color={theme.colors.textSecondary}
      style={descriptionStyle}
      {...props}
    >
      {children}
    </Text>
  );
}

function CardAction({ style, children, ...props }: CardActionProps) {
  return (
    <View
      style={[
        styles.cardAction,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardContent({ style, children, ...props }: CardContentProps) {
  return (
    <View
      style={[
        styles.cardContent,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

function CardFooter({ style, children, ...props }: CardFooterProps) {
  return (
    <View
      style={[
        styles.cardFooter,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardAction: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  cardContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

const textStyles = StyleSheet.create({
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    marginBottom: theme.spacing.sm,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
