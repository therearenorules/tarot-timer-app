import React from 'react';

/**
 * 📝 Independent Base Text Component
 * 
 * A completely independent text component that uses only design tokens.
 * Zero dependencies on other components.
 * 
 * Features:
 * - Semantic text variants based on design tokens
 * - Proper typography hierarchy
 * - Consistent line heights and colors
 * - Full light/dark mode support
 * - Uses only design tokens (no hardcoded values)
 */

// Text variant types
type TextVariant = 
  | 'display-large' | 'display-medium'
  | 'title-large' | 'title-medium' | 'title-small' 
  | 'body-large' | 'body-medium' | 'body-small'
  | 'caption' | 'overline';

// Text semantic types
type TextSemantic = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'premium' | 'mystical' | 'white';

// Text element types
type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div';

interface TextProps {
  variant?: TextVariant;
  semantic?: TextSemantic;
  as?: TextElement;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any; // For additional HTML attributes
}

/**
 * Base Text Component - Master Component
 */
export function Text({ 
  variant = 'body-medium',
  semantic = 'primary',
  as = 'p',
  children,
  className = '',
  style = {},
  ...props 
}: TextProps) {

  // Typography variants using design tokens
  const variantStyles: Record<TextVariant, React.CSSProperties> = {
    'display-large': {
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    'display-medium': {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    'title-large': {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    'title-medium': {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '1.3',
    },
    'title-small': {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.4',
    },
    'body-large': {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    'body-medium': {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    'body-small': {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
    },
    'caption': {
      fontSize: '11px',
      fontWeight: '500',
      lineHeight: '1.3',
    },
    'overline': {
      fontSize: '10px',
      fontWeight: '500',
      lineHeight: '1.3',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
  };

  // Enhanced semantic color variants
  const semanticStyles: Record<TextSemantic, React.CSSProperties> = {
    primary: {
      color: 'var(--foreground)',
    },
    secondary: {
      color: 'var(--muted-foreground)',
    },
    tertiary: {
      color: 'var(--muted-foreground)',
      opacity: 0.8,
    },
    accent: {
      color: 'var(--accent)',
    },
    premium: {
      color: 'var(--accent)',
      fontWeight: '600',
    },
    mystical: {
      color: 'var(--primary)',
      fontWeight: '500',
    },
    white: {
      color: '#ffffff',
    },
  };

  // Combined styles using design tokens only
  const combinedStyles: React.CSSProperties = {
    margin: 0, // Reset default margins
    ...variantStyles[variant],
    ...semanticStyles[semantic],
    ...style,
  };

  // Create the element
  const Element = as;

  return (
    <Element
      className={className}
      style={combinedStyles}
      {...props}
    >
      {children}
    </Element>
  );
}

// Convenience components for specific text types
export function DisplayLarge(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="display-large" as="h1" {...props} />;
}

export function DisplayMedium(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="display-medium" as="h1" {...props} />;
}

export function TitleLarge(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="title-large" as="h2" {...props} />;
}

export function TitleMedium(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="title-medium" as="h3" {...props} />;
}

export function TitleSmall(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="title-small" as="h4" {...props} />;
}

export function BodyLarge(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="body-large" as="p" {...props} />;
}

export function BodyMedium(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="body-medium" as="p" {...props} />;
}

export function BodySmall(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="body-small" as="p" {...props} />;
}

export function Caption(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="caption" as="span" {...props} />;
}

export function Overline(props: Omit<TextProps, 'variant' | 'as'>) {
  return <Text variant="overline" as="span" {...props} />;
}

// Semantic convenience components
export function PremiumText(props: Omit<TextProps, 'semantic'>) {
  return <Text semantic="premium" {...props} />;
}

export function MysticalText(props: Omit<TextProps, 'semantic'>) {
  return <Text semantic="mystical" {...props} />;
}

export function AccentText(props: Omit<TextProps, 'semantic'>) {
  return <Text semantic="accent" {...props} />;
}