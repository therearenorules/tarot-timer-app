import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../utils/language';
import { Layout, Crown, ChevronLeft, Calendar, Clock } from './ui/icons';
import { tokens } from '../utils/webStyles';
import { 
  CelticCrossGuidelines,
  ABChoiceGuidelines, 
  RelationshipGuidelines,
  FiveCardVGuidelines,
  FourCardGuidelines,
  ThreeCardGuidelines,
  ProgressIndicator,
  CardContainer,
  CardLabel,
  CardOverlay,
  ZoomIcon
} from './GuidelineComponents';

interface SavedCard {
  id: string;
  nameKr: string;
  name: string;
  imageUrl: string;
  position: string;
  positionKr: string;
  isRevealed: boolean;
}

interface SavedSpread {
  id: string;
  spreadType: string;
  title: string;
  spreadName: string;
  spreadNameKr: string;
  date: string;
  cards: SavedCard[];
  notes?: string;
  savedAt: string;
}

interface SavedSpreadViewerProps {
  spread: SavedSpread;
  onBack: () => void;
}

export function SavedSpreadViewer({ spread, onBack }: SavedSpreadViewerProps) {
  const { language } = useLanguage();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'ko') {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="h-full bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-12 left-8 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-16 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        
        {/* React Native 호환 헤더 */}
        <div 
          className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-premium-gold/20"
          style={{
            backgroundColor: '#1A1F3A99', // midnight-blue with 60% opacity
          }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex-shrink-0 border-premium-gold/30 text-premium-gold bg-premium-gold/10 hover:bg-premium-gold/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Layout className="h-5 w-5 text-premium-gold" />
              {spread.title}
            </h1>
          </div>
          <div className="w-12 flex-shrink-0" />
        </div>
        
        {/* React Native 호환 스프레드 정보 */}
        <div 
          className="flex-shrink-0 px-4 py-3 border-b border-premium-gold/10"
          style={{
            background: 'linear-gradient(to right, #1A1F3A80, #1A1F3A66, #1A1F3A80)',
          }}
        >
          <div className="max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-premium-gold">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(spread.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="h-4 w-4" />
                <span>{formatTime(spread.savedAt)}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm">
                {language === 'ko' ? spread.spreadNameKr : spread.spreadName}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Spread Area */}
        <div className="flex-1 relative overflow-hidden">
          {spread.spreadType === 'celtic-cross' ? (
            /* React Native 호환 켈틱크로스 레이아웃 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <CelticCrossGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-lg" style={{ aspectRatio: '4/3' }}>
                  {spread.cards.slice(0, 10).map((card, index) => {
                    const cardPositions = [
                      { left: '42%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-1
                      { left: '42%', top: '45%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 2 }, // pos-2
                      { left: '42%', top: '65%', transform: 'translate(-50%, -50%)' },       // pos-3
                      { left: '20%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-4
                      { left: '42%', top: '25%', transform: 'translate(-50%, -50%)' },       // pos-5
                      { left: '64%', top: '45%', transform: 'translate(-50%, -50%)' },       // pos-6
                      { left: '82%', top: '75%', transform: 'translate(-50%, -50%)' },       // pos-7
                      { left: '82%', top: '55%', transform: 'translate(-50%, -50%)' },       // pos-8
                      { left: '82%', top: '35%', transform: 'translate(-50%, -50%)' },       // pos-9
                      { left: '82%', top: '15%', transform: 'translate(-50%, -50%)' },       // pos-10
                    ];
                    
                    const position = cardPositions[index] || cardPositions[0];
                    
                    return (
                      <div
                        key={card.id}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: position.left,
                          top: position.top,
                          transform: position.transform,
                          width: '60px',
                          height: '90px',
                          zIndex: position.zIndex || 1
                        }}
                      >
                        <CardContainer isRevealed={card.isRevealed}>
                          {card.isRevealed && (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={card.imageUrl}
                                alt={language === 'ko' ? card.nameKr : card.name}
                                className="w-full h-full object-cover"
                              />
                              <CardOverlay />
                              <ZoomIcon />
                            </div>
                          )}
                        </CardContainer>
                        
                        <CardLabel 
                          text={language === 'ko' ? card.positionKr : card.position}
                          rotate={index === 1 ? -90 : 0} // pos-2는 90도 회전
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
              />
            </div>
          ) : spread.spreadType === 'career' ? (
            /* React Native 호환 AB선택 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <ABChoiceGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-2xl" style={{ minHeight: '400px' }}>
                  {spread.cards.slice(0, 7).map((card, index) => {
                    const cardPositions = [
                      { left: '25%', top: '25%', transform: 'translate(-50%, -50%)', group: 'A' },
                      { left: '25%', top: '50%', transform: 'translate(-50%, -50%)', group: 'A' },
                      { left: '25%', top: '75%', transform: 'translate(-50%, -50%)', group: 'A' },
                      { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', group: '' },
                      { left: '75%', top: '25%', transform: 'translate(-50%, -50%)', group: 'B' },
                      { left: '75%', top: '50%', transform: 'translate(-50%, -50%)', group: 'B' },
                      { left: '75%', top: '75%', transform: 'translate(-50%, -50%)', group: 'B' },
                    ];
                    
                    const position = cardPositions[index] || cardPositions[0];
                    
                    return (
                      <div
                        key={card.id}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: position.left,
                          top: position.top,
                          transform: position.transform,
                          width: '65px',
                          height: '97px'
                        }}
                      >
                        {/* A/B 그룹 라벨 */}
                        {position.group && (
                          <div className="text-lg font-bold text-premium-gold mb-4">
                            {position.group}
                          </div>
                        )}
                        
                        <CardContainer isRevealed={card.isRevealed}>
                          {card.isRevealed && (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={card.imageUrl}
                                alt={language === 'ko' ? card.nameKr : card.name}
                                className="w-full h-full object-cover"
                              />
                              <CardOverlay />
                              <ZoomIcon />
                            </div>
                          )}
                        </CardContainer>
                        
                        <CardLabel 
                          text={language === 'ko' ? card.positionKr : card.position}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
                label="AB Choice"
              />
            </div>
          ) : spread.spreadType === 'love' ? (
            /* React Native 호환 컵 오브 릴레이션십 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <RelationshipGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-sm" style={{ minHeight: '450px' }}>
                  {spread.cards.slice(0, 11).map((card, index) => {
                    const cardPositions = [
                      { left: '30%', top: '80%', transform: 'translate(-50%, -50%)' }, // rel-1
                      { left: '70%', top: '80%', transform: 'translate(-50%, -50%)' }, // rel-2
                      { left: '50%', top: '80%', transform: 'translate(-50%, -50%)' }, // rel-3
                      { left: '50%', top: '65%', transform: 'translate(-50%, -50%)' }, // rel-4
                      { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }, // rel-5
                      { left: '70%', top: '55%', transform: 'translate(-50%, -50%)' }, // rel-6
                      { left: '35%', top: '40%', transform: 'translate(-50%, -50%)' }, // rel-7
                      { left: '65%', top: '40%', transform: 'translate(-50%, -50%)' }, // rel-8
                      { left: '25%', top: '25%', transform: 'translate(-50%, -50%)' }, // rel-9
                      { left: '75%', top: '25%', transform: 'translate(-50%, -50%)' }, // rel-10
                      { left: '50%', top: '25%', transform: 'translate(-50%, -50%)' }, // rel-11
                    ];
                    
                    const position = cardPositions[index] || cardPositions[0];
                    
                    return (
                      <div
                        key={card.id}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: position.left,
                          top: position.top,
                          transform: position.transform,
                          width: '50px',
                          height: '75px'
                        }}
                      >
                        <CardContainer isRevealed={card.isRevealed}>
                          {card.isRevealed && (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={card.imageUrl}
                                alt={language === 'ko' ? card.nameKr : card.name}
                                className="w-full h-full object-cover"
                              />
                              <CardOverlay />
                              <ZoomIcon />
                            </div>
                          )}
                        </CardContainer>
                        
                        <CardLabel 
                          text={language === 'ko' ? card.positionKr : card.position}
                          className="text-xs max-w-16"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
                label="Relationship"
              />
            </div>
          ) : spread.spreadType === 'five-card' ? (
            /* React Native 호환 5카드 V자 형태 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <FiveCardVGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-8 max-w-md w-full" style={{ minHeight: '350px' }}>
                  {/* 첫 번째 행: 2장 */}
                  <div className="flex items-center justify-between w-full max-w-xs">
                    {[3, 4].map((cardIndex) => {
                      const card = spread.cards[cardIndex];
                      if (!card) return null;
                      
                      return (
                        <div key={card.id} className="flex flex-col items-center space-y-2">
                          <div style={{ width: '70px', height: '105px' }}>
                            <CardContainer isRevealed={card.isRevealed}>
                              {card.isRevealed && (
                                <div className="relative w-full h-full">
                                  <ImageWithFallback
                                    src={card.imageUrl}
                                    alt={language === 'ko' ? card.nameKr : card.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <CardOverlay />
                                  <ZoomIcon />
                                </div>
                              )}
                            </CardContainer>
                          </div>
                          
                          <CardLabel 
                            text={language === 'ko' ? card.positionKr : card.position}
                            className="text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* 두 번째 행: 2장 */}
                  <div className="flex items-center justify-center gap-12">
                    {[1, 2].map((cardIndex) => {
                      const card = spread.cards[cardIndex];
                      if (!card) return null;
                      
                      return (
                        <div key={card.id} className="flex flex-col items-center space-y-2">
                          <div style={{ width: '70px', height: '105px' }}>
                            <CardContainer isRevealed={card.isRevealed}>
                              {card.isRevealed && (
                                <div className="relative w-full h-full">
                                  <ImageWithFallback
                                    src={card.imageUrl}
                                    alt={language === 'ko' ? card.nameKr : card.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <CardOverlay />
                                  <ZoomIcon />
                                </div>
                              )}
                            </CardContainer>
                          </div>
                          
                          <CardLabel 
                            text={language === 'ko' ? card.positionKr : card.position}
                            className="text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* 세 번째 행: 1장 (중앙) */}
                  {spread.cards[0] && (
                    <div className="flex flex-col items-center space-y-2">
                      <div style={{ width: '70px', height: '105px' }}>
                        <CardContainer isRevealed={spread.cards[0].isRevealed}>
                          {spread.cards[0].isRevealed && (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={spread.cards[0].imageUrl}
                                alt={language === 'ko' ? spread.cards[0].nameKr : spread.cards[0].name}
                                className="w-full h-full object-cover"
                              />
                              <CardOverlay />
                              <ZoomIcon />
                            </div>
                          )}
                        </CardContainer>
                      </div>
                      
                      <CardLabel 
                        text={language === 'ko' ? spread.cards[0].positionKr : spread.cards[0].position}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
                label="Five Card V"
              />
            </div>
          ) : spread.spreadType === 'four-card' ? (
            /* React Native 호환 4카드 수평 일렬 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <FourCardGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex items-center justify-center gap-4 max-w-lg w-full">
                  {spread.cards.slice(0, 4).map((card, index) => (
                    <div key={card.id} className="flex flex-col items-center space-y-3 flex-1">
                      <div className="w-full max-w-20">
                        <div style={{ aspectRatio: '2/3' }}>
                          <CardContainer isRevealed={card.isRevealed}>
                            {card.isRevealed && (
                              <div className="relative w-full h-full">
                                <ImageWithFallback
                                  src={card.imageUrl}
                                  alt={language === 'ko' ? card.nameKr : card.name}
                                  className="w-full h-full object-cover"
                                />
                                <CardOverlay />
                                <ZoomIcon />
                              </div>
                            )}
                          </CardContainer>
                        </div>
                      </div>
                      
                      <CardLabel 
                        text={language === 'ko' ? card.positionKr : card.position}
                        className="text-xs line-clamp-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
                label="Four Card"
              />
            </div>
          ) : spread.spreadType === 'three-card' ? (
            /* React Native 호환 3카드 가로 일렬 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              {/* 가이드라인 컴포넌트 */}
              <ThreeCardGuidelines />
              
              {/* 카드 컨테이너 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex items-center justify-center gap-6 max-w-md w-full">
                  {spread.cards.slice(0, 3).map((card, index) => (
                    <div key={card.id} className="flex flex-col items-center space-y-3">
                      <div style={{ width: '85px', height: '127px' }}>
                        <CardContainer isRevealed={card.isRevealed}>
                          {card.isRevealed && (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={card.imageUrl}
                                alt={language === 'ko' ? card.nameKr : card.name}
                                className="w-full h-full object-cover"
                              />
                              <CardOverlay />
                              <ZoomIcon />
                            </div>
                          )}
                        </CardContainer>
                      </div>
                      
                      <CardLabel 
                        text={language === 'ko' ? card.positionKr : card.position}
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <ProgressIndicator 
                current={spread.cards.filter(c => c.isRevealed).length}
                total={spread.cards.length}
                label="Three Card"
              />
            </div>
          ) : (
            /* 일반 스프레드들 */
            <div className="flex-1 p-6 bg-gradient-to-br from-deep-purple/20 via-midnight-blue/20 to-deep-purple/20">
              <div className="max-w-4xl mx-auto">
                <div className={`grid gap-6 ${
                  spread.cards.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
                  spread.cards.length <= 4 ? 'grid-cols-2 sm:grid-cols-2' :
                  'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {spread.cards.map((card, index) => (
                    <div key={card.id} className="text-center space-y-3">
                      <div className="w-20 h-32 mx-auto rounded-xl overflow-hidden shadow-2xl ring-2 ring-premium-gold/50">
                        {card.isRevealed && (
                          <div className="relative h-full">
                            <ImageWithFallback
                              src={card.imageUrl}
                              alt={language === 'ko' ? card.nameKr : card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/20 to-transparent" />
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="text-xs font-bold text-white drop-shadow-lg text-center">
                                {language === 'ko' ? card.nameKr : card.name}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-premium-gold">{language === 'ko' ? card.positionKr : card.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 하단 해석 노트 (옵션) */}
        {spread.notes && (
          <div className="flex-shrink-0 p-4 bg-midnight-blue/50 backdrop-blur-xl border-t border-premium-gold/20">
            <div className="max-w-lg mx-auto">
              <h3 className="text-sm font-semibold text-premium-gold mb-2">
                {language === 'ko' ? '해석 노트' : 'Interpretation Notes'}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {spread.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}