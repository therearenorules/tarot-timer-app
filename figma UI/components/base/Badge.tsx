import React from 'react';

/**
 * 🏷️ Independent Base Badge Component
 * 
 * A completely independent badge component that uses only design tokens.
 * Zero dependencies on other components.
 * 
 * Features:
 * - Type variants: Premium, Notification, Status, Info
 * - Size variants: Small, Medium
 * - Full light/dark mode support
 * - Uses only design tokens (no hardcoded values)
 */

// Badge type variants
type BadgeType = 'premium' | 'notification' | 'status' | 'info' | 'outline';

// Badge size variants
type BadgeSize = 'small' | 'medium';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeType;
  size?: BadgeSize;
  children: React.ReactNode;
}

/**
 * Base Badge Component - Master Component
 */
export function Badge({ 
  variant = 'info',
  size = 'small',
  children,
  className = '',
  style = {},
  ...props 
}: BadgeProps) {

  // Size variants using design tokens
  const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
    small: {
      fontSize: 'var(--text-caption)', // 11px
      padding: 'var(--space-xxs) var(--space-xs)', // 2px 4px
      minHeight: '18px',
    },
    medium: {
      fontSize: 'var(--text-body-small)', // 12px
      padding: 'var(--space-xs) var(--space-s)', // 4px 8px
      minHeight: '22px',
    }
  };

  // Type variants using design tokens
  const typeStyles: Record<BadgeType, React.CSSProperties> = {
    premium: {
      backgroundColor: 'var(--brand-accent)', // Gold
      color: 'var(--brand-primary)', // Deep Purple
      border: 'none',
    },
    notification: {
      backgroundColor: 'var(--state-error)', // Error red
      color: 'var(--brand-white)',
      border: 'none',
    },
    status: {
      backgroundColor: 'var(--state-success)', // Success green
      color: 'var(--brand-white)',
      border: 'none',
    },
    info: {
      backgroundColor: 'var(--color-surface-elevated)',
      color: 'var(--color-text-secondary)',
      border: '1px solid var(--color-border-default)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--brand-primary)',
      border: '1px solid var(--brand-primary)',
    }
  };

  // Base badge styles using design tokens only
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-small)', // 4px
    fontWeight: 'var(--font-weight-medium)',
    lineHeight: 'var(--line-height-normal)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    position: 'relative',
    // Merge size and type styles
    ...sizeStyles[size],
    ...typeStyles[variant],
    ...style,
  };

  return (
    <span
      className={className}
      style={baseStyles}
      {...props}
    >
      {children}
    </span>
  );
}

// Convenience components for specific variants
export function BadgePremium(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="premium" {...props} />;
}

export function BadgeNotification(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="notification" {...props} />;
}

export function BadgeStatus(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="status" {...props} />;
}

export function BadgeInfo(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="info" {...props} />;
}

export function BadgeOutline(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="outline" {...props} />;
}

export function BadgeSmall(props: Omit<BadgeProps, 'size'>) {
  return <Badge size="small" {...props} />;
}

export function BadgeMedium(props: Omit<BadgeProps, 'size'>) {
  return <Badge size="medium" {...props} />;
}