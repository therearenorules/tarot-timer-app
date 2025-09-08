import React from 'react';

// React Native 호환 가이드라인 컴포넌트들
// CSS pseudo-elements (::before, ::after) 대신 별도 View로 구현

interface GuidelineComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

// Celtic Cross 가이드라인
export function CelticCrossGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* 세로선 */}
      <div 
        className="absolute bg-premium-gold/20"
        style={{
          left: '42%',
          top: '20%',
          width: '1px',
          height: '60%',
          transform: 'translateX(-50%)'
        }}
      />
      {/* 가로선 */}
      <div 
        className="absolute bg-premium-gold/20"
        style={{
          left: '15%',
          top: '45%',
          width: '54%',
          height: '1px',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
}

// AB Choice 가이드라인 (A/B 그룹 영역 표시)
export function ABChoiceGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* A 그룹 영역 */}
      <div 
        className="absolute border-2 border-dashed border-premium-gold/20 bg-premium-gold/5 rounded-xl"
        style={{
          left: '15%',
          top: '15%',
          width: '20%',
          height: '70%'
        }}
      />
      {/* B 그룹 영역 */}
      <div 
        className="absolute border-2 border-dashed border-premium-gold/20 bg-premium-gold/5 rounded-xl"
        style={{
          right: '15%',
          top: '15%',
          width: '20%',
          height: '70%'
        }}
      />
    </div>
  );
}

// Relationship 가이드라인
export function RelationshipGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* 상단 가로선 */}
      <div 
        className="absolute bg-premium-gold/20"
        style={{
          left: '20%',
          top: '2%',
          width: '60%',
          height: '1px',
          transform: 'translateY(-50%)'
        }}
      />
      {/* 중앙 세로선 */}
      <div 
        className="absolute bg-premium-gold/20"
        style={{
          left: '50%',
          top: '33%',
          width: '1px',
          height: '47%',
          transform: 'translateX(-50%)'
        }}
      />
      {/* 관계 연결 영역 */}
      <div 
        className="absolute border border-dashed border-premium-gold/10 rounded-2xl"
        style={{
          left: '25%',
          top: '25%',
          width: '50%',
          height: '55%'
        }}
      />
    </div>
  );
}

// Five Card V-Shape 가이드라인
export function FiveCardVGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* 왼쪽 V자 라인 */}
      <div 
        className="absolute bg-gradient-to-b from-premium-gold/30 to-premium-gold/10"
        style={{
          left: '35%',
          top: '35%',
          width: '2px',
          height: '30%',
          transform: 'rotate(-25deg)',
          transformOrigin: 'bottom'
        }}
      />
      {/* 오른쪽 V자 라인 */}
      <div 
        className="absolute bg-gradient-to-b from-premium-gold/30 to-premium-gold/10"
        style={{
          right: '35%',
          top: '35%',
          width: '2px',
          height: '30%',
          transform: 'rotate(25deg)',
          transformOrigin: 'bottom'
        }}
      />
    </div>
  );
}

// Four Card 연결선 가이드라인
export function FourCardGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* 수평 연결선 */}
      <div 
        className="absolute"
        style={{
          left: '15%',
          top: '50%',
          width: '70%',
          height: '2px',
          background: 'linear-gradient(to right, transparent 0%, rgba(212, 175, 55, 0.2) 20%, rgba(212, 175, 55, 0.3) 50%, rgba(212, 175, 55, 0.2) 80%, transparent 100%)',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
}

// Three Card 간단한 가이드라인 (필요시)
export function ThreeCardGuidelines({ className = '', style = {} }: GuidelineComponentProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={style}>
      {/* 중앙 포커스 서클 */}
      <div 
        className="absolute border border-premium-gold/10 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: '300px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.05) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}

// 프로그레스 인디케이터 (React Native 호환 애니메이션)
interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export function ProgressIndicator({ current, total, label, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`absolute top-4 left-4 bg-black/40 rounded-lg px-3 py-2 border border-premium-gold/30 z-20 ${className}`}>
      <div className="flex items-center gap-2">
        {/* React Native 호환: CSS 애니메이션 대신 컴포넌트 사용 */}
        <div className="w-2 h-2 bg-premium-gold rounded-full animate-mystical-pulse" 
             style={{ 
               animationDuration: '2s',
               animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
               animationIterationCount: 'infinite'
             }}></div>
        <span className="text-sm text-premium-gold font-medium">
          {current} / {total}
        </span>
        {label && (
          <span className="text-xs text-white/60 ml-2">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// 범용 카드 컨테이너 (backdrop-blur 제거)
interface CardContainerProps {
  children: React.ReactNode;
  isRevealed?: boolean;
  isEmpty?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardContainer({ 
  children, 
  isRevealed = false, 
  isEmpty = false, 
  className = '', 
  style = {} 
}: CardContainerProps) {
  const getCardStyles = () => {
    if (isRevealed) {
      return 'border-premium-gold shadow-premium bg-white';
    } else if (isEmpty) {
      return 'border-premium-gold/50 border-dashed bg-white/15 shadow-empty';
    } else {
      return 'border-premium-gold/60 bg-white shadow-card';
    }
  };

  const getBoxShadow = () => {
    if (isRevealed) {
      return '0 8px 32px rgba(212, 175, 55, 0.4)';
    } else if (isEmpty) {
      return '0 2px 12px rgba(74, 26, 79, 0.08)';
    } else {
      return '0 4px 20px rgba(0,0,0,0.3)';
    }
  };

  return (
    <div 
      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${getCardStyles()} ${className}`}
      style={{
        boxShadow: getBoxShadow(),
        ...style
      }}
    >
      {children}
    </div>
  );
}

// 카드 라벨 컴포넌트
interface CardLabelProps {
  text: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  rotate?: number;
  className?: string;
}

export function CardLabel({ text, position = 'bottom', rotate = 0, className = '' }: CardLabelProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          top: '-25px',
          left: '50%',
          transform: `translateX(-50%) rotate(${rotate}deg)`
        };
      case 'left':
        return {
          top: '50%',
          left: '-25px',
          transform: `translateY(-50%) rotate(${rotate}deg)`
        };
      case 'right':
        return {
          top: '50%',
          right: '-25px',
          transform: `translateY(-50%) rotate(${rotate}deg)`
        };
      default: // bottom
        return {
          top: '100%',
          left: '50%',
          transform: `translateX(-50%) translateY(4px) rotate(${rotate}deg)`,
          transformOrigin: rotate !== 0 ? 'center top' : 'center'
        };
    }
  };

  return (
    <div 
      className={`absolute text-xs font-medium text-premium-gold text-center whitespace-nowrap max-w-20 ${className}`}
      style={{
        ...getPositionStyles(),
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}
    >
      {text}
    </div>
  );
}

// 카드 오버레이 (그라데이션 효과)
export function CardOverlay({ className = '' }: { className?: string }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent ${className}`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent ${className}`} />
    </>
  );
}

// 확대 아이콘 (backdrop-blur 제거)
export function ZoomIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center ${className}`}>
      <svg 
        className="h-2 w-2 text-white" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </div>
  );
}