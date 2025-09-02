import React, { useState, useEffect } from 'react';
import { NavigationFlow } from '../composite/NavigationFlow';
import { Card } from '../base/Card';
import { Button } from '../base/Button';
import { Text } from '../base/Text';
import { Badge } from '../base/Badge';
import { Icon } from '../base/Icon';
import { Modal } from '../composite/Modal';
import { generateDailyCards, FULL_TAROT_DECK, TarotCard } from '../../utils/tarot';
import { ImageWithFallback } from '../figma/ImageWithFallback';

/**
 * 📱 Timer Screen Module - Mobile-First Premium Design
 * 
 * 24-hour tarot timer screen optimized for mobile touch interfaces.
 * Enhanced for mobile gestures, touch targets, and responsive layouts.
 * 
 * Features:
 * - Mobile-optimized 24-hour card drawing system
 * - Touch-friendly current card display with time tracking
 * - Swipeable hour strip navigation
 * - Mobile-optimized card detail modal
 * - Touch-enhanced memo system for each card
 * - Mobile-first responsive design with safe areas
 */

interface HourCard {
  hour: number;
  card?: TarotCard;
  memo?: string;
  isRevealed: boolean;
}

interface TimerScreenProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 상단 헤더 컴포넌트
 */
function TimerHeader() {
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    weekday: 'short'
  });

  return (
    <div className="relative overflow-hidden">
      {/* Mobile-optimized pattern overlay */}
      <div className="absolute inset-0 opacity-10 sm:opacity-15">
        <div className="sacred-pattern w-full h-full"></div>
      </div>
      
      {/* Mobile-optimized Content with safe area */}
      <div className="relative z-10 px-4 py-6 sm:px-6 text-center">
        <div className="mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-full mb-3 shadow-lg touch-target">
            <Icon name="star" size={20} className="text-brand-accent" />
          </div>
        </div>
        <Text className="text-xs sm:text-sm font-medium text-white/90 mb-2 overline tracking-wider">
          오늘의 24시간 타로
        </Text>
        <Text className="text-lg sm:text-xl font-semibold text-white mb-1 tracking-wide">
          {dateString}
        </Text>
        <div className="w-10 sm:w-12 h-0.5 bg-brand-accent rounded-full mx-auto mt-3 shadow-lg"></div>
      </div>
    </div>
  );
}

/**
 * Timer Current Card Component - Internal module component
 */
function TimerCurrentCard({ 
  currentHour, 
  hourCard, 
  onCardClick 
}: { 
  currentHour: number;
  hourCard: HourCard | null;
  onCardClick: () => void;
}) {
  
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const ampm = currentHour < 12 ? '오전' : '오후';
  const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
  const hourText = displayHour;

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Mobile-optimized Time Display */}
      <div className="text-center space-y-3 max-w-sm w-full">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-accent/20 to-brand-accent/10 rounded-full border border-brand-accent/30 touch-target">
          <Icon name="clock" size={16} className="text-brand-accent" />
          <Text className="text-sm font-medium text-brand-accent">
            {timeString}
          </Text>
        </div>
        <Text className="text-lg sm:text-xl font-semibold text-white">
          현재 {ampm} {hourText}시 카드
        </Text>
      </div>

      {/* Mobile-optimized Current Card */}
      {hourCard?.isRevealed && hourCard.card ? (
        <div 
          onClick={onCardClick}
          className="mobile-card cursor-pointer group relative touch-target"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-brand-accent/20 to-brand-primary/20 rounded-xl blur opacity-0 group-active:opacity-100 transition duration-200"></div>
          <Card
            size="large"
            content="filled"
            title={hourCard.card.nameKr}
            description={`${ampm} ${hourText}시의 카드`}
            imageUrl={hourCard.card.imageUrl}
            className="relative transition-all duration-200 border-2 border-brand-accent/30 shadow-elevated max-w-[200px] sm:max-w-[220px] bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm"
          />
        </div>
      ) : (
        <div 
          onClick={onCardClick}
          className="mobile-card cursor-pointer group relative touch-target"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 rounded-xl blur opacity-0 group-active:opacity-100 transition duration-200"></div>
          <Card
            size="large"
            state="loading"
            title="카드를 뽑아보세요"
            description={hourCard && !hourCard.isRevealed ? `탭해서 ${ampm} ${hourText}시 카드 뽑기` : `${ampm} ${hourText}시의 운세`}
            className="relative border-2 border-dashed border-brand-accent/50 max-w-[200px] sm:max-w-[220px] hover:border-brand-accent transition-all duration-200 bg-gradient-to-br from-card/60 to-muted/30 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Mobile-optimized Memo Preview */}
      {hourCard?.memo && (
        <div className="bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 p-3 sm:p-4 rounded-xl border border-brand-accent/20 max-w-xs w-full shadow-card backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="edit" size={14} className="text-brand-accent" />
            <Text className="text-xs font-medium text-brand-accent">
              메모
            </Text>
          </div>
          <Text className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {hourCard.memo.length > 80 ? hourCard.memo.substring(0, 80) + '...' : hourCard.memo}
          </Text>
        </div>
      )}

      <Text className="text-xs text-white/60 text-center italic px-4">
        이 시간에 일어난 일을 기록해보세요
      </Text>
    </div>
  );
}

/**
 * Timer Hour Strip Component - Internal module component
 */
function TimerHourStrip({ 
  hourCards, 
  currentHour, 
  onHourClick 
}: { 
  hourCards: HourCard[];
  currentHour: number;
  onHourClick: (hour: number) => void;
}) {

  return (
    <div className="px-3 sm:px-4 pb-6 sm:pb-8">
      <div className="mb-4 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
          <Text className="font-semibold text-base sm:text-lg text-white">
            24시간 타로 타임라인
          </Text>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
        </div>
        <Text className="text-xs sm:text-sm text-white/70 px-4">
          각 시간의 신비로운 메시지를 확인하세요
        </Text>
      </div>
      
      <div className="swipe-container flex gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-none px-2 -webkit-overflow-scrolling-touch">
        {hourCards.map((hourCard) => {
          const isActive = hourCard.hour === currentHour;
          const hasCard = hourCard.isRevealed;
          const hasMemo = !!hourCard.memo;
          
          return (
            <div
              key={hourCard.hour}
              className="swipe-item relative flex-shrink-0 group touch-target"
              onClick={() => onHourClick(hourCard.hour)}
            >
              {/* Mobile-optimized glow effect */}
              {isActive && (
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent/30 to-brand-primary/30 rounded-lg blur-sm opacity-60 sm:opacity-75"></div>
              )}
              
              <div className={`
                mobile-card cursor-pointer transition-all duration-200 relative touch-target
                ${isActive ? 'transform scale-105' : ''}
              `}>
                <Card
                  size="small"
                  content={hasCard ? 'filled' : 'text-only'}
                  title={hasCard ? (hourCard.card?.nameKr || '') : `${hourCard.hour}시`}
                  description={hasCard ? `${hourCard.hour}시` : '미지의 시간'}
                  imageUrl={hasCard ? hourCard.card?.imageUrl : undefined}
                  state={hasCard ? 'default' : 'loading'}
                  className={`
                    w-[90px] sm:w-[110px] relative transition-all duration-200
                    ${hasCard 
                      ? 'border-solid border-brand-accent/40 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm' 
                      : 'border-dashed border-brand-accent/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm'
                    }
                    ${isActive 
                      ? 'border-2 border-brand-accent shadow-elevated' 
                      : 'border border-brand-accent/20 active:border-brand-accent/50'
                    }
                  `}
                />
                
                {/* Mobile-optimized memo indicator */}
                {hasMemo && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-accent rounded-full blur-sm opacity-60"></div>
                      <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-accent rounded-full border border-white shadow-sm"></div>
                    </div>
                  </div>
                )}
                
                {/* Mobile-optimized active indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 sm:w-6 h-0.5 sm:h-1 bg-gradient-to-r from-brand-accent to-brand-primary rounded-full shadow-lg"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Timeline decoration */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full ${
                i === 2 ? 'bg-brand-accent' : 'bg-brand-accent/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Timer Draw Button Component - Internal module component
 */
function TimerDrawButton({ 
  onDraw, 
  hasCards 
}: { 
  onDraw: () => void;
  hasCards: boolean;
}) {
  
  if (hasCards) return null;

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16 space-y-8 sm:space-y-10">
      {/* Mobile-optimized mystical intro section */}
      <div className="text-center space-y-4 sm:space-y-6 max-w-sm">
        <div className="relative inline-block">
          <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-brand-accent/20 to-brand-primary/20 rounded-full blur-xl opacity-50"></div>
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-accent to-brand-primary rounded-full flex items-center justify-center shadow-lg touch-target">
            <Icon name="star" size={24} className="text-white sm:w-8 sm:h-8" />
          </div>
        </div>
        
        <div className="space-y-3">
          <Text className="text-2xl sm:text-3xl font-bold text-white">
            오늘의 24시간 타로
          </Text>
          <Text className="text-base sm:text-lg text-white/80 leading-relaxed px-2">
            하루 24시간의 신비로운 운세를<br />
            타로 카드로 확인해보세요
          </Text>
          <Text className="text-xs sm:text-sm text-brand-accent font-medium">
            {new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long' 
            })}
          </Text>
        </div>
      </div>
      
      {/* Mobile-optimized premium draw button */}
      <div className="relative group w-full max-w-sm px-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-accent rounded-2xl blur opacity-30 group-active:opacity-60 transition duration-200"></div>
        <Button
          onClick={onDraw}
          className="mobile-button relative w-full h-14 px-6 py-3 text-base font-bold bg-gradient-to-r from-premium-gold to-yellow-500 hover:from-yellow-500 hover:to-premium-gold text-midnight-blue shadow-lg border-0 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 whitespace-nowrap"
        >
          <Icon name="star" className="h-5 w-5 flex-shrink-0" />
          <span className="text-center leading-tight">24시간 타로 뽑기</span>
        </Button>
      </div>
      
      <div className="text-center space-y-2 px-4">
        <Text className="text-xs text-white/60 italic">
          매일 자정에 새로운 카드로 리셋됩니다
        </Text>
        <div className="flex items-center justify-center gap-1">
          <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
          <div className="w-1 h-1 bg-brand-accent/60 rounded-full"></div>
          <div className="w-1 h-1 bg-brand-accent/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Card Detail Modal Component - Internal module component
 */
function CardDetailModal({
  isOpen,
  onClose,
  hourCard,
  onMemoSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  hourCard: HourCard | null;
  onMemoSave: (memo: string) => void;
}) {
  
  const [memo, setMemo] = useState(hourCard?.memo || '');

  useEffect(() => {
    setMemo(hourCard?.memo || '');
  }, [hourCard]);

  const handleSave = () => {
    onMemoSave(memo);
    onClose();
  };

  if (!hourCard) return null;

  const ampm = hourCard.hour < 12 ? '오전' : '오후';
  const displayHour = hourCard.hour === 0 ? 12 : hourCard.hour > 12 ? hourCard.hour - 12 : hourCard.hour;
  const hourText = displayHour;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${ampm} ${hourText}시의 신비로운 메시지`}
      subtitle={hourCard.card?.nameKr || ''}
      size="large"
      actions={[
        {
          label: '취소',
          variant: 'ghost',
          onClick: onClose,
        },
        {
          label: '저장',
          variant: 'primary',
          icon: 'save',
          onClick: handleSave,
        },
      ]}
    >
      <div className="flex flex-col space-y-6 sm:space-y-8 p-2">
        {/* Mobile-optimized Card Image with mystical frame */}
        {hourCard.card?.imageUrl && (
          <div className="flex justify-center">
            <div className="relative group">
              {/* Mobile-optimized mystical glow background */}
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-brand-accent/20 via-brand-primary/20 to-brand-accent/20 rounded-2xl blur-xl opacity-60"></div>
              
              {/* Mobile-optimized card frame */}
              <div className="relative p-2 sm:p-3 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-xl border-2 border-brand-accent/30 shadow-elevated">
                <ImageWithFallback
                  src={hourCard.card.imageUrl}
                  alt={hourCard.card.nameKr}
                  className="w-40 h-60 sm:w-52 sm:h-80 object-cover rounded-lg shadow-lg"
                />
                
                {/* Mobile-optimized decorative corners */}
                <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-t-2 border-brand-accent rounded-tl"></div>
                <div className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-t-2 border-brand-accent rounded-tr"></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-b-2 border-brand-accent rounded-bl"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-brand-accent rounded-br"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile-optimized Card Info with mystical styling */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Text className="text-xl sm:text-2xl font-bold text-white">
              {hourCard.card?.nameKr}
            </Text>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
              <Text className="text-sm sm:text-base text-brand-accent font-medium">
                {ampm} {hourText}시의 카드
              </Text>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
            </div>
          </div>
          
          {hourCard.card?.meaningKr && (
            <div className="bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 p-3 sm:p-4 rounded-xl border border-brand-accent/20 backdrop-blur-sm">
              <Text className="text-xs sm:text-sm text-white/90 italic leading-relaxed">
                "{hourCard.card.meaningKr}"
              </Text>
            </div>
          )}
        </div>
        
        {/* Mobile-optimized Memo Section with premium styling */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="edit" size={16} className="text-brand-accent sm:w-5 sm:h-5" />
            <Text className="font-semibold text-base sm:text-lg text-white">
              이 시간의 기록
            </Text>
          </div>
          
          <div className="relative">
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="이 시간에 일어난 특별한 일이나 느낌을 기록해보세요..."
              className="w-full min-h-[120px] sm:min-h-[140px] p-3 sm:p-4 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border-2 border-brand-accent/20 rounded-xl text-sm resize-none sm:resize-vertical focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:border-brand-accent/40 transition-all duration-300 placeholder:text-white/40 text-white touch-target"
              rows={5}
            />
            
            {/* Mobile-optimized decorative writing effect */}
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-30">
              <Icon name="feather" size={14} className="text-brand-accent sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Main Timer Screen Module
 */
export function TimerScreen({ className = '', style = {} }: TimerScreenProps) {
  
  // Timer-specific state management (isolated)
  const [hourCards, setHourCards] = useState<HourCard[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Initialize 24-hour cards
  useEffect(() => {
    const initializeCards = () => {
      const cards: HourCard[] = [];
      for (let hour = 0; hour < 24; hour++) {
        cards.push({
          hour,
          isRevealed: false,
        });
      }
      setHourCards(cards);
    };

    initializeCards();
  }, []);

  // Update current hour every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Check if any cards have been drawn
  const hasCards = hourCards.some(card => card.isRevealed);
  const currentHourCard = hourCards.find(card => card.hour === currentHour) || null;

  // Draw all 24 cards
  const handleDraw24Cards = () => {
    const dailyCards = generateDailyCards();
    
    const newCards = hourCards.map((card, index) => ({
      ...card,
      card: dailyCards[index],
      isRevealed: true,
    }));
    
    setHourCards(newCards);
    
    // Show success toast (would be implemented with toast system)
    console.log('24시간 타로 카드가 생성되었습니다!');
  };

  // Draw single card for specific hour
  const handleDrawSingleCard = (hour: number) => {
    const hourCard = hourCards.find(card => card.hour === hour);
    if (!hourCard || hourCard.isRevealed) return;

    const dailyCards = generateDailyCards();
    const selectedCard = dailyCards[hour];
    
    setHourCards(prev => prev.map(card => 
      card.hour === hour 
        ? { ...card, card: selectedCard, isRevealed: true }
        : card
    ));
    
    console.log(`${hour}시 카드가 뽑혔습니다!`);
  };

  // Handle hour card click
  const handleHourClick = (hour: number) => {
    const hourCard = hourCards.find(card => card.hour === hour);
    if (hourCard?.isRevealed) {
      setSelectedHour(hour);
      setShowCardModal(true);
    } else if (hasCards && hourCard && !hourCard.isRevealed) {
      handleDrawSingleCard(hour);
    }
  };

  // Draw single card for current hour
  const handleDrawCurrentCard = () => {
    if (!currentHourCard || currentHourCard.isRevealed) return;

    const dailyCards = generateDailyCards();
    const currentCard = dailyCards[currentHour];
    
    setHourCards(prev => prev.map(card => 
      card.hour === currentHour 
        ? { ...card, card: currentCard, isRevealed: true }
        : card
    ));
    
    console.log(`${currentHour}시 카드가 뽑혔습니다!`);
  };

  // Handle current card click
  const handleCurrentCardClick = () => {
    if (currentHourCard?.isRevealed) {
      setSelectedHour(currentHour);
      setShowCardModal(true);
    } else if (hasCards && currentHourCard && !currentHourCard.isRevealed) {
      handleDrawCurrentCard();
    } else if (!hasCards) {
      handleDraw24Cards();
    }
  };

  // Save memo for selected card
  const handleMemoSave = (memo: string) => {
    if (selectedHour !== null) {
      setHourCards(prev => prev.map(card => 
        card.hour === selectedHour 
          ? { ...card, memo }
          : card
      ));
    }
  };

  const selectedHourCard = selectedHour !== null 
    ? hourCards.find(card => card.hour === selectedHour) || null
    : null;

  return (
    <div className={`min-h-screen relative mobile-optimized ${className}`} style={style}>
      <div className="h-full overflow-auto custom-scrollbar">
        
        {/* Mobile-optimized 상단 헤더 */}
        <TimerHeader />
        
        {/* Mobile-optimized Draw Button (shown only when no cards) */}
        {!hasCards && (
          <TimerDrawButton 
            onDraw={handleDraw24Cards}
            hasCards={hasCards}
          />
        )}

        {/* Mobile-optimized Current Card Display (shown when cards exist) */}
        {hasCards && (
          <TimerCurrentCard
            currentHour={currentHour}
            hourCard={currentHourCard}
            onCardClick={handleCurrentCardClick}
          />
        )}

        {/* Mobile-optimized Hour Strip with swipe support (shown when cards exist) */}
        {hasCards && (
          <TimerHourStrip
            hourCards={hourCards}
            currentHour={currentHour}
            onHourClick={handleHourClick}
          />
        )}
        
        {/* Bottom safe area padding */}
        <div className="pb-safe-bottom"></div>
      </div>

      {/* Mobile-optimized Card Detail Modal */}
      <CardDetailModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        hourCard={selectedHourCard}
        onMemoSave={handleMemoSave}
      />
    </div>
  );
}