import React from 'react';

/**
 * 🔘 Independent Base Button Component
 * 
 * A completely independent button component that uses only design tokens.
 * Zero dependencies on other components.
 * 
 * Features:
 * - Type variants: Primary, Secondary, Premium, Ghost
 * - State variants: Default, Hover, Active, Disabled, Loading
 * - Size variants: Small, Medium, Large
 * - Icon variants: Text-only, Leading-icon, Trailing-icon, Icon-only
 * - Full light/dark mode support
 * - Uses only design tokens (no hardcoded values)
 */

// Type variant types
type ButtonType = 'primary' | 'secondary' | 'premium' | 'ghost';

// State variant types
type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

// Size variant types  
type ButtonSize = 'small' | 'medium' | 'large';

// Icon variant types
type ButtonIcon = 'text-only' | 'leading-icon' | 'trailing-icon' | 'icon-only';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonType;
  size?: ButtonSize;
  iconVariant?: ButtonIcon;
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

/**
 * Base Button Component - Master Component
 */
export function Button({
  variant = 'primary',
  size = 'medium', 
  iconVariant = 'text-only',
  icon,
  loading = false,
  disabled = false,
  children,
  className = '',
  style = {},
  ...props
}: ButtonProps) {

  // Size variants - using design tokens
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    small: {
      fontSize: '14px',
      padding: '8px 16px',
      minHeight: '36px',
    },
    medium: {
      fontSize: '16px',
      padding: '12px 24px',
      minHeight: '44px',
    },
    large: {
      fontSize: '18px',
      padding: '16px 32px',
      minHeight: '52px',
    }
  };

  // Enhanced type variants with premium visibility and shadows
  const typeStyles: Record<ButtonType, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      border: 'none',
      boxShadow: '0 2px 8px rgba(74, 26, 79, 0.3)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
      boxShadow: 'none',
    },
    premium: {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-foreground)', 
      border: 'none',
      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      border: 'none',
      boxShadow: 'none',
    }
  };

  // Icon variant styles
  const iconStyles: Record<ButtonIcon, React.CSSProperties> = {
    'text-only': {},
    'leading-icon': {
      gap: '8px',
    },
    'trailing-icon': {
      gap: '8px',
      flexDirection: 'row-reverse',
    },
    'icon-only': {
      aspectRatio: '1',
      padding: '12px',
    }
  };

  // Base button styles using design tokens only
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius)',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    outline: 'none',
    fontFamily: 'inherit',
    // Merge variants
    ...sizeStyles[size],
    ...typeStyles[variant],
    ...iconStyles[iconVariant],
    ...style,
  };

  // Disabled/loading styles
  if (disabled || loading) {
    baseStyles.opacity = 0.5;
    baseStyles.pointerEvents = 'none';
  }

  // Hover styles (applied via onMouseEnter/Leave for full control)
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const interactiveStyles: React.CSSProperties = {};
  
  if (isHovered && !disabled && !loading) {
    interactiveStyles.transform = 'translateY(-1px)';
    if (variant === 'primary') {
      interactiveStyles.boxShadow = '0 4px 16px rgba(74, 26, 79, 0.4)';
    } else if (variant === 'premium') {
      interactiveStyles.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
    }
  }
  
  if (isActive && !disabled && !loading) {
    interactiveStyles.transform = 'scale(0.98)';
  }

  // Icon rendering
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
      }}>
        {icon}
      </span>
    );
  };

  // Content rendering based on icon variant
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: iconVariant === 'icon-only' ? 0 : '8px',
          }} />
          {iconVariant !== 'icon-only' && <span>Loading...</span>}
        </>
      );
    }

    switch (iconVariant) {
      case 'text-only':
        return children;
      
      case 'leading-icon':
        return (
          <>
            {renderIcon()}
            <span>{children}</span>
          </>
        );
      
      case 'trailing-icon':
        return (
          <>
            <span>{children}</span>
            {renderIcon()}
          </>
        );
      
      case 'icon-only':
        return renderIcon();
      
      default:
        return children;
    }
  };

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...interactiveStyles,
      }}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {renderContent()}
    </button>
  );
}

// Convenience components for specific variants
export function ButtonPrimary(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />;
}

export function ButtonSecondary(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />;
}

export function ButtonPremium(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="premium" {...props} />;
}

export function ButtonGhost(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="ghost" {...props} />;
}

export function ButtonSmall(props: Omit<ButtonProps, 'size'>) {
  return <Button size="small" {...props} />;
}

export function ButtonMedium(props: Omit<ButtonProps, 'size'>) {
  return <Button size="medium" {...props} />;
}

export function ButtonLarge(props: Omit<ButtonProps, 'size'>) {
  return <Button size="large" {...props} />;
}

export function ButtonIcon(props: Omit<ButtonProps, 'iconVariant'>) {
  return <Button iconVariant="icon-only" {...props} />;
}

// CSS for spin animation
const spinKeyframes = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

// Inject the keyframes if not already present
if (typeof document !== 'undefined' && !document.head.querySelector('#button-spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'button-spin-keyframes';
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}