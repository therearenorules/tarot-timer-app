import React, { ReactNode } from 'react';
import { SacredGeometry, MysticalGlow } from './SacredGeometry';

interface PremiumCardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  glow?: boolean;
  pattern?: 'circles' | 'flower-of-life' | 'hexagons' | 'triangles';
  gradient?: boolean;
}

export function PremiumCard({ 
  className = "", 
  children, 
  onClick,
  glow = false,
  pattern = 'circles',
  gradient = true
}: PremiumCardProps) {
  return (
    <div 
      className={`
        relative bg-card backdrop-blur-lg border border-premium-gold/30 rounded-lg shadow-2xl 
        overflow-hidden cursor-pointer transition-all duration-500 
        hover:border-premium-gold/50 hover:shadow-premium-gold/20 hover:shadow-2xl
        group ${className}
      `}
      onClick={onClick}
    >
      {/* Sacred Geometry Background */}
      <SacredGeometry pattern={pattern} opacity={0.05} />
      
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 via-transparent to-deep-purple/5 pointer-events-none" />
      )}
      
      {/* Mystical glow */}
      {glow && <MysticalGlow intensity="low" />}
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-premium-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-premium-gold/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function IconCard({ 
  icon, 
  title, 
  description, 
  onClick, 
  active = false,
  className = ""
}: IconCardProps) {
  return (
    <PremiumCard 
      onClick={onClick}
      glow={active}
      className={`p-6 text-center transition-all duration-300 ${active ? 'border-premium-gold bg-premium-gold/10' : ''} ${className}`}
    >
      {/* Icon container */}
      <div className={`
        inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300
        ${active 
          ? 'bg-premium-gold/20 border-2 border-premium-gold/50' 
          : 'bg-premium-gold/10 border border-premium-gold/20 group-hover:bg-premium-gold/15'
        }
      `}>
        <div className={`transition-colors duration-300 ${active ? 'text-premium-gold' : 'text-premium-gold/80 group-hover:text-premium-gold'}`}>
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
        active ? 'text-premium-gold' : 'text-white group-hover:text-premium-gold/90'
      }`}>
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {description}
        </p>
      )}
    </PremiumCard>
  );
}

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function PremiumButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className = ""
}: PremiumButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-gold/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
  
  const variantClasses = {
    primary: `
      bg-premium-gold text-deep-purple shadow-lg hover:bg-premium-gold/90 
      hover:shadow-xl hover:shadow-premium-gold/20 active:scale-95
    `,
    secondary: `
      bg-deep-purple text-premium-gold border border-premium-gold/30 
      hover:bg-deep-purple/80 hover:border-premium-gold/50 active:scale-95
    `,
    outline: `
      border border-premium-gold/30 text-premium-gold bg-transparent 
      hover:bg-premium-gold/10 hover:border-premium-gold/50 active:scale-95
    `
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    </button>
  );
}