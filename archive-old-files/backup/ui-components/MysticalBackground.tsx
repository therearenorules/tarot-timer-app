import React, { useEffect, useMemo, useState, useCallback } from 'react';

/**
 * ✨ 신비로운 배경 컴포넌트
 * 
 * 타로 테마에 어울리는 신비로운 배경 효과를 제공합니다.
 * 성능 최적화된 CSS 애니메이션과 동적 파티클 시스템을 사용합니다.
 * 
 * 주요 기능:
 * - 다양한 신비로운 배경 패턴
 * - 동적 파티클 및 별 애니메이션
 * - 시간대별 색상 변화
 * - 성능 최적화된 렌더링
 * - 다크/라이트 모드 지원
 * - 배터리 절약 모드 지원
 * - 접근성 고려 (동작 감소 설정)
 */

export type BackgroundVariant = 'gradient' | 'particles' | 'sacred' | 'cosmic' | 'aurora' | 'minimal';
export type AnimationIntensity = 'minimal' | 'subtle' | 'normal' | 'intense';

interface Particle {
  id: string;
  x: number; // 0-100 (퍼센트)
  y: number; // 0-100 (퍼센트)
  size: number; // px
  opacity: number; // 0-1
  speed: number; // px/s
  direction: number; // 각도 (라디안)
  color: string;
  type: 'star' | 'dot' | 'sparkle' | 'orb';
}

interface MysticalBackgroundProps {
  // 배경 설정
  variant?: BackgroundVariant;
  animationIntensity?: AnimationIntensity;
  
  // 색상 설정
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  
  // 파티클 설정
  particleCount?: number;
  enableParticles?: boolean;
  
  // 시간 기반 설정
  timeBasedColors?: boolean;
  currentHour?: number;
  
  // 성능 설정
  reducedMotion?: boolean;
  enablePowerSaver?: boolean;
  
  // 레이어 설정
  layerDepth?: number; // 1-5
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  
  // 스타일 props
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * 시간대별 색상 팔레트 생성
 */
const getTimeBasedColors = (hour: number) => {
  const palettes = {
    dawn: ['#FF6B6B', '#FF8E6B', '#FFAC6B'],     // 새벽 (5-7시)
    morning: ['#F7DC6F', '#F4D03F', '#F1C40F'],  // 아침 (8-11시)
    noon: ['#5DADE2', '#3498DB', '#2E86C1'],     // 정오 (12-14시)
    afternoon: ['#58D68D', '#52C9A0', '#4FC3B4'], // 오후 (15-17시)
    evening: ['#AF7AC5', '#9B59B6', '#8E44AD'],  // 저녁 (18-20시)
    night: ['#85929E', '#566573', '#2C3E50'],    // 밤 (21-23시)
    midnight: ['#4A1A4F', '#6C3483', '#8E44AD'], // 자정 (0-4시)
  };
  
  if (hour >= 5 && hour <= 7) return palettes.dawn;
  if (hour >= 8 && hour <= 11) return palettes.morning;
  if (hour >= 12 && hour <= 14) return palettes.noon;
  if (hour >= 15 && hour <= 17) return palettes.afternoon;
  if (hour >= 18 && hour <= 20) return palettes.evening;
  if (hour >= 21 && hour <= 23) return palettes.night;
  return palettes.midnight;
};

/**
 * 파티클 생성 함수
 */
const generateParticles = (count: number, colors: string[]): Particle[] => {
  const particles: Particle[] = [];
  const types: Particle['type'][] = ['star', 'dot', 'sparkle', 'orb'];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: `particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 20 + 10,
      direction: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
    });
  }
  
  return particles;
};

/**
 * 신비로운 배경 컴포넌트
 */
export const MysticalBackground = React.memo<MysticalBackgroundProps>(({
  variant = 'gradient',
  animationIntensity = 'normal',
  primaryColor = 'var(--primary)',
  secondaryColor = 'var(--secondary)',
  accentColor = 'var(--accent)',
  particleCount = 50,
  enableParticles = true,
  timeBasedColors = false,
  currentHour = new Date().getHours(),
  reducedMotion = false,
  enablePowerSaver = false,
  layerDepth = 3,
  blendMode = 'normal',
  className = '',
  style = {},
  children,
}) => {
  // 파티클 상태
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // 시간 기반 색상
  const timeColors = useMemo(() => 
    timeBasedColors ? getTimeBasedColors(currentHour) : [primaryColor, secondaryColor, accentColor],
    [timeBasedColors, currentHour, primaryColor, secondaryColor, accentColor]
  );

  // 애니메이션 강도별 설정
  const intensityConfig = useMemo(() => {
    const configs = {
      minimal: { scale: 0.3, duration: 8, opacity: 0.3 },
      subtle: { scale: 0.6, duration: 6, opacity: 0.5 },
      normal: { scale: 1, duration: 4, opacity: 0.7 },
      intense: { scale: 1.5, duration: 2, opacity: 0.9 },
    };
    return configs[animationIntensity];
  }, [animationIntensity]);

  // 파티클 초기화
  useEffect(() => {
    if (enableParticles && !reducedMotion && variant !== 'minimal') {
      const count = enablePowerSaver ? Math.floor(particleCount / 2) : particleCount;
      setParticles(generateParticles(count, timeColors));
    }
  }, [enableParticles, reducedMotion, variant, particleCount, enablePowerSaver, timeColors]);

  // 가시성 감지 (성능 최적화)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.querySelector('.mystical-background');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // 파티클 애니메이션 업데이트
  useEffect(() => {
    if (!isVisible || reducedMotion || !enableParticles) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction) * 0.1) % 100,
        y: (particle.y + Math.sin(particle.direction) * 0.1) % 100,
        opacity: 0.3 + Math.sin(Date.now() * 0.001 + particle.x) * 0.4,
      })));
    }, enablePowerSaver ? 100 : 50); // 배터리 절약 모드에서 낮은 FPS

    return () => clearInterval(interval);
  }, [isVisible, reducedMotion, enableParticles, enablePowerSaver]);

  // 배경 그라데이션 스타일
  const getGradientStyle = useCallback((): React.CSSProperties => {
    const [color1, color2, color3] = timeColors;
    
    switch (variant) {
      case 'gradient':
        return {
          background: `
            radial-gradient(circle at 20% 30%, ${color1}20 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${color2}15 0%, transparent 50%),
            linear-gradient(135deg, ${color3}10 0%, transparent 50%)
          `,
        };
      
      case 'cosmic':
        return {
          background: `
            radial-gradient(ellipse at center top, ${color1}25 0%, transparent 60%),
            radial-gradient(ellipse at left bottom, ${color2}20 0%, transparent 60%),
            radial-gradient(ellipse at right bottom, ${color3}15 0%, transparent 60%),
            linear-gradient(180deg, transparent 0%, var(--background) 100%)
          `,
        };
      
      case 'aurora':
        return {
          background: `
            linear-gradient(45deg, ${color1}30, ${color2}20, ${color3}25),
            linear-gradient(-45deg, ${color2}20, ${color3}15, ${color1}20)
          `,
          backgroundSize: '400% 400%',
          animation: reducedMotion ? 'none' : `aurora-shift ${intensityConfig.duration * 4}s ease-in-out infinite`,
        };
      
      case 'sacred':
        return {
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              ${color1}15 0deg, transparent 60deg,
              ${color2}10 120deg, transparent 180deg,
              ${color3}15 240deg, transparent 300deg)
          `,
          animation: reducedMotion ? 'none' : `sacred-rotation ${intensityConfig.duration * 8}s linear infinite`,
        };
      
      default:
        return {};
    }
  }, [variant, timeColors, reducedMotion, intensityConfig]);

  // 신성한 기하학 패턴 렌더링
  const renderSacredGeometry = () => {
    if (variant !== 'sacred' || reducedMotion) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: intensityConfig.opacity * 0.3,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: reducedMotion ? 'none' : `sacred-geometry ${intensityConfig.duration * 6}s ease-in-out infinite`,
          }}
        >
          {/* 중앙 원 */}
          <circle
            cx="200"
            cy="200"
            r="80"
            fill="none"
            stroke={timeColors[0]}
            strokeWidth="2"
            opacity="0.6"
          />
          
          {/* 외곽 원들 */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle
              key={i}
              cx={200 + Math.cos(i * Math.PI / 3) * 60}
              cy={200 + Math.sin(i * Math.PI / 3) * 60}
              r="40"
              fill="none"
              stroke={timeColors[1]}
              strokeWidth="1.5"
              opacity="0.4"
            />
          ))}
          
          {/* 중앙 다이아몬드 */}
          <polygon
            points="200,160 240,200 200,240 160,200"
            fill="none"
            stroke={timeColors[2]}
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      </div>
    );
  };

  // 파티클 렌더링
  const renderParticles = () => {
    if (!enableParticles || reducedMotion || !isVisible) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.type === 'orb' ? particle.color : 'transparent',
              opacity: particle.opacity * intensityConfig.opacity,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              ...(particle.type === 'star' && {
                '&::before': {
                  content: '★',
                  color: particle.color,
                  fontSize: particle.size,
                },
              }),
              ...(particle.type === 'dot' && {
                borderRadius: '50%',
                backgroundColor: particle.color,
              }),
              ...(particle.type === 'sparkle' && {
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(0.5px)',
              }),
              animation: reducedMotion ? 'none' : `particle-float ${intensityConfig.duration}s ease-in-out infinite`,
              animationDelay: `${particle.id.slice(-1) * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // 베이스 스타일
  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    mixBlendMode: blendMode,
    zIndex: -layerDepth,
    willChange: reducedMotion ? 'auto' : 'transform, opacity',
    ...getGradientStyle(),
    ...style,
  };

  return (
    <div
      className={`mystical-background ${className}`.trim()}
      style={baseStyles}
      aria-hidden="true"
    >
      {renderSacredGeometry()}
      {renderParticles()}
      
      {/* 레이어 오버레이들 */}
      {layerDepth > 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(45deg, ${timeColors[1]}08, transparent, ${timeColors[2]}05)`,
            animation: reducedMotion ? 'none' : `layer-shift ${intensityConfig.duration * 2}s ease-in-out infinite reverse`,
          }}
        />
      )}
      
      {layerDepth > 2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 70% 30%, ${timeColors[0]}12 0%, transparent 70%)`,
            animation: reducedMotion ? 'none' : `layer-pulse ${intensityConfig.duration * 3}s ease-in-out infinite`,
          }}
        />
      )}

      {children}
    </div>
  );
});

MysticalBackground.displayName = 'MysticalBackground';

// 편의 컴포넌트들
export const GradientBackground = React.memo<Omit<MysticalBackgroundProps, 'variant'>>((props) => 
  <MysticalBackground variant="gradient" {...props} />
);

export const ParticleBackground = React.memo<Omit<MysticalBackgroundProps, 'variant'>>((props) => 
  <MysticalBackground variant="particles" {...props} />
);

export const SacredBackground = React.memo<Omit<MysticalBackgroundProps, 'variant'>>((props) => 
  <MysticalBackground variant="sacred" {...props} />
);

export const CosmicBackground = React.memo<Omit<MysticalBackgroundProps, 'variant'>>((props) => 
  <MysticalBackground variant="cosmic" {...props} />
);

export const AuroraBackground = React.memo<Omit<MysticalBackgroundProps, 'variant'>>((props) => 
  <MysticalBackground variant="aurora" {...props} />
);

// CSS 키프레임 애니메이션
const mysticalKeyframes = `
@keyframes aurora-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes sacred-rotation {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes sacred-geometry {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
}

@keyframes particle-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

@keyframes layer-shift {
  0%, 100% { transform: translateX(0%); opacity: 0.3; }
  50% { transform: translateX(2%); opacity: 0.6; }
}

@keyframes layer-pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.02); }
}

@keyframes mystical-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 접근성: 동작 감소 설정 고려 */
@media (prefers-reduced-motion: reduce) {
  .mystical-background * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// 키프레임 주입
if (typeof document !== 'undefined' && !document.head.querySelector('#mystical-background-keyframes')) {
  const style = document.createElement('style');
  style.id = 'mystical-background-keyframes';
  style.textContent = mysticalKeyframes;
  document.head.appendChild(style);
}

export default MysticalBackground;