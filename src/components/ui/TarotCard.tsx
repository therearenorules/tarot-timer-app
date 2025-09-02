import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TarotCard as TarotCardType } from '../../../figma UI/utils/tarot-cards';

/**
 * 🎴 Enhanced Tarot Card Component
 * 
 * Premium tarot card component with mystical animations and interactive states.
 * Built for the Tarot Timer app with mobile-first responsive design.
 * 
 * Features:
 * - Flip animations with mystical effects
 * - Touch/hover interactions with premium feedback
 * - Loading states with mystical shimmer
 * - Responsive sizing (thumbnail to display)
 * - Accessibility built-in (ARIA, keyboard nav)
 * - Performance optimized (React.memo, image preloading)
 * - Dark/light mode support via design tokens
 */

export type CardSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'display';
export type CardState = 'face-down' | 'face-up' | 'empty' | 'loading' | 'error';

interface TarotCardProps {
  // Core props
  card?: TarotCardType;
  size?: CardSize;
  state?: CardState;
  
  // Interactive props
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  
  // Display props
  showTitle?: boolean;
  showDescription?: boolean;
  emptyText?: string;
  
  // Animation props
  flipDuration?: number;
  glowIntensity?: 'subtle' | 'normal' | 'intense';
  
  // Event handlers
  onClick?: () => void;
  onFlip?: (faceUp: boolean) => void;
  onLoad?: () => void;
  onError?: () => void;
  
  // Style props
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enhanced Tarot Card Component with Premium Animations
 */
export const TarotCard = React.memo<TarotCardProps>(({
  card,
  size = 'medium',
  state = 'face-down',
  interactive = true,
  selected = false,
  disabled = false,
  showTitle = true,
  showDescription = false,
  emptyText = 'Tap to draw card',
  flipDuration = 600,
  glowIntensity = 'normal',
  onClick,
  onFlip,
  onLoad,
  onError,
  className = '',
  style = {},
}) => {
  // Component state
  const [isFlipping, setIsFlipping] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Memoized size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      thumbnail: { width: 50, height: 75, padding: 4, fontSize: 8 },
      small: { width: 70, height: 105, padding: 6, fontSize: 10 },
      medium: { width: 90, height: 135, padding: 8, fontSize: 12 },
      large: { width: 120, height: 180, padding: 12, fontSize: 14 },
      display: { width: 200, height: 300, padding: 16, fontSize: 16 },
    };
    return configs[size];
  }, [size]);

  // Glow intensity mapping
  const glowMap = useMemo(() => ({
    subtle: { opacity: 0.1, blur: 8, spread: 2 },
    normal: { opacity: 0.2, blur: 12, spread: 4 },
    intense: { opacity: 0.3, blur: 16, spread: 6 },
  }), []);

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    onError?.();
  }, [onError]);

  // Handle card interaction
  const handleClick = useCallback(() => {
    if (disabled || !interactive) return;
    
    if (state === 'face-down' || state === 'face-up') {
      setIsFlipping(true);
      
      setTimeout(() => {
        const newFaceUp = state === 'face-down';
        onFlip?.(newFaceUp);
        setIsFlipping(false);
      }, flipDuration / 2);
    }
    
    onClick?.();
  }, [disabled, interactive, state, flipDuration, onClick, onFlip]);

  // Generate mystical CSS variables
  const mysticalEffects = useMemo(() => {
    const glow = glowMap[glowIntensity];
    return {
      '--card-glow-color': selected ? 'var(--accent)' : 'var(--primary)',
      '--card-glow-opacity': glow.opacity,
      '--card-glow-blur': `${glow.blur}px`,
      '--card-glow-spread': `${glow.spread}px`,
      '--card-flip-duration': `${flipDuration}ms`,
      '--card-shimmer-duration': '2000ms',
    } as React.CSSProperties;
  }, [selected, glowIntensity, glowMap, flipDuration]);

  // Base card styles using design tokens
  const baseStyles: React.CSSProperties = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderRadius: 'var(--radius-medium)',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : (interactive ? 'pointer' : 'default'),
    transformStyle: 'preserve-3d',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none',
    outline: 'none',
    ...mysticalEffects,
    ...style,
  };

  // Interactive state styles
  const interactiveStyles: React.CSSProperties = {};
  
  if (interactive && !disabled) {
    if (selected) {
      interactiveStyles.boxShadow = `
        0 0 0 2px var(--card-glow-color),
        0 0 var(--card-glow-blur) var(--card-glow-spread) 
        color-mix(in srgb, var(--card-glow-color) var(--card-glow-opacity), transparent)
      `;
    }
    
    if (isHovered && !isFlipping) {
      interactiveStyles.transform = 'translateY(-2px) scale(1.02)';
      if (!selected) {
        interactiveStyles.boxShadow = `
          0 4px 20px rgba(0, 0, 0, 0.15),
          0 0 var(--card-glow-blur) calc(var(--card-glow-spread) / 2) 
          color-mix(in srgb, var(--card-glow-color) calc(var(--card-glow-opacity) / 2), transparent)
        `;
      }
    }
    
    if (isPressed && !isFlipping) {
      interactiveStyles.transform = 'translateY(0) scale(0.98)';
    }
  }

  // Flip animation styles
  const flipStyles: React.CSSProperties = isFlipping ? {
    transform: 'rotateY(90deg)',
    transition: `transform ${flipDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  } : {};

  // Card face styles
  const faceStyles: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  };

  // Loading shimmer effect
  const shimmerStyles: React.CSSProperties = {
    background: `
      linear-gradient(90deg, 
        transparent 0%, 
        color-mix(in srgb, var(--accent) 20%, transparent) 50%, 
        transparent 100%)
    `,
    animation: 'shimmer var(--card-shimmer-duration) ease-in-out infinite',
  };

  // Render card content based on state
  const renderCardContent = () => {
    switch (state) {
      case 'empty':
        return (
          <div style={{
            ...faceStyles,
            backgroundColor: 'var(--card)',
            border: '2px dashed var(--border)',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted-foreground)',
          }}>
            <div style={{
              textAlign: 'center',
              padding: sizeConfig.padding,
              fontSize: sizeConfig.fontSize,
              fontWeight: '500',
            }}>
              {emptyText}
            </div>
          </div>
        );

      case 'loading':
        return (
          <div style={{
            ...faceStyles,
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            ...shimmerStyles,
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              border: '2px solid var(--accent)',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        );

      case 'error':
        return (
          <div style={{
            ...faceStyles,
            backgroundColor: 'var(--card)',
            border: '1px solid var(--destructive)',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--destructive)',
          }}>
            <div style={{
              textAlign: 'center',
              padding: sizeConfig.padding,
              fontSize: sizeConfig.fontSize,
              fontWeight: '500',
            }}>
              Failed to load
            </div>
          </div>
        );

      case 'face-down':
        return (
          <div style={{
            ...faceStyles,
            background: `
              linear-gradient(135deg, 
                var(--primary) 0%, 
                var(--secondary) 50%, 
                var(--primary) 100%)
            `,
            border: `2px solid var(--accent)`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Mystical pattern overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 50%)
              `,
              opacity: 0.6,
            }} />
            
            {/* Sacred geometry pattern */}
            <div style={{
              width: '60%',
              height: '60%',
              border: `1px solid var(--accent)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
            }}>
              <div style={{
                width: '60%',
                height: '60%',
                border: `1px solid var(--accent)`,
                transform: 'rotate(45deg)',
                opacity: 0.6,
              }} />
            </div>
          </div>
        );

      case 'face-up':
        if (!card) return null;
        
        return (
          <div style={{
            ...faceStyles,
            backgroundColor: 'var(--card)',
            border: `2px solid var(--accent)`,
          }}>
            {/* Card image */}
            <div style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img
                src={card.imageUrl}
                alt={card.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Loading overlay */}
              {!imageLoaded && !imageError && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  ...shimmerStyles,
                }} />
              )}
            </div>
            
            {/* Card info */}
            {(showTitle || showDescription) && (
              <div style={{
                padding: sizeConfig.padding,
                backgroundColor: 'color-mix(in srgb, var(--card) 95%, var(--accent) 5%)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid var(--border)',
              }}>
                {showTitle && (
                  <div style={{
                    fontSize: sizeConfig.fontSize,
                    fontWeight: '600',
                    color: 'var(--foreground)',
                    marginBottom: showDescription ? 4 : 0,
                    lineHeight: '1.2',
                  }}>
                    {card.nameKr || card.name}
                  </div>
                )}
                
                {showDescription && size !== 'thumbnail' && size !== 'small' && (
                  <div style={{
                    fontSize: sizeConfig.fontSize - 1,
                    color: 'var(--muted-foreground)',
                    lineHeight: '1.3',
                    opacity: 0.9,
                  }}>
                    {card.descriptionKr || card.description}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`tarot-card ${className}`.trim()}
      style={{
        ...baseStyles,
        ...interactiveStyles,
        ...flipStyles,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      tabIndex={interactive && !disabled ? 0 : -1}
      role={interactive ? 'button' : 'img'}
      aria-label={
        card ? `${card.name}: ${card.description}` : 
        state === 'empty' ? emptyText : 
        'Tarot card'
      }
      aria-pressed={selected}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && interactive && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {renderCardContent()}
    </div>
  );
});

TarotCard.displayName = 'TarotCard';

// Convenience components for specific use cases
export const TarotCardThumbnail = React.memo<Omit<TarotCardProps, 'size'>>((props) => 
  <TarotCard size="thumbnail" {...props} />
);

export const TarotCardSmall = React.memo<Omit<TarotCardProps, 'size'>>((props) => 
  <TarotCard size="small" {...props} />
);

export const TarotCardMedium = React.memo<Omit<TarotCardProps, 'size'>>((props) => 
  <TarotCard size="medium" {...props} />
);

export const TarotCardLarge = React.memo<Omit<TarotCardProps, 'size'>>((props) => 
  <TarotCard size="large" {...props} />
);

export const TarotCardDisplay = React.memo<Omit<TarotCardProps, 'size'>>((props) => 
  <TarotCard size="display" {...props} />
);

// CSS keyframes (inject into global styles or use CSS-in-JS)
const mysticalKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes mystical-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent); }
  50% { opacity: 0.9; box-shadow: 0 0 0 10px color-mix(in srgb, var(--accent) 0%, transparent); }
}
`;

// Inject keyframes if not already present
if (typeof document !== 'undefined' && !document.head.querySelector('#tarot-card-keyframes')) {
  const style = document.createElement('style');
  style.id = 'tarot-card-keyframes';
  style.textContent = mysticalKeyframes;
  document.head.appendChild(style);
}

export default TarotCard;