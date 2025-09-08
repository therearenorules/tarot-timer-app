import React from 'react';

interface SacredGeometryProps {
  className?: string;
  pattern?: 'circles' | 'flower-of-life' | 'hexagons' | 'triangles';
  opacity?: number;
}

export function SacredGeometry({ 
  className = "absolute inset-0", 
  pattern = 'circles', 
  opacity = 0.05
}: SacredGeometryProps) {
  const renderCirclePattern = () => (
    <svg className="w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="sacred-circles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sacred-circles)" />
    </svg>
  );

  const renderFlowerOfLife = () => (
    <svg className="w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="flower-of-life" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
          {/* Central circle */}
          <circle cx="60" cy="52" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          
          {/* Surrounding circles */}
          <circle cx="30" cy="26" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="90" cy="26" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="78" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="90" cy="78" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="104" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#flower-of-life)" />
    </svg>
  );

  const renderHexagonPattern = () => (
    <svg className="w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="sacred-hexagons" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <path d="M30 4 L50 18 L50 38 L30 52 L10 38 L10 18 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" />
          <path d="M30 13 L40 20 L40 32 L30 39 L20 32 L20 20 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sacred-hexagons)" />
    </svg>
  );

  const renderTrianglePattern = () => (
    <svg className="w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="sacred-triangles" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <path d="M30 8 L50 44 L10 44 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" />
          <path d="M30 18 L42 38 L18 38 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" />
          <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sacred-triangles)" />
    </svg>
  );

  const patterns = {
    circles: renderCirclePattern,
    'flower-of-life': renderFlowerOfLife,
    hexagons: renderHexagonPattern,
    triangles: renderTrianglePattern,
  };

  return (
    <div 
      className={`${className} pointer-events-none text-premium-gold`}
      style={{ opacity }}
    >
      {patterns[pattern]()}
    </div>
  );
}

// Mystical Glow Effect Component
export function MysticalGlow({ 
  className = "absolute inset-0", 
  intensity = 'medium' 
}: { 
  className?: string; 
  intensity?: 'low' | 'medium' | 'high'; 
}) {
  const intensityClasses = {
    low: 'opacity-20',
    medium: 'opacity-30',
    high: 'opacity-40',
  };

  return (
    <div className={`${className} pointer-events-none ${intensityClasses[intensity]}`}>
      <div className="absolute inset-0 bg-gradient-radial from-premium-gold/20 via-transparent to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-deep-purple/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

// Animated Stars/Sparkles
export function MysticalSparkles({ 
  className = "absolute inset-0", 
  count = 20 
}: { 
  className?: string; 
  count?: number; 
}) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <div className={`${className} pointer-events-none overflow-hidden`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-premium-gold rounded-full animate-pulse"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}