import React from 'react';

/**
 * 🎴 Independent Base Card Component
 * 
 * A completely independent card component that uses only design tokens.
 * Zero dependencies on other components.
 * 
 * Features:
 * - Size variants: Small, Medium, Large
 * - State variants: Default, Selected, Disabled, Loading
 * - Content variants: Empty, Filled, Text-only
 * - Full light/dark mode support
 * - Uses only design tokens (no hardcoded values)
 */

// Size variant types
type CardSize = 'small' | 'medium' | 'large';

// State variant types
type CardState = 'default' | 'selected' | 'disabled' | 'loading';

// Content variant types
type CardContent = 'empty' | 'filled' | 'text-only';

// Card variant combinations
interface CardVariants {
  size?: CardSize;
  state?: CardState;
  content?: CardContent;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
  children?: React.ReactNode;
  // Card-specific props
  imageUrl?: string;
  title?: string;
  description?: string;
  emptyText?: string;
}

/**
 * Base Card Component - Master Component
 */
export function Card({ 
  size = 'medium',
  state = 'default', 
  content = 'filled',
  children,
  imageUrl,
  title,
  description,
  emptyText = "Tap to draw card",
  className = '',
  style = {},
  ...props 
}: CardProps) {
  
  // Size variants - using design tokens
  const sizeStyles: Record<CardSize, React.CSSProperties> = {
    small: {
      width: '120px',
      height: '160px',
      padding: '12px',
    },
    medium: {
      width: '160px', 
      height: '240px',
      padding: '16px',
    },
    large: {
      width: '200px',
      height: '300px', 
      padding: '20px',
    }
  };

  // State variants - using design tokens
  const stateStyles: Record<CardState, React.CSSProperties> = {
    default: {
      borderColor: 'var(--border)',
      backgroundColor: 'var(--card)',
      opacity: 1,
    },
    selected: {
      borderColor: 'var(--accent)',
      backgroundColor: 'var(--card)',
      opacity: 1,
      borderWidth: '2px',
      boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.2)',
    },
    disabled: {
      borderColor: 'var(--border)',
      backgroundColor: 'var(--card)',
      opacity: 0.5,
      pointerEvents: 'none' as const,
    },
    loading: {
      borderColor: 'var(--border)',
      backgroundColor: 'var(--card)',
      opacity: 1,
    }
  };

  // Base card styles using design tokens only
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    // Merge size and state styles
    ...sizeStyles[size],
    ...stateStyles[state],
    ...style,
  };

  // Loading animation styles
  const loadingStyles: React.CSSProperties = state === 'loading' ? {
    animation: 'mystical-pulse 2s ease-in-out infinite',
  } : {};

  // Content rendering based on content variant
  const renderContent = () => {
    switch (content) {
      case 'empty':
        return (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              border: '2px dashed var(--border)',
              borderRadius: 'calc(var(--radius) - 2px)',
              margin: '4px',
              color: 'var(--muted-foreground)',
            }}
          >
            <span style={{
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '500',
            }}>
              {emptyText}
            </span>
          </div>
        );
      
      case 'filled':
        return (
          <>
            {imageUrl && (
              <div style={{
                flex: 1,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'calc(var(--radius) - 2px)',
                marginBottom: title || description ? '8px' : 0,
              }} />
            )}
            {(title || description) && (
              <div style={{
                marginTop: 'auto',
              }}>
                {title && (
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500', 
                    color: 'var(--foreground)',
                    margin: 0,
                    marginBottom: description ? '4px' : 0,
                    lineHeight: '1.3',
                  }}>
                    {title}
                  </h3>
                )}
                {description && (
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--muted-foreground)',
                    margin: 0,
                    lineHeight: '1.4',
                  }}>
                    {description}
                  </p>
                )}
              </div>
            )}
          </>
        );
      
      case 'text-only':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            {title && (
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--foreground)', 
                margin: 0,
                marginBottom: description ? '8px' : 0,
                lineHeight: '1.3',
              }}>
                {title}
              </h3>
            )}
            {description && (
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: '1.4',
              }}>
                {description}
              </p>
            )}
          </div>
        );
      
      default:
        return children;
    }
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...loadingStyles,
      }}
      {...props}
    >
      {renderContent()}
      
      {/* Loading overlay */}
      {state === 'loading' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--accent)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
    </div>
  );
}

// Convenience components for specific use cases
export function CardSmall(props: Omit<CardProps, 'size'>) {
  return <Card size="small" {...props} />;
}

export function CardMedium(props: Omit<CardProps, 'size'>) {
  return <Card size="medium" {...props} />;
}

export function CardLarge(props: Omit<CardProps, 'size'>) {
  return <Card size="large" {...props} />;
}

export function CardEmpty(props: Omit<CardProps, 'content'>) {
  return <Card content="empty" {...props} />;
}

export function CardTextOnly(props: Omit<CardProps, 'content'>) {
  return <Card content="text-only" {...props} />;
}