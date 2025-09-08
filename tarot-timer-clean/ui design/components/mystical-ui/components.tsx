import React, { ReactNode, useState } from 'react';

// ==========================================
// BASIC UI COMPONENTS
// ==========================================

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function Card({ className = "", children, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>;
}

interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
}

export function Button({ className = "", children, onClick, disabled = false, variant = 'default', size = 'default' }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-lg",
    outline: "border border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
  };
  
  const sizeClasses = {
    default: "px-6 py-3 text-base",
    sm: "px-4 py-2 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'outline';
}

export function Badge({ className = "", children, variant = 'default' }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium";
  
  const variantClasses = {
    default: "bg-yellow-400 text-black",
    outline: "border border-yellow-400/40 text-yellow-400 bg-yellow-400/10"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function Textarea({ placeholder, value, onChange, className = "" }: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 resize-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 ${className}`}
    />
  );
}

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({ placeholder, value, onChange, className = "", autoFocus, onKeyDown }: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      className={`w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 ${className}`}
    />
  );
}

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onCheckedChange, className = "" }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
        checked ? 'bg-yellow-400' : 'bg-white/20'
      } ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ==========================================
// TABS COMPONENTS
// ==========================================

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, className = "", children }: TabsProps) {
  return (
    <div className={className} data-tabs-value={value}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
          : child
      )}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function TabsList({ className = "", children, value, onValueChange }: TabsListProps) {
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { 
              activeValue: value, 
              onValueChange,
              isActive: (child.props as any).value === value
            })
          : child
      )}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  isActive?: boolean;
}

export function TabsTrigger({ value, className = "", children, activeValue, onValueChange, isActive }: TabsTriggerProps) {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className = "", children }: TabsContentProps) {
  // Always render content - the parent will handle conditional display
  return <div className={className}>{children}</div>;
}

// ==========================================
// IMAGE COMPONENT
// ==========================================

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = "" }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop');
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}