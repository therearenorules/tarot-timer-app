import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { TarotCard as TarotCardType } from '../../../figma UI/utils/tarot-cards';
import { TarotCardThumbnail } from './TarotCard';

/**
 * ⏰ 부드러운 시간대 네비게이션 스트립
 * 
 * 24시간 타로 타이머를 위한 수평 스크롤 네비게이션 컴포넌트.
 * 터치 친화적이며 부드러운 스크롤링과 스냅 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 24시간 수평 스크롤 네비게이션
 * - 현재 시간 자동 중앙 정렬
 * - 터치/마우스 드래그 지원
 * - 부드러운 스냅 애니메이션
 * - 카드 상태별 시각적 표시
 * - 미니맵 표시 (선택사항)
 * - 접근성 최적화
 * - 성능 최적화 (가상화)
 */

interface HourData {
  hour: number;
  card?: TarotCardType;
  isRevealed: boolean;
  hasMemo: boolean;
  isCurrentHour: boolean;
}

interface HourStripProps {
  // 데이터
  hours: HourData[];
  currentHour?: number;
  
  // 인터랙션
  onHourSelect?: (hour: number) => void;
  onCardClick?: (hour: number) => void;
  
  // 스크롤 설정
  autoCenter?: boolean;
  snapToHour?: boolean;
  smoothScroll?: boolean;
  
  // 디스플레이 설정
  showMinimap?: boolean;
  showTimeLabels?: boolean;
  showCardPreviews?: boolean;
  compactMode?: boolean;
  
  // 시각적 설정
  highlightCurrent?: boolean;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
  
  // 성능 설정
  virtualized?: boolean;
  visibleHours?: number; // 한 번에 보이는 시간 수
  
  // 스타일 props
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 시간 포맷 유틸리티
 */
const formatHour = (hour: number, format24: boolean = true): string => {
  if (format24) {
    return `${hour.toString().padStart(2, '0')}:00`;
  } else {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}${period}`;
  }
};

/**
 * 시간대별 색상 생성
 */
const getHourColor = (hour: number): string => {
  const colors = {
    dawn: '#FF6B6B',      // 새벽 (5-7)
    morning: '#F7DC6F',   // 아침 (8-11)
    noon: '#5DADE2',      // 정오 (12-14)
    afternoon: '#58D68D', // 오후 (15-17)
    evening: '#AF7AC5',   // 저녁 (18-20)
    night: '#85929E',     // 밤 (21-23)
    midnight: '#4A1A4F',  // 자정 (0-4)
  };
  
  if (hour >= 5 && hour <= 7) return colors.dawn;
  if (hour >= 8 && hour <= 11) return colors.morning;
  if (hour >= 12 && hour <= 14) return colors.noon;
  if (hour >= 15 && hour <= 17) return colors.afternoon;
  if (hour >= 18 && hour <= 20) return colors.evening;
  if (hour >= 21 && hour <= 23) return colors.night;
  return colors.midnight;
};

/**
 * 시간대 네비게이션 스트립 컴포넌트
 */
export const HourStrip = React.memo<HourStripProps>(({
  hours,
  currentHour = new Date().getHours(),
  onHourSelect,
  onCardClick,
  autoCenter = true,
  snapToHour = true,
  smoothScroll = true,
  showMinimap = false,
  showTimeLabels = true,
  showCardPreviews = true,
  compactMode = false,
  highlightCurrent = true,
  showProgress = true,
  variant = 'default',
  virtualized = false,
  visibleHours = 7,
  className = '',
  style = {},
}) => {
  // 참조
  const stripRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 상태
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  // 아이템 크기 계산
  const itemSize = useMemo(() => {
    if (compactMode) return 48;
    return showCardPreviews ? 80 : 60;
  }, [compactMode, showCardPreviews]);

  // 현재 시간으로 자동 스크롤
  const scrollToHour = useCallback((hour: number, smooth = true) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const targetPosition = hour * itemSize - (container.clientWidth / 2) + (itemSize / 2);
    
    if (smooth && smoothScroll) {
      container.scrollTo({
        left: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    } else {
      container.scrollLeft = Math.max(0, targetPosition);
    }
  }, [itemSize, smoothScroll]);

  // 현재 시간 자동 중앙 정렬
  useEffect(() => {
    if (autoCenter && !isDragging) {
      const timer = setTimeout(() => {
        scrollToHour(currentHour, true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentHour, autoCenter, isDragging, scrollToHour]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    setScrollPosition(container.scrollLeft);
    
    if (!isDragging) {
      setIsScrolling(true);
      
      // 스크롤 완료 감지
      const scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        
        // 스냅 기능
        if (snapToHour && !isDragging) {
          const nearestHour = Math.round(container.scrollLeft / itemSize);
          if (Math.abs(container.scrollLeft - nearestHour * itemSize) > itemSize * 0.1) {
            scrollToHour(nearestHour, true);
          }
        }
      }, 150);
      
      return () => clearTimeout(scrollTimer);
    }
  }, [isDragging, snapToHour, itemSize, scrollToHour]);

  // 드래그 시작
  const handleDragStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    
    setDragStart({
      x: clientX,
      scrollLeft: container.scrollLeft,
    });
  }, []);

  // 드래그 중
  const handleDragMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const deltaX = clientX - dragStart.x;
    
    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - deltaX;
  }, [isDragging, dragStart]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    // 스냅 적용
    if (snapToHour && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const nearestHour = Math.round(container.scrollLeft / itemSize);
      scrollToHour(nearestHour, true);
    }
  }, [snapToHour, itemSize, scrollToHour]);

  // 시간 클릭 핸들러
  const handleHourClick = useCallback((hour: number) => {
    onHourSelect?.(hour);
    if (!isDragging) {
      scrollToHour(hour, true);
    }
  }, [onHourSelect, isDragging, scrollToHour]);

  // 카드 클릭 핸들러
  const handleCardClick = useCallback((hour: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onCardClick?.(hour);
  }, [onCardClick]);

  // 가상화된 시간 아이템들
  const visibleItems = useMemo(() => {
    if (!virtualized) return hours;
    
    const startIndex = Math.max(0, Math.floor(scrollPosition / itemSize) - 2);
    const endIndex = Math.min(hours.length, startIndex + visibleHours + 4);
    
    return hours.slice(startIndex, endIndex);
  }, [virtualized, hours, scrollPosition, itemSize, visibleHours]);

  // 스트립 스타일
  const stripStyles: React.CSSProperties = {
    width: '100%',
    height: compactMode ? 60 : 100,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: variant === 'premium' ? 'var(--card)' : 'transparent',
    borderRadius: variant === 'premium' ? 'var(--radius-large)' : '0',
    border: variant === 'premium' ? '1px solid var(--border)' : 'none',
    ...style,
  };

  // 스크롤 컨테이너 스타일
  const scrollContainerStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    scrollBehavior: smoothScroll ? 'smooth' : 'auto',
  };

  // 시간 아이템 렌더링
  const renderHourItem = useCallback((hourData: HourData, index: number) => {
    const { hour, card, isRevealed, hasMemo, isCurrentHour } = hourData;
    const hourColor = getHourColor(hour);
    const isActive = highlightCurrent && isCurrentHour;
    
    return (
      <div
        key={hour}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: itemSize,
          height: '100%',
          flexShrink: 0,
          padding: '8px 4px',
          cursor: 'pointer',
          borderRadius: 'var(--radius)',
          border: isActive ? `2px solid ${hourColor}` : '2px solid transparent',
          backgroundColor: isActive ? `${hourColor}10` : 'transparent',
          transition: 'all 0.3s ease',
          position: 'relative',
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
        }}
        onClick={() => handleHourClick(hour)}
      >
        {/* 시간 라벨 */}
        {showTimeLabels && (
          <div
            style={{
              fontSize: compactMode ? 10 : 12,
              fontWeight: isActive ? '600' : '500',
              color: isActive ? hourColor : 'var(--muted-foreground)',
              marginBottom: 4,
              lineHeight: '1',
            }}
          >
            {formatHour(hour)}
          </div>
        )}
        
        {/* 카드 미리보기 */}
        {showCardPreviews && (
          <div
            style={{
              width: compactMode ? 24 : 32,
              height: compactMode ? 36 : 48,
              position: 'relative',
            }}
            onClick={(e) => card && handleCardClick(hour, e)}
          >
            {card ? (
              <TarotCardThumbnail
                card={card}
                state={isRevealed ? 'face-up' : 'face-down'}
                size="thumbnail"
                interactive={false}
                style={{
                  filter: isActive ? 'brightness(1.1)' : 'none',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-small)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted-foreground)',
                  fontSize: 8,
                }}
              >
                Empty
              </div>
            )}
          </div>
        )}
        
        {/* 메모 인디케이터 */}
        {hasMemo && (
          <div
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: hourColor,
              opacity: 0.8,
            }}
          />
        )}
        
        {/* 현재 시간 인디케이터 */}
        {isCurrentHour && highlightCurrent && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: 2,
              backgroundColor: hourColor,
              borderRadius: '1px',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </div>
    );
  }, [
    itemSize, 
    compactMode, 
    highlightCurrent, 
    showTimeLabels, 
    showCardPreviews, 
    handleHourClick, 
    handleCardClick
  ]);

  // 진행률 바 렌더링
  const renderProgressBar = () => {
    if (!showProgress) return null;
    
    const progress = (currentHour / 23) * 100;
    
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: 'var(--border)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: getHourColor(currentHour),
            transition: 'width 1s ease',
          }}
        />
      </div>
    );
  };

  // 미니맵 렌더링
  const renderMinimap = () => {
    if (!showMinimap) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 80,
          height: 20,
          backgroundColor: 'var(--popover)',
          borderRadius: 'var(--radius-small)',
          border: '1px solid var(--border)',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 2,
              height: '100%',
              backgroundColor: hours[i]?.card ? 
                (hours[i]?.isRevealed ? getHourColor(i) : 'var(--muted)') : 
                'var(--border)',
              borderRadius: '1px',
              opacity: i === currentHour ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={stripRef}
      className={`hour-strip ${className}`.trim()}
      style={stripStyles}
    >
      <div
        ref={scrollContainerRef}
        style={scrollContainerStyles}
        onScroll={handleScroll}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        role="tablist"
        aria-label="24시간 타로 네비게이션"
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: virtualized ? `${hours.length * itemSize}px` : 'auto',
            paddingLeft: virtualized ? `${Math.floor(scrollPosition / itemSize) * itemSize}px` : 0,
          }}
        >
          {(virtualized ? visibleItems : hours).map((hourData, index) => 
            renderHourItem(hourData, index)
          )}
        </div>
      </div>
      
      {renderProgressBar()}
      {renderMinimap()}
    </div>
  );
});

HourStrip.displayName = 'HourStrip';

// 편의 컴포넌트들
export const CompactHourStrip = React.memo<Omit<HourStripProps, 'compactMode'>>((props) => 
  <HourStrip compactMode={true} {...props} />
);

export const PremiumHourStrip = React.memo<Omit<HourStripProps, 'variant'>>((props) => 
  <HourStrip variant="premium" showMinimap={true} {...props} />
);

export const MinimalHourStrip = React.memo<Omit<HourStripProps, 'variant' | 'showCardPreviews' | 'showMinimap'>>((props) => 
  <HourStrip variant="minimal" showCardPreviews={false} showMinimap={false} {...props} />
);

// CSS 키프레임
const hourStripKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hour-strip {
  /* 스크롤바 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hour-strip::-webkit-scrollbar {
  display: none;
}

/* 터치 스크롤 최적화 */
.hour-strip {
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.hour-strip > div > div {
  scroll-snap-align: center;
}
`;

// 키프레임 주입
if (typeof document !== 'undefined' && !document.head.querySelector('#hour-strip-keyframes')) {
  const style = document.createElement('style');
  style.id = 'hour-strip-keyframes';
  style.textContent = hourStripKeyframes;
  document.head.appendChild(style);
}

export default HourStrip;