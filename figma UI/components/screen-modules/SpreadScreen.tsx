import React, { useState, useCallback } from 'react';
import { SpreadDetail } from '../composite/SpreadDetail';
import { Button } from '../base/Button';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';
import { Icon } from '../base/Icon';
import { TAROT_SPREADS, type ExtendedSpreadType } from '../../utils/tarot';
import { useLanguage } from '../../utils/language';

/**
 * 🎴 Spread Screen Module - Mobile-First Premium Design
 * 
 * Redesigned tarot spread selection and execution screen with
 * mobile-optimized touch interactions and professional spread layouts.
 * 
 * Features:
 * - Mobile-first responsive design
 * - Touch-optimized spread selection
 * - Professional spread layouts (Celtic Cross, AB선택, Love, etc.)
 * - CSS Grid positioning system for precise card placement
 * - Enhanced mobile interactions and safe areas
 */

interface SpreadScreenProps {
  onBack?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mobile-Optimized Mystical Header Component
 */
function SpreadHeader() {
  const { language } = useLanguage();
  
  return (
    <div className="relative overflow-hidden">
      {/* Mobile-optimized mystical gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-cosmic to-brand-secondary opacity-95"></div>
      
      {/* Subtle sacred geometry pattern overlay for mobile */}
      <div className="absolute inset-0 opacity-10 sm:opacity-20">
        <div className="sacred-pattern w-full h-full"></div>
      </div>
      
      {/* Reduced floating mystical elements for mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full animate-twinkle-star"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-twinkle-star" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-brand-accent/60 rounded-full animate-twinkle-star" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Mobile-optimized content */}
      <div className="relative z-10 p-4 sm:p-8 text-center">
        <div className="mb-3 sm:mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-full mb-3 sm:mb-4 shadow-elevated touch-target">
            <Icon name="star" size={24} className="text-brand-primary sm:w-8 sm:h-8" />
          </div>
        </div>
        
        <Text className="text-xs font-medium text-white/80 mb-2 uppercase tracking-wider">
          신성한 카드의 배치
        </Text>
        <Text className="text-xl font-bold text-white mb-2">
          타로 스프레드 선택
        </Text>
        <Text className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto px-2">
          당신의 질문에 맞는 신성한 스프레드를 선택하세요
        </Text>
        
        {/* Mobile-optimized decorative line */}
        <div className="flex justify-center mt-3 sm:mt-4">
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile-Optimized Spread Card Component
 */
function SpreadCard({ 
  spread, 
  isSelected, 
  onSelect 
}: { 
  spread: ExtendedSpreadType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onSelect}
      className="mobile-card cursor-pointer group relative touch-target"
    >
      {/* Mobile-optimized selection glow effect */}
      {isSelected && (
        <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-brand-accent/30 to-brand-primary/30 rounded-xl blur-lg opacity-60 sm:opacity-75"></div>
      )}
      
      {/* Mobile-optimized glass morphism background */}
      <div className={`
        relative h-[140px] rounded-xl overflow-hidden transition-all duration-200
        ${isSelected 
          ? 'transform scale-105 shadow-lg border-2 border-premium-gold/50' 
          : 'active:transform active:scale-102 border border-white/20'
        }
        group-active:border-premium-gold/30
      `}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-brand-primary/20 opacity-20"></div>
        
        {/* Mobile-optimized glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm"></div>
        
        {/* Mobile-optimized content */}
        <div className="relative z-10 p-3 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-premium-gold to-yellow-500 shadow-sm">
                <Icon name="star" size={14} className="text-midnight-blue" />
              </div>
              
              {spread.isPremium && (
                <Badge className="text-xs font-bold bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-0">
                  프리미엄
                </Badge>
              )}
            </div>
            
            <div>
              <Text className="font-bold text-sm text-white mb-1 leading-tight">
                {spread.nameKr}
              </Text>
              <Text className="text-xs text-white/70 leading-relaxed line-clamp-2">
                {spread.descriptionKr?.length > 30 ? spread.descriptionKr.substring(0, 30) + '...' : spread.descriptionKr}
              </Text>
            </div>
          </div>
          
          {/* Footer */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon name="star" size={10} className="text-premium-gold" />
                <Text className="text-xs font-medium text-premium-gold">
                  {spread.positions.length}장
                </Text>
              </div>
              
              <Badge className="text-xs font-medium bg-premium-gold/20 text-premium-gold border border-premium-gold/30">
                {spread.difficulty === 'beginner' ? '초급' :
                 spread.difficulty === 'intermediate' ? '중급' :
                 spread.difficulty === 'advanced' ? '고급' : '전문가'}
              </Badge>
            </div>
            
            {isSelected && (
              <div className="flex items-center gap-1">
                <Icon name="check" size={12} className="text-premium-gold" />
                <Text className="text-xs text-premium-gold font-medium">
                  선택됨
                </Text>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile-optimized hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
      </div>
    </div>
  );
}

/**
 * Main Mobile-Optimized Spread Screen Component
 */
export function SpreadScreen({ 
  onBack, 
  className = '', 
  style = {} 
}: SpreadScreenProps) {
  const { language } = useLanguage();
  
  // State management
  const [currentView, setCurrentView] = useState<'selection' | 'spread'>('selection');
  const [selectedSpread, setSelectedSpread] = useState<ExtendedSpreadType | null>(null);

  // Spread selection handler
  const handleSpreadSelect = useCallback((spread: ExtendedSpreadType) => {
    setSelectedSpread(spread);
    setCurrentView('spread');
  }, []);

  // Back handler
  const handleBack = useCallback(() => {
    if (currentView === 'spread') {
      setCurrentView('selection');
      setSelectedSpread(null);
    } else if (onBack) {
      onBack();
    }
  }, [currentView, onBack]);

  return (
    <div className={`min-h-screen relative mobile-optimized ${className}`} style={style}>
      <div className="h-full overflow-auto pb-20 custom-scrollbar">
        
        {currentView === 'selection' ? (
          <>
            {/* Mobile-Optimized Header */}
            <SpreadHeader />

            {/* Mobile-Optimized Spread Selection */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {TAROT_SPREADS.map((spread) => (
                  <SpreadCard
                    key={spread.id}
                    spread={spread}
                    isSelected={selectedSpread?.id === spread.id}
                    onSelect={() => handleSpreadSelect(spread)}
                  />
                ))}
              </div>
              
              {/* Mobile-optimized continue button */}
              <div className="px-4 mt-2">
                <Button
                  onClick={() => selectedSpread && setCurrentView('spread')}
                  disabled={!selectedSpread}
                  className={`
                    mobile-button w-full h-12 font-bold transition-all duration-200 touch-target rounded-xl
                    ${selectedSpread
                      ? 'bg-gradient-to-r from-premium-gold to-yellow-500 hover:from-yellow-500 hover:to-premium-gold text-midnight-blue shadow-lg'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }
                  `}
                >
                  <Icon name="star" className="mr-2 h-4 w-4" />
                  {selectedSpread 
                    ? `${selectedSpread.nameKr} 시작하기`
                    : '스프레드를 선택하세요'
                  }
                </Button>
              </div>
            </div>
          </>
        ) : selectedSpread ? (
          <>
            {/* Use the new SpreadDetail component */}
            <SpreadDetail
              spread={selectedSpread}
              onBack={handleBack}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}