import React from 'react';
import { Button } from '../base/Button';
import { Icon } from '../base/Icon';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';

/**
 * 📋 Composite Header Component
 * 
 * Top header bar assembled from base components.
 * Uses only base components and design tokens.
 * 
 * Features:
 * - Multiple layout variants (title-only, title-back, title-action, full)
 * - Content variants for different screens
 * - Action button support
 * - Progress indicator support
 * - Mystical premium styling
 * - Full independence from other composites
 */

// Header layout variants
type HeaderLayout = 'title-only' | 'title-back' | 'title-action' | 'full';

// Header content variants
type HeaderContent = 'timer' | 'spread' | 'journal' | 'settings' | 'custom';

interface HeaderAction {
  icon: 'share' | 'delete' | 'save' | 'edit' | 'search' | 'plus' | 'close' | 'settings';
  label?: string;
  onClick: () => void;
  variant?: 'ghost' | 'primary' | 'secondary' | 'premium';
}

interface HeaderProps {
  layout?: HeaderLayout;
  content?: HeaderContent;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: HeaderAction[];
  progress?: number; // 0-100 for progress indicator
  badge?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Header Action Button Component - Internal composite
 */
function HeaderActionButton({ action }: { action: HeaderAction }) {
  return (
    <Button
      variant={action.variant || 'ghost'}
      iconVariant={action.label ? 'leading-icon' : 'icon-only'}
      icon={<Icon name={action.icon} />}
      onClick={action.onClick}
      size="medium"
      style={{
        minWidth: action.label ? 'auto' : '40px',
        height: '40px',
      }}
    >
      {action.label}
    </Button>
  );
}

/**
 * Progress Bar Component - Internal composite
 */
function ProgressBar({ progress }: { progress: number }) {
  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    marginTop: 'var(--space-xs)',
  };

  const fillStyles: React.CSSProperties = {
    height: '100%',
    backgroundColor: 'var(--brand-accent)',
    borderRadius: 'var(--radius-full)',
    width: `${Math.max(0, Math.min(100, progress))}%`,
    transition: 'width 0.3s ease',
    boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
  };

  return (
    <div style={containerStyles}>
      <div style={fillStyles} />
    </div>
  );
}

/**
 * Main Header Component
 */
export function Header({
  layout = 'title-only',
  content = 'custom',
  title,
  subtitle,
  onBack,
  actions = [],
  progress,
  badge,
  className = '',
  style = {},
}: HeaderProps) {

  // Content presets
  const contentPresets = {
    timer: {
      title: '오늘의 24시간 타로',
      subtitle: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
    },
    spread: {
      title: '스프레드 선택',
      subtitle: '원하는 타로 스프레드를 선택하세요',
    },
    journal: {
      title: '타로 일기',
      subtitle: '저장된 리딩을 확인하세요',
    },
    settings: {
      title: '설정',
      subtitle: '앱 설정을 관리하세요',
    },
    custom: {
      title: title || '',
      subtitle: subtitle || '',
    },
  };

  const currentContent = contentPresets[content];

  // Container styles using design tokens only
  const containerStyles: React.CSSProperties = {
    width: '100%',
    minHeight: '56px',
    backgroundColor: 'var(--color-surface-base)',
    borderBottom: '1px solid var(--color-divider)',
    position: 'relative',
    ...style,
  };

  // Safe area and content padding
  const contentStyles: React.CSSProperties = {
    paddingTop: 'var(--spacing-safe-margin)', // Safe area top
    paddingLeft: 'var(--space-m)',
    paddingRight: 'var(--space-m)',
    paddingBottom: 'var(--space-s)',
    maxWidth: '100%',
  };

  // Header layout styles
  const headerLayoutStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-m)',
    minHeight: '48px',
  };

  // Left section (back button or empty)
  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minWidth: layout === 'title-only' ? 0 : '40px',
  };

  // Center section (title area)
  const centerSectionStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: layout === 'title-only' ? 'flex-start' : 'center',
    gap: 'var(--space-xxs)',
    minWidth: 0, // Allow text truncation
  };

  // Right section (actions)
  const rightSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-s)',
    minWidth: actions.length > 0 ? 'auto' : '40px',
  };

  // Title styles
  const titleStyles: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  };

  return (
    <div className={className} style={containerStyles}>
      <div style={contentStyles}>
        <div style={headerLayoutStyles}>
          {/* Left Section - Back Button */}
          <div style={leftSectionStyles}>
            {onBack && (layout === 'title-back' || layout === 'full') && (
              <Button
                variant="ghost"
                iconVariant="icon-only"
                icon={<Icon name="back" />}
                onClick={onBack}
                size="medium"
                style={{
                  width: '40px',
                  height: '40px',
                }}
              />
            )}
          </div>

          {/* Center Section - Title and Subtitle */}
          <div style={centerSectionStyles}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-s)',
              width: '100%',
              justifyContent: layout === 'title-only' ? 'flex-start' : 'center',
            }}>
              <div style={titleStyles}>
                <Text
                  variant="title-medium"
                  semantic="primary"
                  style={{
                    textAlign: layout === 'title-only' ? 'left' : 'center',
                  }}
                >
                  {currentContent.title}
                </Text>
              </div>
              
              {badge && (
                <Badge variant="premium" size="small">
                  {badge}
                </Badge>
              )}
            </div>
            
            {currentContent.subtitle && (
              <Text
                variant="caption"
                semantic="secondary"
                style={{
                  textAlign: layout === 'title-only' ? 'left' : 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {currentContent.subtitle}
              </Text>
            )}
          </div>

          {/* Right Section - Action Buttons */}
          <div style={rightSectionStyles}>
            {actions.map((action, index) => (
              <HeaderActionButton key={index} action={action} />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <ProgressBar progress={progress} />
        )}
      </div>
    </div>
  );
}

// Convenience components for specific use cases
export function TimerHeader(props: Omit<HeaderProps, 'content'>) {
  return <Header content="timer" {...props} />;
}

export function SpreadHeader(props: Omit<HeaderProps, 'content' | 'layout'>) {
  return <Header content="spread" layout="title-back" {...props} />;
}

export function JournalHeader(props: Omit<HeaderProps, 'content'>) {
  return <Header content="journal" {...props} />;
}

export function SettingsHeader(props: Omit<HeaderProps, 'content'>) {
  return <Header content="settings" {...props} />;
}

// Spread detail header with progress and actions
export function SpreadDetailHeader({
  spreadName,
  onBack,
  onSave,
  onShare,
  progress,
}: {
  spreadName: string;
  onBack: () => void;
  onSave?: () => void;
  onShare?: () => void;
  progress?: number;
}) {
  const actions: HeaderAction[] = [];
  
  if (onSave) {
    actions.push({
      icon: 'save',
      onClick: onSave,
      variant: 'ghost',
    });
  }
  
  if (onShare) {
    actions.push({
      icon: 'share',
      onClick: onShare,
      variant: 'ghost',
    });
  }

  return (
    <Header
      layout="full"
      title={spreadName}
      subtitle={progress ? `${Math.round(progress)}% 완료` : undefined}
      onBack={onBack}
      actions={actions}
      progress={progress}
    />
  );
}