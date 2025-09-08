import React, { useEffect } from 'react';
import { Button } from '../base/Button';
import { Icon } from '../base/Icon';
import { Text } from '../base/Text';

/**
 * 🔲 Composite Modal Component
 * 
 * Modal container assembled from base components.
 * Uses only base components and design tokens.
 * 
 * Features:
 * - Size variants (small, medium, large, fullscreen)
 * - Purpose variants (alert, form, content, fullscreen)
 * - Backdrop blur and mystical styling
 * - Smooth animations
 * - Keyboard and click-outside handling
 * - Full independence from other composites
 */

// Modal size variants
type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

// Modal purpose variants
type ModalPurpose = 'alert' | 'form' | 'content' | 'fullscreen' | 'custom';

interface ModalAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'premium' | 'ghost';
  onClick: () => void;
  icon?: 'save' | 'share' | 'delete' | 'close' | 'check';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Content
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  
  // Configuration
  size?: ModalSize;
  purpose?: ModalPurpose;
  
  // Actions
  actions?: ModalAction[];
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Modal Action Bar Component - Internal composite
 */
function ModalActionBar({ actions }: { actions: ModalAction[] }) {
  const actionBarStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--space-s)',
    padding: 'var(--space-m)',
    borderTop: '1px solid var(--color-divider)',
    backgroundColor: 'var(--color-surface-base)',
    borderBottomLeftRadius: 'var(--radius-large)',
    borderBottomRightRadius: 'var(--radius-large)',
  };

  return (
    <div style={actionBarStyles}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          iconVariant={action.icon ? 'leading-icon' : 'text-only'}
          icon={action.icon ? <Icon name={action.icon} /> : undefined}
          onClick={action.onClick}
          size="medium"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * Main Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium',
  purpose = 'custom',
  actions = [],
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  style = {},
}: ModalProps) {

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeConfigs = {
    small: {
      width: '280px',
      maxHeight: '400px',
    },
    medium: {
      width: '320px',
      maxHeight: '500px',
    },
    large: {
      width: '360px',
      maxHeight: '80vh',
    },
    fullscreen: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
    },
  };

  const currentSizeConfig = sizeConfigs[size];

  // Purpose configurations
  const purposeConfigs = {
    alert: {
      size: 'small' as ModalSize,
      showCloseButton: false,
    },
    form: {
      size: 'medium' as ModalSize,
      showCloseButton: true,
    },
    content: {
      size: 'large' as ModalSize,
      showCloseButton: true,
    },
    fullscreen: {
      size: 'fullscreen' as ModalSize,
      showCloseButton: true,
    },
    custom: {},
  };

  const currentPurposeConfig = purposeConfigs[purpose];
  const effectiveSize = currentPurposeConfig.size || size;
  const effectiveShowCloseButton = currentPurposeConfig.showCloseButton ?? showCloseButton;

  // Overlay styles
  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: effectiveSize === 'fullscreen' ? 0 : 'var(--space-l)',
    backgroundColor: 'rgba(15, 15, 26, 0.6)', // Dark backdrop
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out',
  };

  // Modal container styles
  const modalStyles: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: effectiveSize === 'fullscreen' ? 0 : 'var(--radius-large)',
    boxShadow: 'var(--shadow-modal)',
    border: effectiveSize === 'fullscreen' ? 'none' : '1px solid var(--color-border-default)',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    animation: effectiveSize === 'fullscreen' ? 'slideUp 0.3s ease-out' : 'scaleIn 0.3s ease-out',
    ...sizeConfigs[effectiveSize],
    ...style,
  };

  // Header styles
  const headerStyles: React.CSSProperties = {
    padding: 'var(--space-l) var(--space-l) var(--space-m) var(--space-l)',
    borderBottom: title || subtitle ? '1px solid var(--color-divider)' : 'none',
    position: 'relative',
  };

  // Content styles
  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: children ? 'var(--space-l)' : 0,
    minHeight: 0, // Allow content to shrink
  };

  // Close button styles
  const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--space-m)',
    right: 'var(--space-m)',
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <div style={overlayStyles} onClick={handleBackdropClick}>
      <div className={className} style={modalStyles}>
        {/* Header */}
        {(title || subtitle || effectiveShowCloseButton) && (
          <div style={headerStyles}>
            {/* Close Button */}
            {effectiveShowCloseButton && (
              <div style={closeButtonStyles}>
                <Button
                  variant="ghost"
                  iconVariant="icon-only"
                  icon={<Icon name="close" />}
                  onClick={onClose}
                  size="small"
                  style={{
                    width: '32px',
                    height: '32px',
                  }}
                />
              </div>
            )}

            {/* Title */}
            {title && (
              <div style={{ marginBottom: subtitle ? 'var(--space-xxs)' : 0 }}>
                <Text
                  variant="title-medium"
                  semantic="primary"
                  style={{
                    paddingRight: effectiveShowCloseButton ? '48px' : 0,
                  }}
                >
                  {title}
                </Text>
              </div>
            )}

            {/* Subtitle */}
            {subtitle && (
              <Text
                variant="body-medium"
                semantic="secondary"
                style={{
                  paddingRight: effectiveShowCloseButton ? '48px' : 0,
                }}
              >
                {subtitle}
              </Text>
            )}
          </div>
        )}

        {/* Content */}
        {children && (
          <div style={contentStyles}>
            {children}
          </div>
        )}

        {/* Action Bar */}
        {actions.length > 0 && (
          <ModalActionBar actions={actions} />
        )}
      </div>

      {/* Inline styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0; 
              transform: scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: scale(1); 
            }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(100%); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `}
      </style>
    </div>
  );
}

// Convenience components for specific purposes
export function AlertModal({
  title,
  message,
  onConfirm,
  onCancel,
  ...props
}: Omit<ModalProps, 'purpose' | 'children' | 'actions'> & {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}) {
  const actions: ModalAction[] = [];
  
  if (onCancel) {
    actions.push({
      label: '취소',
      variant: 'ghost',
      onClick: onCancel,
    });
  }
  
  actions.push({
    label: '확인',
    variant: 'primary',
    onClick: onConfirm,
  });

  return (
    <Modal
      purpose="alert"
      title={title}
      actions={actions}
      closeOnBackdrop={false}
      showCloseButton={false}
      {...props}
    >
      <Text variant="body-medium" semantic="primary">
        {message}
      </Text>
    </Modal>
  );
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  variant = 'primary',
  ...props
}: Omit<ModalProps, 'purpose' | 'children' | 'actions'> & {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'primary' | 'premium' | 'secondary';
}) {
  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      variant: 'ghost',
      onClick: onCancel,
    },
    {
      label: confirmLabel,
      variant: variant,
      onClick: onConfirm,
    },
  ];

  return (
    <Modal
      purpose="alert"
      title={title}
      actions={actions}
      closeOnBackdrop={false}
      {...props}
    >
      <Text variant="body-medium" semantic="primary">
        {message}
      </Text>
    </Modal>
  );
}

export function ContentModal(props: Omit<ModalProps, 'purpose'>) {
  return <Modal purpose="content" {...props} />;
}

export function FullscreenModal(props: Omit<ModalProps, 'purpose'>) {
  return <Modal purpose="fullscreen" {...props} />;
}