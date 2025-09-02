import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * ⏰ 프리미엄 타이머 디스플레이 컴포넌트
 * 
 * 신비로운 효과와 실시간 업데이트가 포함된 24시간 타로 타이머.
 * 모바일 우선 반응형 디자인으로 제작되었습니다.
 * 
 * 주요 기능:
 * - 실시간 시간 업데이트 (초 단위 정확도)
 * - 신비로운 글로우 효과 및 애니메이션
 * - 현재 시간대 강조 표시
 * - 자정 자동 리셋 및 전환 애니메이션
 * - 다크/라이트 모드 지원
 * - 접근성 최적화 (스크린 리더 지원)
 * - 터치 친화적 인터페이스
 */

interface TimerDisplayProps {
  // 시간 관련 props
  currentHour?: number;
  highlightCurrentHour?: boolean;
  show24HourFormat?: boolean;
  showSeconds?: boolean;
  
  // 스타일 관련 props
  size?: 'compact' | 'normal' | 'large';
  variant?: 'mystical' | 'elegant' | 'minimal';
  glowIntensity?: 'subtle' | 'normal' | 'intense';
  
  // 인터랙션 props
  onHourClick?: (hour: number) => void;
  interactive?: boolean;
  
  // 커스터마이징 props
  className?: string;
  style?: React.CSSProperties;
  
  // 이벤트 핸들러
  onMidnight?: () => void;
  onQuarterHour?: (quarter: number) => void;
}

/**
 * 시간 포맷팅 유틸리티
 */
const formatTime = (date: Date, show24Hour: boolean = true, showSeconds: boolean = false) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  if (show24Hour) {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return showSeconds ? `${timeString}:${seconds.toString().padStart(2, '0')}` : timeString;
  } else {
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')}`;
    const fullTime = showSeconds ? `${timeString}:${seconds.toString().padStart(2, '0')}` : timeString;
    return `${fullTime} ${period}`;
  }
};

/**
 * 시간대별 신비로운 색상 계산
 */
const getMysticalTimeColor = (hour: number): string => {
  // 24시간을 색상환으로 매핑
  const colorMap = {
    0: '#4A1A4F',   // 자정 - 깊은 보라
    3: '#2D1B69',   // 새벽 - 진한 파랑
    6: '#FF6B6B',   // 일출 - 주황빛
    9: '#F7DC6F',   // 오전 - 황금빛
    12: '#5DADE2',  // 정오 - 하늘색
    15: '#58D68D',  // 오후 - 초록빛
    18: '#AF7AC5',  // 저녁 - 보라빛
    21: '#85929E',  // 밤 - 은빛
  };
  
  // 가장 가까운 시간대의 색상 선택
  const timeKeys = Object.keys(colorMap).map(Number).sort((a, b) => a - b);
  let closestTime = timeKeys[0];
  
  for (const time of timeKeys) {
    if (Math.abs(hour - time) < Math.abs(hour - closestTime)) {
      closestTime = time;
    }
  }
  
  return colorMap[closestTime as keyof typeof colorMap];
};

/**
 * 프리미엄 타이머 디스플레이 컴포넌트
 */
export const TimerDisplay = React.memo<TimerDisplayProps>(({
  currentHour,
  highlightCurrentHour = true,
  show24HourFormat = true,
  showSeconds = false,
  size = 'normal',
  variant = 'mystical',
  glowIntensity = 'normal',
  onHourClick,
  interactive = false,
  className = '',
  style = {},
  onMidnight,
  onQuarterHour,
}) => {
  // 현재 시간 상태
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previousHour, setPreviousHour] = useState(new Date().getHours());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 크기별 설정
  const sizeConfig = useMemo(() => {
    const configs = {
      compact: { 
        fontSize: 24, 
        padding: 12, 
        glowRadius: 8,
        spacing: 8
      },
      normal: { 
        fontSize: 36, 
        padding: 20, 
        glowRadius: 12,
        spacing: 12
      },
      large: { 
        fontSize: 48, 
        padding: 28, 
        glowRadius: 16,
        spacing: 16
      },
    };
    return configs[size];
  }, [size]);

  // 글로우 강도 매핑
  const glowConfig = useMemo(() => {
    const configs = {
      subtle: { opacity: 0.3, blur: 8 },
      normal: { opacity: 0.5, blur: 12 },
      intense: { opacity: 0.8, blur: 20 },
    };
    return configs[glowIntensity];
  }, [glowIntensity]);

  // 실시간 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHourNow = now.getHours();
      
      // 시간 변경 감지 및 트랜지션
      if (currentHourNow !== previousHour) {
        setIsTransitioning(true);
        setPreviousHour(currentHourNow);
        
        // 자정 이벤트
        if (currentHourNow === 0) {
          onMidnight?.();
        }
        
        setTimeout(() => setIsTransitioning(false), 1000);
      }
      
      // 15분 단위 이벤트
      if (now.getMinutes() % 15 === 0 && now.getSeconds() === 0) {
        onQuarterHour?.(Math.floor(now.getMinutes() / 15));
      }
      
      setCurrentTime(now);
    }, showSeconds ? 1000 : 60000); // 초 표시시 1초, 아니면 1분 간격

    return () => clearInterval(interval);
  }, [previousHour, showSeconds, onMidnight, onQuarterHour]);

  // 현재 시간 기반 신비로운 색상
  const mysticalColor = useMemo(() => 
    getMysticalTimeColor(currentTime.getHours()), 
    [currentTime.getHours()]
  );

  // 시간 클릭 핸들러
  const handleTimeClick = useCallback(() => {
    if (interactive && onHourClick) {
      onHourClick(currentTime.getHours());
    }
  }, [interactive, onHourClick, currentTime]);

  // 베이스 스타일
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizeConfig.padding,
    borderRadius: 'var(--radius-large)',
    position: 'relative',
    cursor: interactive ? 'pointer' : 'default',
    userSelect: 'none',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  // 변형별 스타일
  const variantStyles: React.CSSProperties = useMemo(() => {
    switch (variant) {
      case 'mystical':
        return {
          background: `
            radial-gradient(circle at center, 
              color-mix(in srgb, ${mysticalColor} 10%, var(--card)) 0%,
              var(--card) 70%
            )
          `,
          border: `1px solid color-mix(in srgb, ${mysticalColor} 30%, var(--border))`,
          backdropFilter: 'blur(10px)',
          boxShadow: `
            0 0 ${sizeConfig.glowRadius}px 
            color-mix(in srgb, ${mysticalColor} ${glowConfig.opacity * 100}%, transparent),
            0 4px 20px rgba(0, 0, 0, 0.1)
          `,
        };
      
      case 'elegant':
        return {
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        };
      
      case 'minimal':
        return {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        };
      
      default:
        return {};
    }
  }, [variant, mysticalColor, sizeConfig.glowRadius, glowConfig.opacity]);

  // 트랜지션 효과
  const transitionStyles: React.CSSProperties = isTransitioning ? {
    transform: 'scale(1.05)',
    filter: 'brightness(1.2)',
  } : {};

  // 시간 텍스트 스타일
  const timeTextStyle: React.CSSProperties = {
    fontSize: sizeConfig.fontSize,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: variant === 'mystical' ? mysticalColor : 'var(--foreground)',
    textShadow: variant === 'mystical' ? 
      `0 0 ${glowConfig.blur}px color-mix(in srgb, ${mysticalColor} ${glowConfig.opacity * 100}%, transparent)` : 
      'none',
    letterSpacing: '0.05em',
    lineHeight: '1',
    transition: 'all 0.6s ease',
  };

  // 날짜 텍스트 스타일
  const dateTextStyle: React.CSSProperties = {
    fontSize: sizeConfig.fontSize * 0.4,
    fontWeight: '500',
    color: 'var(--muted-foreground)',
    marginTop: sizeConfig.spacing / 2,
    opacity: 0.8,
  };

  // 시간대 인디케이터 스타일
  const periodIndicatorStyle: React.CSSProperties = {
    fontSize: sizeConfig.fontSize * 0.3,
    fontWeight: '600',
    color: variant === 'mystical' ? mysticalColor : 'var(--accent)',
    marginLeft: sizeConfig.spacing / 2,
    opacity: 0.9,
  };

  // 현재 시간 포맷팅
  const formattedTime = formatTime(currentTime, show24HourFormat, showSeconds);
  const formattedDate = currentTime.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  // 현재 시간대 설명
  const getTimeDescription = (hour: number): string => {
    if (hour >= 5 && hour < 12) return '아침';
    if (hour >= 12 && hour < 17) return '오후';
    if (hour >= 17 && hour < 21) return '저녁';
    return '밤';
  };

  return (
    <div
      className={`timer-display ${className}`.trim()}
      style={{
        ...baseStyles,
        ...variantStyles,
        ...transitionStyles,
      }}
      onClick={handleTimeClick}
      role={interactive ? 'button' : 'timer'}
      aria-label={`현재 시간: ${formattedTime}, ${formattedDate}`}
      tabIndex={interactive ? 0 : -1}
    >
      {/* 신비로운 배경 효과 */}
      {variant === 'mystical' && (
        <>
          {/* 펄스 오버레이 */}
          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: 'inherit',
              background: `linear-gradient(45deg, ${mysticalColor}20, transparent, ${mysticalColor}10)`,
              animation: 'mystical-pulse 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          
          {/* 움직이는 별들 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '2px',
                  background: mysticalColor,
                  borderRadius: '50%',
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* 메인 시간 표시 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={timeTextStyle}>
          {show24HourFormat ? (
            formattedTime
          ) : (
            <>
              {formattedTime.split(' ')[0]}
              <span style={periodIndicatorStyle}>
                {formattedTime.split(' ')[1]}
              </span>
            </>
          )}
        </div>
        
        {/* 날짜 표시 */}
        <div style={dateTextStyle}>
          {formattedDate} · {getTimeDescription(currentTime.getHours())}
        </div>
        
        {/* 현재 시간대 강조 */}
        {highlightCurrentHour && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              border: `2px solid ${mysticalColor}40`,
              borderRadius: 'var(--radius-medium)',
              pointerEvents: 'none',
              animation: isTransitioning ? 'hour-transition 1s ease-out' : undefined,
            }}
          />
        )}
      </div>

      {/* 자정 특별 효과 */}
      {currentTime.getHours() === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: 'inherit',
            background: `radial-gradient(circle, ${mysticalColor}30 0%, transparent 70%)`,
            animation: 'midnight-aura 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';

// 편의 컴포넌트들
export const CompactTimer = React.memo<Omit<TimerDisplayProps, 'size'>>((props) => 
  <TimerDisplay size="compact" {...props} />
);

export const NormalTimer = React.memo<Omit<TimerDisplayProps, 'size'>>((props) => 
  <TimerDisplay size="normal" {...props} />
);

export const LargeTimer = React.memo<Omit<TimerDisplayProps, 'size'>>((props) => 
  <TimerDisplay size="large" {...props} />
);

export const MysticalTimer = React.memo<Omit<TimerDisplayProps, 'variant'>>((props) => 
  <TimerDisplay variant="mystical" {...props} />
);

export const ElegantTimer = React.memo<Omit<TimerDisplayProps, 'variant'>>((props) => 
  <TimerDisplay variant="elegant" {...props} />
);

export const MinimalTimer = React.memo<Omit<TimerDisplayProps, 'variant'>>((props) => 
  <TimerDisplay variant="minimal" {...props} />
);

// CSS 키프레임 애니메이션
const timerKeyframes = `
@keyframes mystical-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.02); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes hour-transition {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes midnight-aura {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.timer-display {
  --mystical-transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

// 키프레임 주입
if (typeof document !== 'undefined' && !document.head.querySelector('#timer-display-keyframes')) {
  const style = document.createElement('style');
  style.id = 'timer-display-keyframes';
  style.textContent = timerKeyframes;
  document.head.appendChild(style);
}

export default TimerDisplay;