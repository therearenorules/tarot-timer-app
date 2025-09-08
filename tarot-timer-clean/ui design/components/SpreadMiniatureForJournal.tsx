import React from 'react';
import { SavedSpread } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { Layout, Star, Crown } from './mystical-ui/icons';

// Simple icon alternatives for missing icons
const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" strokeWidth="2"/>
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
  </svg>
);

const Circle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
  </svg>
);

const Grid3X3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
    <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2"/>
    <line x1="15" y1="3" x2="15" y2="21" strokeWidth="2"/>
    <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
    <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2"/>
  </svg>
);

interface SpreadMiniatureForJournalProps {
  spread: SavedSpread;
  className?: string;
}

export function SpreadMiniatureForJournal({ spread, className = '' }: SpreadMiniatureForJournalProps) {
  const { language } = useLanguage();
  
  const getSpreadIcon = () => {
    switch (spread.spreadType) {
      case 'celtic-cross':
        return Crown;
      case 'career':
        return Target;
      case 'love':
        return Heart;
      case 'five-card':
        return Star;
      case 'four-card':
        return Grid3X3;
      case 'three-card':
        return Layout;
      default:
        return Layout;
    }
  };

  const renderSpreadLayout = () => {
    if (spread.spreadType === 'celtic-cross') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* Celtic Cross 미니어처 배치 */}
            <div className="relative w-full h-full">
              {/* 중앙 십자가 */}
              <div className="absolute left-[35%] top-[50%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[35%] top-[50%] w-2.5 h-1.5 bg-premium-gold/40 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[35%] top-[75%] w-1.5 h-2.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[20%] top-[50%] w-1.5 h-2.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[35%] top-[25%] w-1.5 h-2.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[50%] top-[50%] w-1.5 h-2.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 오른쪽 스태프 */}
              <div className="absolute left-[75%] top-[20%] w-1.5 h-2.5 bg-premium-gold/40 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[40%] w-1.5 h-2.5 bg-premium-gold/40 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[60%] w-1.5 h-2.5 bg-premium-gold/40 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[80%] w-1.5 h-2.5 bg-premium-gold/40 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 가이드 라인 */}
              <div className="absolute left-[35%] top-[20%] w-0.5 h-[60%] bg-premium-gold/20 transform -translate-x-1/2"></div>
              <div className="absolute left-[15%] top-[50%] w-[40%] h-0.5 bg-premium-gold/20 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      );
    } else if (spread.spreadType === 'career') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* AB선택 스프레드 미니어처 */}
            <div className="relative w-full h-full">
              {/* A 그룹 */}
              <div className="absolute left-[25%] top-[25%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[25%] top-[50%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[25%] top-[75%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 중앙 조언 */}
              <div className="absolute left-[50%] top-[50%] w-1.5 h-2.5 bg-premium-gold/80 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* B 그룹 */}
              <div className="absolute left-[75%] top-[25%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[50%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[75%] w-1.5 h-2.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* A, B 라벨 */}
              <div className="absolute left-[25%] top-[12%] text-[8px] font-bold text-premium-gold transform -translate-x-1/2">A</div>
              <div className="absolute left-[75%] top-[12%] text-[8px] font-bold text-premium-gold transform -translate-x-1/2">B</div>
              
              {/* 그룹 영역 표시 */}
              <div className="absolute left-[15%] top-[20%] w-[20%] h-[60%] border border-dashed border-premium-gold/20 rounded"></div>
              <div className="absolute right-[15%] top-[20%] w-[20%] h-[60%] border border-dashed border-premium-gold/20 rounded"></div>
            </div>
          </div>
        </div>
      );
    } else if (spread.spreadType === 'love') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* 컵 오브 릴레이션십 미니어처 */}
            <div className="relative w-full h-full">
              {/* 상단 행 */}
              <div className="absolute left-[20%] top-[15%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[50%] top-[15%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[80%] top-[15%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 중상단 */}
              <div className="absolute left-[35%] top-[35%] w-1 h-1.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[65%] top-[35%] w-1 h-1.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 중앙 */}
              <div className="absolute left-[50%] top-[50%] w-1.5 h-2 bg-premium-gold/80 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 중하단 */}
              <div className="absolute left-[65%] top-[65%] w-1 h-1.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[50%] top-[75%] w-1 h-1.5 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 하단 행 */}
              <div className="absolute left-[20%] top-[90%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[50%] top-[90%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[80%] top-[90%] w-1 h-1.5 bg-premium-gold/50 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 연결 라인 */}
              <div className="absolute left-[50%] top-[40%] w-0.5 h-[30%] bg-premium-gold/30 transform -translate-x-1/2"></div>
              <div className="absolute left-[20%] top-[15%] w-[60%] h-0.5 bg-premium-gold/20 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      );
    } else if (spread.spreadType === 'five-card') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* 5카드 역V자 형태 미니어처 */}
            <div className="relative w-full h-full">
              {/* 상단 두 카드 */}
              <div className="absolute left-[25%] top-[25%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[25%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 중간 두 카드 */}
              <div className="absolute left-[35%] top-[50%] w-1.5 h-2 bg-premium-gold/70 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[65%] top-[50%] w-1.5 h-2 bg-premium-gold/70 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 하단 중앙 카드 */}
              <div className="absolute left-[50%] top-[75%] w-1.5 h-2 bg-premium-gold/80 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* V자 가이드 라인 */}
              <div className="absolute left-[40%] top-[35%] w-0.5 h-[25%] bg-premium-gold/30 transform -translate-x-1/2 rotate-45 origin-top"></div>
              <div className="absolute left-[60%] top-[35%] w-0.5 h-[25%] bg-premium-gold/30 transform -translate-x-1/2 -rotate-45 origin-top"></div>
            </div>
          </div>
        </div>
      );
    } else if (spread.spreadType === 'four-card') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* 4카드 수평 일렬 미니어처 */}
            <div className="relative w-full h-full">
              <div className="absolute left-[20%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[40%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[60%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[80%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 연결 라인 */}
              <div className="absolute left-[20%] top-[50%] w-[60%] h-0.5 bg-premium-gold/30 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      );
    } else if (spread.spreadType === 'three-card') {
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0">
            {/* 3카드 수평 일렬 미니어처 */}
            <div className="relative w-full h-full">
              <div className="absolute left-[25%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[50%] top-[50%] w-1.5 h-2 bg-premium-gold/70 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-[75%] top-[50%] w-1.5 h-2 bg-premium-gold/60 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* 연결 라인 */}
              <div className="absolute left-[25%] top-[50%] w-[50%] h-0.5 bg-premium-gold/30 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      );
    } else {
      // 기본 스프레드 (알 수 없는 타입)
      const Icon = getSpreadIcon();
      return (
        <div className={`relative w-full h-28 bg-gradient-to-br from-deep-purple/10 via-midnight-blue/10 to-deep-purple/10 rounded-lg overflow-hidden border border-premium-gold/20 ${className}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-8 w-8 text-premium-gold/60" />
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="relative">
      {renderSpreadLayout()}
      
      {/* 스프레드 이름 표시 */}
      <div className="absolute -bottom-1 left-0 right-0 text-center">
        <span className="text-[10px] text-premium-gold/70 font-medium bg-midnight-blue/50 px-2 py-0.5 rounded backdrop-blur-sm">
          {spread.spreadName}
        </span>
      </div>
    </div>
  );
}