import React, { forwardRef, useState } from 'react';
import * as Icons from './icons';
import { cn } from '../../utils/cn';

// Mystical UI Components with Golden Theme

// Mystical Button Component
interface MysticalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const MysticalButton: React.FC<MysticalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className
}) => {
  const baseStyles = "relative font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-400/30 hover:border-yellow-400/60",
    ghost: "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur-sm opacity-75 animate-mystical-pulse -z-10"></div>
      )}
    </button>
  );
};

// Mystical Card Component
interface MysticalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowing?: boolean;
}

export const MysticalCard: React.FC<MysticalCardProps> = ({
  children,
  className,
  hover = false,
  glowing = false
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      "border border-yellow-400/20 rounded-xl p-6",
      "shadow-2xl backdrop-blur-sm",
      hover && "hover:border-yellow-400/40 hover:shadow-yellow-400/20 hover:shadow-2xl transition-all duration-500 hover:scale-105",
      glowing && "shadow-yellow-400/30 border-yellow-400/40 animate-mystical-glow",
      className
    )}>
      {children}
    </div>
  );
};

// Icon Button Component
interface IconButtonProps {
  icon: keyof typeof Icons;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  size = 'md',
  variant = 'ghost',
  className,
  tooltip
}) => {
  const IconComponent = Icons[icon];
  
  const sizeMap = {
    sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { button: 'w-12 h-12', icon: 'w-6 h-6' }
  };
  
  const variantStyles = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
    secondary: "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-400/30",
    ghost: "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
  };
  
  return (
    <button
      className={cn(
        "rounded-lg transition-all duration-300 flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50",
        sizeMap[size].button,
        variantStyles[variant],
        className
      )}
      onClick={onClick}
      title={tooltip}
    >
      <IconComponent className={cn("text-current", sizeMap[size].icon)} />
    </button>
  );
};

// Mystical Progress Component
interface MysticalProgressProps {
  value: number;
  max: number;
  className?: string;
  showText?: boolean;
}

export const MysticalProgress: React.FC<MysticalProgressProps> = ({
  value,
  max,
  className,
  showText = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn("relative", className)}>
      <div className="w-full bg-gray-800 rounded-full h-3 shadow-inner border border-gray-700">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-mystical-shimmer"></div>
        </div>
      </div>
      {showText && (
        <div className="text-center mt-2 text-sm text-yellow-400 font-medium">
          {value} / {max}
        </div>
      )}
    </div>
  );
};

// Mystical Input Component
interface MysticalInputProps {
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  icon?: keyof typeof Icons;
}

export const MysticalInput: React.FC<MysticalInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  icon
}) => {
  const IconComponent = icon ? Icons[icon] : null;
  
  return (
    <div className={cn("relative", className)}>
      {IconComponent && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">
          <IconComponent className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-full bg-gray-800/50 border border-yellow-400/20 rounded-lg px-4 py-3 text-white placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 focus:border-yellow-400/40",
          "transition-all duration-300",
          icon && "pl-11"
        )}
      />
    </div>
  );
};

// Mystical Modal Component
interface MysticalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MysticalModal: React.FC<MysticalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        "border border-yellow-400/30 rounded-2xl shadow-2xl",
        "max-w-lg w-full mx-4 max-h-[90vh] overflow-auto",
        "transform transition-all duration-300",
        className
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
            <h3 className="text-xl font-bold text-yellow-400">{title}</h3>
            <IconButton
              icon="X"
              onClick={onClose}
              size="sm"
              variant="ghost"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Mystical Switch Component
interface MysticalSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export const MysticalSwitch: React.FC<MysticalSwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  label
}) => {
  return (
    <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out",
          checked ? "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-400/30" : "bg-gray-600"
        )}
      >
        <div
          className={cn(
            "absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-300 ease-in-out shadow-sm",
            checked ? "transform translate-x-5" : ""
          )}
        />
      </div>
      {label && (
        <span className="ml-3 text-white">{label}</span>
      )}
    </label>
  );
};

// ImageWithFallback 컴포넌트
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallback = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {hasError && imgSrc === fallback && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs opacity-75">이미지 로드 실패</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Mystical Tooltip Component
interface MysticalTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const MysticalTooltip: React.FC<MysticalTooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positionStyles = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2", 
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 border border-yellow-400/20 rounded shadow-lg whitespace-nowrap",
          positionStyles[position]
        )}>
          {content}
        </div>
      )}
    </div>
  );
};

export default {
  MysticalButton,
  MysticalCard,
  IconButton,
  MysticalProgress,
  MysticalInput,
  MysticalModal,
  MysticalSwitch,
  MysticalTooltip,
  ImageWithFallback
};
