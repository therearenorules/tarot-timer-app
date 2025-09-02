import React from 'react';
import { Icon } from '../base/Icon';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';
import { Button } from '../base/Button';

/**
 * 📝 Composite List Item Component
 * 
 * Flexible list item assembled from base components.
 * Uses only base components and design tokens.
 * 
 * Features:
 * - Multiple layout variants (icon-text, thumbnail-text, text-only, text-action, complex)
 * - Specific use cases (daily-entry, spread-entry, settings-item, theme-item)
 * - Badge and action support
 * - Thumbnail image support
 * - Touch-friendly 56pt minimum height
 * - Full independence from other composites
 */

// Layout variants
type ListItemLayout = 'icon-text' | 'thumbnail-text' | 'text-only' | 'text-action' | 'complex';

// Specific use case variants
type ListItemUseCase = 'daily-entry' | 'spread-entry' | 'settings-item' | 'theme-item' | 'custom';

interface ListItemAction {
  icon?: 'share' | 'delete' | 'save' | 'edit' | 'forward' | 'close';
  label?: string;
  variant?: 'ghost' | 'primary' | 'secondary' | 'premium';
  onClick: () => void;
}

interface ListItemProps {
  layout?: ListItemLayout;
  useCase?: ListItemUseCase;
  
  // Content
  title: string;
  subtitle?: string;
  description?: string;
  
  // Left element
  icon?: 'timer' | 'spreads' | 'journal' | 'settings' | 'card-outline' | 'card-filled' | 'star' | 'shuffle';
  iconColor?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  
  // Right element
  badge?: {
    text: string;
    variant?: 'premium' | 'notification' | 'status' | 'info' | 'outline';
  };
  action?: ListItemAction;
  toggle?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
  
  // Interaction
  onClick?: () => void;
  disabled?: boolean;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Thumbnail Component - Internal composite
 */
function Thumbnail({ url, alt, size = 40 }: { url: string; alt: string; size?: number }) {
  const thumbnailStyles: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: 'var(--radius-small)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-elevated)',
    border: '1px solid var(--color-border-default)',
    flexShrink: 0,
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={thumbnailStyles}>
      <img src={url} alt={alt} style={imageStyles} />
    </div>
  );
}

/**
 * Toggle Switch Component - Internal composite
 */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  const containerStyles: React.CSSProperties = {
    width: '44px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: checked ? 'var(--brand-accent)' : 'var(--color-border-default)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '2px',
  };

  const thumbStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-white)',
    position: 'absolute',
    top: '2px',
    left: checked ? '22px' : '2px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div 
      style={containerStyles}
      onClick={() => onChange(!checked)}
    >
      <div style={thumbStyles} />
    </div>
  );
}

/**
 * Main List Item Component
 */
export function ListItem({
  layout = 'text-only',
  useCase = 'custom',
  title,
  subtitle,
  description,
  icon,
  iconColor = 'var(--color-text-secondary)',
  thumbnailUrl,
  thumbnailAlt = '',
  badge,
  action,
  toggle,
  onClick,
  disabled = false,
  className = '',
  style = {},
}: ListItemProps) {

  // Container styles using design tokens only
  const containerStyles: React.CSSProperties = {
    width: '100%',
    minHeight: '56px', // Touch-friendly minimum
    backgroundColor: 'var(--color-surface-base)',
    borderBottom: '1px solid var(--color-divider)',
    padding: 'var(--space-s) var(--space-m)', // 8px vertical, 16px horizontal
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-m)',
    cursor: onClick && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.3s ease',
    position: 'relative',
    ...style,
  };

  // Hover styles for interactive items
  const [isHovered, setIsHovered] = React.useState(false);
  const interactiveStyles: React.CSSProperties = onClick && !disabled && isHovered ? {
    backgroundColor: 'var(--color-surface-elevated)',
  } : {};

  // Left element (icon or thumbnail)
  const leftElementStyles: React.CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Content area styles
  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xxs)',
    minWidth: 0, // Allow text truncation
  };

  // Right element styles
  const rightElementStyles: React.CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-s)',
  };

  // Text container for title/subtitle
  const textContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xxs)',
    minWidth: 0,
  };

  // Use case specific content adjustments
  const getUseCaseContent = () => {
    switch (useCase) {
      case 'daily-entry':
        return {
          icon: icon || 'card-filled',
          iconColor: iconColor || 'var(--brand-accent)',
          badge: badge || { text: '3', variant: 'info' as const },
        };
      case 'spread-entry':
        return {
          thumbnailSize: 48,
          badge: badge || { text: 'Celtic Cross', variant: 'outline' as const },
        };
      case 'settings-item':
        return {
          icon: icon || 'settings',
          iconColor: iconColor || 'var(--color-text-secondary)',
          showToggle: toggle !== undefined,
        };
      case 'theme-item':
        return {
          thumbnailSize: 60,
          badge: badge || { text: '₩1,200', variant: 'premium' as const },
        };
      default:
        return {};
    }
  };

  const useCaseConfig = getUseCaseContent();

  // Render left element based on layout
  const renderLeftElement = () => {
    if (layout === 'text-only') return null;

    if ((layout === 'thumbnail-text' || layout === 'complex') && thumbnailUrl) {
      return (
        <div style={leftElementStyles}>
          <Thumbnail 
            url={thumbnailUrl} 
            alt={thumbnailAlt}
            size={useCaseConfig.thumbnailSize || 40}
          />
        </div>
      );
    }

    if ((layout === 'icon-text' || layout === 'complex') && (icon || useCaseConfig.icon)) {
      return (
        <div style={leftElementStyles}>
          <Icon 
            name={(icon || useCaseConfig.icon)!}
            color={useCaseConfig.iconColor || iconColor}
            size={24}
          />
        </div>
      );
    }

    return null;
  };

  // Render right element based on layout and props
  const renderRightElement = () => {
    const elements = [];

    // Badge
    if (badge || useCaseConfig.badge) {
      const badgeData = badge || useCaseConfig.badge!;
      elements.push(
        <Badge
          key="badge"
          variant={badgeData.variant || 'info'}
          size="small"
        >
          {badgeData.text}
        </Badge>
      );
    }

    // Toggle switch
    if (toggle && layout === 'complex') {
      elements.push(
        <ToggleSwitch
          key="toggle"
          checked={toggle.checked}
          onChange={toggle.onChange}
        />
      );
    }

    // Action button
    if (action && (layout === 'text-action' || layout === 'complex')) {
      elements.push(
        <Button
          key="action"
          variant={action.variant || 'ghost'}
          iconVariant={action.label ? 'leading-icon' : 'icon-only'}
          icon={action.icon ? <Icon name={action.icon} /> : undefined}
          onClick={action.onClick}
          size="small"
          style={{
            minWidth: action.label ? 'auto' : '36px',
            height: '36px',
          }}
        >
          {action.label}
        </Button>
      );
    }

    // Forward arrow for navigation items
    if (onClick && !action && layout !== 'complex') {
      elements.push(
        <Icon
          key="forward"
          name="forward"
          color="var(--color-text-tertiary)"
          size={20}
        />
      );
    }

    return elements.length > 0 ? (
      <div style={rightElementStyles}>
        {elements}
      </div>
    ) : null;
  };

  return (
    <div
      className={className}
      style={{
        ...containerStyles,
        ...interactiveStyles,
      }}
      onClick={onClick && !disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Element */}
      {renderLeftElement()}

      {/* Content Area */}
      <div style={contentStyles}>
        <div style={textContainerStyles}>
          {/* Title */}
          <Text
            variant="body-medium"
            semantic="primary"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text
              variant="caption"
              semantic="secondary"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </Text>
          )}

          {/* Description (only for complex layout) */}
          {description && layout === 'complex' && (
            <Text
              variant="caption"
              semantic="tertiary"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {description}
            </Text>
          )}
        </div>
      </div>

      {/* Right Element */}
      {renderRightElement()}
    </div>
  );
}

// Convenience components for specific use cases
export function DailyEntryListItem(props: Omit<ListItemProps, 'useCase' | 'layout'>) {
  return <ListItem useCase="daily-entry" layout="icon-text" {...props} />;
}

export function SpreadEntryListItem(props: Omit<ListItemProps, 'useCase' | 'layout'>) {
  return <ListItem useCase="spread-entry" layout="thumbnail-text" {...props} />;
}

export function SettingsListItem(props: Omit<ListItemProps, 'useCase' | 'layout'>) {
  return <ListItem useCase="settings-item" layout="complex" {...props} />;
}

export function ThemeListItem(props: Omit<ListItemProps, 'useCase' | 'layout'>) {
  return <ListItem useCase="theme-item" layout="complex" {...props} />;
}