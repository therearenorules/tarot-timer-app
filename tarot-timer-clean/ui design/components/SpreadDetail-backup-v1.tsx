import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getRandomCard, type TarotCard, type SpreadType } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { Layout, Crown, Shuffle, RotateCcw, Save, Sparkles, Star, Zap, ChevronLeft, Check, X, Eye } from './ui/icons';

interface SpreadPosition {
  id: string;
  name: string;
  nameKr: string;
  card: TarotCard | null;
  isRevealed: boolean;
}

interface SpreadDetailProps {
  spread: SpreadType;
  onBack: () => void;
}

export function SpreadDetail({ spread, onBack }: SpreadDetailProps) {
  const { t, language } = useLanguage();
  const [currentReading, setCurrentReading] = useState<SpreadPosition[]>(() => {
    return spread.positions.map((position, index) => ({
      id: `position-${index}`,
      name: position,
      nameKr: spread.positionsKr[index],
      card: null,
      isRevealed: false
    }));
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isBulkDrawing, setIsBulkDrawing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [spreadTitle, setSpreadTitle] = useState(`${language === 'ko' ? spread.nameKr : spread.name} Reading`);
  const [selectedCardModal, setSelectedCardModal] = useState<{ card: TarotCard; position: SpreadPosition } | null>(null);
  
  const drawCard = useCallback((positionIndex: number) => {
    if (currentReading[positionIndex].card) return;
    
    setIsDrawing(true);
    
    setTimeout(() => {
      const newCard = getRandomCard();
      const updatedReading = [...currentReading];
      updatedReading[positionIndex] = {
        ...updatedReading[positionIndex],
        card: newCard,
        isRevealed: true
      };
      setCurrentReading(updatedReading);
      setIsDrawing(false);
    }, 1200);
  }, [currentReading]);
  
  const drawAllCards = useCallback(() => {
    if (isBulkDrawing) return;
    
    setIsBulkDrawing(true);
    
    const emptyPositions = currentReading
      .map((position, index) => ({ position, index }))
      .filter(({ position }) => !position.card);
    
    if (emptyPositions.length === 0) {
      setIsBulkDrawing(false);
      return;
    }
    
    setTimeout(() => {
      const updatedReading = [...currentReading];
      
      emptyPositions.forEach(({ index }) => {
        const newCard = getRandomCard();
        updatedReading[index] = {
          ...updatedReading[index],
          card: newCard,
          isRevealed: true
        };
      });
      
      setCurrentReading(updatedReading);
      setIsBulkDrawing(false);
    }, 1500);
  }, [currentReading, isBulkDrawing]);
  
  const resetSpread = useCallback(() => {
    setIsDrawing(true);
    
    setTimeout(() => {
      const positions: SpreadPosition[] = spread.positions.map((position, index) => ({
        id: `position-${index}`,
        name: position,
        nameKr: spread.positionsKr[index],
        card: getRandomCard(),
        isRevealed: true
      }));
      
      setCurrentReading(positions);
      setIsDrawing(false);
    }, 800);
  }, [spread]);
  
  const saveReading = useCallback(() => {
    if (!currentReading.every(pos => pos.card)) return;
    
    const readingData = {
      title: spreadTitle,
      spreadType: spread.id,
      spreadName: language === 'ko' ? spread.nameKr : spread.name,
      cards: currentReading,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    console.log('Saving reading with title:', readingData);
    
    const message = language === 'ko' 
      ? `"${spreadTitle}" 리딩이 일기장에 저장되었습니다!`
      : `"${spreadTitle}" has been saved to your journal!`;
    alert(message);
  }, [currentReading, spreadTitle, spread, language]);
  
  const handleTitleSave = () => {
    setIsEditingTitle(false);
  };
  
  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setSpreadTitle(`${language === 'ko' ? spread.nameKr : spread.name} Reading`);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleCardClick = (position: SpreadPosition, index: number) => {
    if (!position.card) {
      drawCard(index);
    } else if (position.isRevealed) {
      setSelectedCardModal({ card: position.card, position });
    }
  };
  
  const allCardsDrawn = currentReading.every(pos => pos.card);
  const hasEmptyCards = currentReading.some(pos => !pos.card);
  
  return (
    <div className="h-full bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-12 left-8 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-16 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 flex items-center gap-3 p-4 bg-midnight-blue/50 backdrop-blur-xl border-b border-premium-gold/20">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex-shrink-0 border-premium-gold/30 text-premium-gold bg-premium-gold/10 hover:bg-premium-gold/20 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Layout className="h-5 w-5 text-premium-gold" />
              {language === 'ko' ? spread.nameKr : spread.name}
              {spread.isPremium && (
                <Badge className="gap-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-none text-xs">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
            </h1>
          </div>
          <div className="w-12 flex-shrink-0" />
        </div>
        
        {/* Enhanced Title Input Section */}
        <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-midnight-blue/40 via-midnight-blue/30 to-midnight-blue/40 backdrop-blur-sm border-b border-premium-gold/10">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            {isEditingTitle ? (
              <>
                <div className="flex-1 relative">
                  <Input
                    value={spreadTitle}
                    onChange={(e) => setSpreadTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    placeholder={language === 'ko' ? "리딩 제목을 입력하세요..." : "Enter reading title..."}
                    className="bg-white/10 border-premium-gold/30 text-white placeholder:text-white/60 pr-2 focus:bg-white/15 focus:border-premium-gold/50 transition-all duration-300"
                    autoFocus
                  />
                  <div className="absolute inset-0 bg-premium-gold/5 rounded-md pointer-events-none opacity-50"></div>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleTitleSave} 
                  className="bg-premium-gold/20 text-premium-gold border border-premium-gold/40 hover:bg-premium-gold/30 transition-all duration-300 shadow-lg"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleTitleCancel} 
                  className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 text-center group">
                  <p className="text-premium-gold font-medium truncate group-hover:text-white transition-colors duration-300">
                    {spreadTitle}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {language === 'ko' ? '제목을 편집하려면 별표를 클릭하세요' : 'Click the star to edit title'}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingTitle(true)}
                  className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/20 hover:border-premium-gold/50 hover:scale-105 transition-all duration-300 shadow-lg group"
                >
                  <Star className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Main Spread Area */}
        <div className="flex-1 relative overflow-hidden">
          {spread.id === 'celtic-cross' ? (
            /* 켈틱크로스 CSS Grid 시스템 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <style>{`
                .celtic-grid {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: grid;
                  grid-template-columns: repeat(100, 1fr);
                  grid-template-rows: repeat(100, 1fr);
                  gap: 0;
                }
                
                .celtic-card {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  transform-origin: center;
                }
                
                /* 카드 크기 계산 */
                .celtic-card {
                  width: min(12vw, 70px);
                  height: calc(min(12vw, 70px) * 1.5);
                }
                
                /* 켈틱크로스 정확한 위치 */
                .pos-1 { left: 42%; top: 45%; transform: translate(-50%, -50%); }
                .pos-2 { left: 42%; top: 45%; transform: translate(-50%, -50%) rotate(90deg); z-index: 2; }
                .pos-3 { left: 42%; top: 65%; transform: translate(-50%, -50%); }
                .pos-4 { left: 20%; top: 45%; transform: translate(-50%, -50%); }
                .pos-5 { left: 42%; top: 25%; transform: translate(-50%, -50%); }
                .pos-6 { left: 64%; top: 45%; transform: translate(-50%, -50%); }
                .pos-7 { left: 82%; top: 75%; transform: translate(-50%, -50%); }
                .pos-8 { left: 82%; top: 55%; transform: translate(-50%, -50%); }
                .pos-9 { left: 82%; top: 35%; transform: translate(-50%, -50%); }
                .pos-10 { left: 82%; top: 15%; transform: translate(-50%, -50%); }
                
                .card-inner {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  border: 2px solid rgba(212, 175, 55, 0.3);
                  background: white;
                }
                
                .card-inner.revealed {
                  border-color: #d4af37;
                  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
                }
                
                .card-inner.empty {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border: 2px dashed rgba(212, 175, 55, 0.5);
                }
                
                .card-label {
                  position: absolute;
                  top: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  margin-top: 4px;
                  font-size: 10px;
                  color: #d4af37;
                  text-align: center;
                  white-space: nowrap;
                  max-width: 80px;
                  font-weight: 500;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                
                .pos-2 .card-label {
                  transform: translateX(-50%) rotate(-90deg);
                  transform-origin: center top;
                }
                
                /* 십자가 가이드라인 */
                .celtic-grid::before,
                .celtic-grid::after {
                  content: '';
                  position: absolute;
                  background: rgba(212, 175, 55, 0.1);
                  pointer-events: none;
                  z-index: 0;
                }
                
                .celtic-grid::before {
                  left: 42%;
                  top: 20%;
                  width: 1px;
                  height: 60%;
                  transform: translateX(-50%);
                }
                
                .celtic-grid::after {
                  left: 15%;
                  top: 45%;
                  width: 54%;
                  height: 1px;
                  transform: translateY(-50%);
                }
                
                /* 3카드 스프레드 CSS */
                .three-card-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 20px;
                  height: 100%;
                  max-width: 400px;
                  margin: 0 auto;
                }
                
                .three-card {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                
                .three-card-inner {
                  width: 85px;
                  height: 127px;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  border: 2px solid rgba(212, 175, 55, 0.3);
                  background: white;
                }
                
                .three-card-inner.revealed {
                  border-color: #d4af37;
                  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
                }
                
                .three-card-inner.empty {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border: 2px dashed rgba(212, 175, 55, 0.5);
                }
                
                /* 4카드 스프레드 CSS */
                .four-card-container {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr 1fr;
                  gap: 20px;
                  height: 100%;
                  max-width: 250px;
                  margin: 0 auto;
                  align-items: center;
                  justify-items: center;
                }
                
                .four-card {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                
                .four-card-inner {
                  width: 80px;
                  height: 120px;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  border: 2px solid rgba(212, 175, 55, 0.3);
                  background: white;
                }
                
                .four-card-inner.revealed {
                  border-color: #d4af37;
                  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
                }
                
                .four-card-inner.empty {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border: 2px dashed rgba(212, 175, 55, 0.5);
                }
                
                /* 5카드 스프레드 CSS */
                .five-card-v-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 15px;
                  height: 100%;
                  justify-content: center;
                  max-width: 300px;
                  margin: 0 auto;
                }
                
                .five-card-row {
                  display: flex;
                  justify-content: center;
                  gap: 15px;
                }
                
                .five-card {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                
                .five-card-inner {
                  width: 70px;
                  height: 105px;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  border: 2px solid rgba(212, 175, 55, 0.3);
                  background: white;
                }
                
                .five-card-inner.revealed {
                  border-color: #d4af37;
                  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
                }
                
                .five-card-inner.empty {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border: 2px dashed rgba(212, 175, 55, 0.5);
                }
                
                /* 릴레이션십 스프레드 CSS */
                .relationship-grid {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: grid;
                  grid-template-columns: repeat(100, 1fr);
                  grid-template-rows: repeat(100, 1fr);
                }
                
                .rel-card {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  width: min(11vw, 70px);
                  height: calc(min(11vw, 70px) * 1.5);
                }
                
                /* 컵 오브 릴레이션십 위치 */
                .rel-1 { left: 30%; top: 80%; transform: translate(-50%, -50%); }
                .rel-2 { left: 70%; top: 80%; transform: translate(-50%, -50%); }
                .rel-3 { left: 50%; top: 80%; transform: translate(-50%, -50%); }
                .rel-4 { left: 50%; top: 65%; transform: translate(-50%, -50%); }
                .rel-5 { left: 50%; top: 50%; transform: translate(-50%, -50%); }
                .rel-6 { left: 70%; top: 55%; transform: translate(-50%, -50%); }
                .rel-7 { left: 35%; top: 40%; transform: translate(-50%, -50%); }
                .rel-8 { left: 65%; top: 40%; transform: translate(-50%, -50%); }
                .rel-9 { left: 25%; top: 25%; transform: translate(-50%, -50%); }
                .rel-10 { left: 75%; top: 25%; transform: translate(-50%, -50%); }
                .rel-11 { left: 50%; top: 25%; transform: translate(-50%, -50%); }
                
                .rel-label {
                  position: absolute;
                  top: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  margin-top: 4px;
                  font-size: 9px;
                  color: #d4af37;
                  text-align: center;
                  white-space: nowrap;
                  max-width: 70px;
                  font-weight: 500;
                  line-height: 1.2;
                }
              `}</style>
              
              <div className="celtic-grid">
                {currentReading.map((position, index) => (
                  <div 
                    key={position.id}
                    className={`celtic-card pos-${index + 1}`}
                    onClick={() => handleCardClick(position, index)}
                  >
                    <div className={`card-inner ${
                      position.card && position.isRevealed 
                        ? 'revealed' 
                        : position.card 
                          ? 'face-down' 
                          : 'empty'
                    }`}>
                      {position.card && position.isRevealed ? (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={position.card.imageUrl}
                            alt={language === 'ko' ? position.card.nameKr : position.card.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                          {/* 확대 아이콘 */}
                          <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                            <Eye className="h-2 w-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {(isDrawing || isBulkDrawing) ? (
                            <div className="animate-spin">
                              <Sparkles className="h-4 w-4 text-premium-gold" />
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-5 h-5 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="card-label">
                      {spread.positionsKr[index]}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 프로그레스 표시 */}
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'career' ? (
            /* AB선택 스프레드 - 버튼 너비에 맞게 균등 배치 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                {/* 버튼 너비에 맞는 컨테이너 */}
                <div className="w-full max-w-lg mx-auto px-4">
                  <div className="flex items-center justify-between gap-2">
                    {/* A 그룹 - 3장 */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="text-premium-gold font-bold text-lg mb-2">A</div>
                      <div className="flex flex-col gap-2">
                        {[0, 1, 2].map((cardIndex) => (
                          <div
                            key={currentReading[cardIndex]?.id}
                            className="cursor-pointer group relative transition-all duration-300 hover:scale-105"
                            onClick={() => handleCardClick(currentReading[cardIndex], cardIndex)}
                            style={{ width: '70px' }}
                          >
                            <div className="relative w-full aspect-[2/3]">
                              <div className={`
                                w-full h-full rounded-lg overflow-hidden transition-all duration-300 border-2
                                ${currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed 
                                  ? 'border-premium-gold shadow-2xl shadow-premium-gold/30' 
                                  : 'border-dashed border-premium-gold/60 bg-white/10 backdrop-blur-sm'
                                }
                              `}>
                                {currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed ? (
                                  <div className="relative w-full h-full">
                                    <ImageWithFallback
                                      src={currentReading[cardIndex].card.imageUrl}
                                      alt={language === 'ko' ? currentReading[cardIndex].card.nameKr : currentReading[cardIndex].card.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/15 to-transparent" />
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                      <Eye className="h-2 w-2 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {(isDrawing || isBulkDrawing) ? (
                                      <div className="animate-spin">
                                        <Sparkles className="h-4 w-4 text-premium-gold" />
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="w-5 h-5 rounded-full border-2 border-premium-gold/60 flex items-center justify-center bg-premium-gold/15 mx-auto">
                                          <span className="text-xs text-premium-gold font-bold">{cardIndex + 1}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 중앙 카드 */}
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      <div className="text-premium-gold font-bold text-sm mb-2">
                        {language === 'ko' ? '조언' : 'Advice'}
                      </div>
                      <div
                        className="cursor-pointer group relative transition-all duration-300 hover:scale-105"
                        onClick={() => handleCardClick(currentReading[3], 3)}
                        style={{ width: '70px' }}
                      >
                        <div className="relative w-full aspect-[2/3]">
                          <div className={`
                            w-full h-full rounded-lg overflow-hidden transition-all duration-300 border-2
                            ${currentReading[3]?.card && currentReading[3]?.isRevealed 
                              ? 'border-premium-gold shadow-2xl shadow-premium-gold/30' 
                              : 'border-dashed border-premium-gold/60 bg-white/10 backdrop-blur-sm'
                            }
                          `}>
                            {currentReading[3]?.card && currentReading[3]?.isRevealed ? (
                              <div className="relative w-full h-full">
                                <ImageWithFallback
                                  src={currentReading[3].card.imageUrl}
                                  alt={language === 'ko' ? currentReading[3].card.nameKr : currentReading[3].card.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/15 to-transparent" />
                                <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <Eye className="h-2 w-2 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {(isDrawing || isBulkDrawing) ? (
                                  <div className="animate-spin">
                                    <Sparkles className="h-4 w-4 text-premium-gold" />
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-premium-gold/60 flex items-center justify-center bg-premium-gold/15 mx-auto">
                                      <span className="text-xs text-premium-gold font-bold">4</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* B 그룹 - 3장 */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="text-premium-gold font-bold text-lg mb-2">B</div>
                      <div className="flex flex-col gap-2">
                        {[4, 5, 6].map((cardIndex) => (
                          <div
                            key={currentReading[cardIndex]?.id}
                            className="cursor-pointer group relative transition-all duration-300 hover:scale-105"
                            onClick={() => handleCardClick(currentReading[cardIndex], cardIndex)}
                            style={{ width: '70px' }}
                          >
                            <div className="relative w-full aspect-[2/3]">
                              <div className={`
                                w-full h-full rounded-lg overflow-hidden transition-all duration-300 border-2
                                ${currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed 
                                  ? 'border-premium-gold shadow-2xl shadow-premium-gold/30' 
                                  : 'border-dashed border-premium-gold/60 bg-white/10 backdrop-blur-sm'
                                }
                              `}>
                                {currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed ? (
                                  <div className="relative w-full h-full">
                                    <ImageWithFallback
                                      src={currentReading[cardIndex].card.imageUrl}
                                      alt={language === 'ko' ? currentReading[cardIndex].card.nameKr : currentReading[cardIndex].card.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/15 to-transparent" />
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                      <Eye className="h-2 w-2 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {(isDrawing || isBulkDrawing) ? (
                                      <div className="animate-spin">
                                        <Sparkles className="h-4 w-4 text-premium-gold" />
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="w-5 h-5 rounded-full border-2 border-premium-gold/60 flex items-center justify-center bg-premium-gold/15 mx-auto">
                                          <span className="text-xs text-premium-gold font-bold">{cardIndex + 1}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    {language === 'ko' ? 'AB선택 스프레드' : 'AB Choice Spread'}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'love' ? (
            /* 컵 오브 릴레이션십 스프레드 - 버튼 너비에 맞게 배치 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                {/* 버튼 너비에 맞는 컨테이너 */}
                <div className="w-full max-w-lg mx-auto px-4">
                  <div className="relationship-grid">
                    {currentReading.map((position, index) => (
                      <div 
                        key={position.id}
                        className={`rel-card rel-${index + 1}`}
                        onClick={() => handleCardClick(position, index)}
                      >
                        <div className={`card-inner ${
                          position.card && position.isRevealed 
                            ? 'revealed' 
                            : position.card 
                              ? 'face-down' 
                              : 'empty'
                        }`}>
                          {position.card && position.isRevealed ? (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={position.card.imageUrl}
                                alt={language === 'ko' ? position.card.nameKr : position.card.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                              {/* 확대 아이콘 */}
                              <div className="absolute top-1 right-1 w-3 h-3 bg-black/50 rounded-full flex items-center justify-center">
                                <Eye className="h-1.5 w-1.5 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {(isDrawing || isBulkDrawing) ? (
                                <div className="animate-spin">
                                  <Sparkles className="h-3 w-3 text-premium-gold" />
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="w-4 h-4 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                    <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="rel-label">
                          {spread.positionsKr[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 프로그레스 표시 */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    {language === 'ko' ? '릴레이션십 스프레드' : 'Relationship Spread'}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'three-card' ? (
            /* 3카드 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                <div className="three-card-container">
                  {currentReading.map((position, index) => (
                    <div 
                      key={position.id}
                      className="three-card"
                      onClick={() => handleCardClick(position, index)}
                    >
                      <div className={`three-card-inner ${
                        position.card && position.isRevealed 
                          ? 'revealed' 
                          : position.card 
                            ? 'face-down' 
                            : 'empty'
                      }`}>
                        {position.card && position.isRevealed ? (
                          <div className="relative w-full h-full">
                            <ImageWithFallback
                              src={position.card.imageUrl}
                              alt={language === 'ko' ? position.card.nameKr : position.card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                            <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                              <Eye className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {(isDrawing || isBulkDrawing) ? (
                              <div className="animate-spin">
                                <Sparkles className="h-4 w-4 text-premium-gold" />
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-6 h-6 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                  <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="card-label mt-2">
                        {spread.positionsKr[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    {language === 'ko' ? '3카드 스프레드' : '3-Card Spread'}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'four-card' ? (
            /* 4카드 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                <div className="four-card-container">
                  {currentReading.map((position, index) => (
                    <div 
                      key={position.id}
                      className="four-card"
                      onClick={() => handleCardClick(position, index)}
                    >
                      <div className={`four-card-inner ${
                        position.card && position.isRevealed 
                          ? 'revealed' 
                          : position.card 
                            ? 'face-down' 
                            : 'empty'
                      }`}>
                        {position.card && position.isRevealed ? (
                          <div className="relative w-full h-full">
                            <ImageWithFallback
                              src={position.card.imageUrl}
                              alt={language === 'ko' ? position.card.nameKr : position.card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                            <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                              <Eye className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {(isDrawing || isBulkDrawing) ? (
                              <div className="animate-spin">
                                <Sparkles className="h-4 w-4 text-premium-gold" />
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-5 h-5 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                  <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="card-label mt-2">
                        {spread.positionsKr[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    {language === 'ko' ? '4카드 스프레드' : '4-Card Spread'}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'five-card' ? (
            /* 5카드 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                <div className="five-card-v-container">
                  <div className="five-card-row row-1">
                    {[0, 1].map((cardIndex) => (
                      <div 
                        key={currentReading[cardIndex]?.id}
                        className="five-card"
                        onClick={() => handleCardClick(currentReading[cardIndex], cardIndex)}
                      >
                        <div className={`five-card-inner ${
                          currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed 
                            ? 'revealed' 
                            : currentReading[cardIndex]?.card 
                              ? 'face-down' 
                              : 'empty'
                        }`}>
                          {currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed ? (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={currentReading[cardIndex].card.imageUrl}
                                alt={language === 'ko' ? currentReading[cardIndex].card.nameKr : currentReading[cardIndex].card.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                              <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                                <Eye className="h-2 w-2 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {(isDrawing || isBulkDrawing) ? (
                                <div className="animate-spin">
                                  <Sparkles className="h-4 w-4 text-premium-gold" />
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="w-5 h-5 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                    <span className="text-xs text-premium-gold font-bold">{cardIndex + 1}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="card-label mt-2">
                          {spread.positionsKr[cardIndex]}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="five-card-row row-2">
                    {[2, 3].map((cardIndex) => (
                      <div 
                        key={currentReading[cardIndex]?.id}
                        className="five-card"
                        onClick={() => handleCardClick(currentReading[cardIndex], cardIndex)}
                      >
                        <div className={`five-card-inner ${
                          currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed 
                            ? 'revealed' 
                            : currentReading[cardIndex]?.card 
                              ? 'face-down' 
                              : 'empty'
                        }`}>
                          {currentReading[cardIndex]?.card && currentReading[cardIndex]?.isRevealed ? (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={currentReading[cardIndex].card.imageUrl}
                                alt={language === 'ko' ? currentReading[cardIndex].card.nameKr : currentReading[cardIndex].card.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                              <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                                <Eye className="h-2 w-2 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {(isDrawing || isBulkDrawing) ? (
                                <div className="animate-spin">
                                  <Sparkles className="h-4 w-4 text-premium-gold" />
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="w-5 h-5 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                    <span className="text-xs text-premium-gold font-bold">{cardIndex + 1}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="card-label mt-2">
                          {spread.positionsKr[cardIndex]}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="five-card-row row-3">
                    <div 
                      key={currentReading[4]?.id}
                      className="five-card"
                      onClick={() => handleCardClick(currentReading[4], 4)}
                    >
                      <div className={`five-card-inner ${
                        currentReading[4]?.card && currentReading[4]?.isRevealed 
                          ? 'revealed' 
                          : currentReading[4]?.card 
                            ? 'face-down' 
                            : 'empty'
                      }`}>
                        {currentReading[4]?.card && currentReading[4]?.isRevealed ? (
                          <div className="relative w-full h-full">
                            <ImageWithFallback
                              src={currentReading[4].card.imageUrl}
                              alt={language === 'ko' ? currentReading[4].card.nameKr : currentReading[4].card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-premium-gold/10 to-transparent" />
                            <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                              <Eye className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {(isDrawing || isBulkDrawing) ? (
                              <div className="animate-spin">
                                <Sparkles className="h-4 w-4 text-premium-gold" />
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-5 h-5 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto">
                                  <span className="text-xs text-premium-gold font-bold">5</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="card-label mt-2">
                        {spread.positionsKr[4]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    {language === 'ko' ? '5카드 스프레드' : '5-Card Spread'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* 기본 스프레드 레이아웃 - 간단한 그리드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <div className="flex items-center justify-center h-full">
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {currentReading.slice(0, 9).map((position, index) => (
                    <div 
                      key={position.id}
                      className="cursor-pointer transition-all duration-300 hover:scale-105"
                      onClick={() => handleCardClick(position, index)}
                    >
                      <div className="w-20 h-30 rounded-lg overflow-hidden border-2 border-premium-gold/60 bg-white/10 backdrop-blur-sm shadow-lg">
                        {position.card && position.isRevealed ? (
                          <div className="relative w-full h-full">
                            <ImageWithFallback
                              src={position.card.imageUrl}
                              alt={language === 'ko' ? position.card.nameKr : position.card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">
                              <Eye className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {(isDrawing || isBulkDrawing) ? (
                              <div className="animate-spin">
                                <Sparkles className="h-4 w-4 text-premium-gold" />
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-6 h-6 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10">
                                  <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar - Enhanced floating design with navigation spacing */}
        <div className="flex-shrink-0 bg-midnight-blue/80 backdrop-blur-xl border-t border-premium-gold/20 p-4 pb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent"></div>
          
          <div className="relative z-10 w-full max-w-lg mx-auto">
            {/* Floating Draw All Cards Button */}
            {hasEmptyCards && (
              <div className="transform -translate-y-2 mb-2">
                <Button
                  onClick={drawAllCards}
                  disabled={isBulkDrawing || isDrawing}
                  className="w-full bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold py-4 text-lg rounded-xl shadow-2xl shadow-premium-gold/30 hover:shadow-premium-gold/50 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:scale-100 border-2 border-premium-gold/50"
                >
                  {isBulkDrawing ? (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 animate-spin" />
                      {language === 'ko' ? '운명을 펼치는 중...' : 'Revealing destiny...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      {language === 'ko' ? '전체 카드 뽑기' : 'Draw All Cards'}
                    </div>
                  )}
                </Button>
              </div>
            )}
            
            {/* Action Button Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={resetSpread}
                disabled={isDrawing || isBulkDrawing}
                className="bg-white/10 border-premium-gold/40 text-premium-gold hover:bg-premium-gold/20 hover:border-premium-gold/60 transition-all duration-300 py-3 rounded-xl backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {language === 'ko' ? '다시 뽑기' : 'Shuffle'}
              </Button>
              
              <Button
                onClick={saveReading}
                disabled={!allCardsDrawn}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:from-gray-500 disabled:to-gray-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'ko' ? '스프레드 저장' : 'Save Reading'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {selectedCardModal && (
        <Dialog open={!!selectedCardModal} onOpenChange={() => setSelectedCardModal(null)}>
          <DialogContent className="bg-midnight-blue/95 border-premium-gold/30 text-white max-w-md">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-premium-gold mb-2">
                  {language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  {language === 'ko' ? selectedCardModal.position.nameKr : selectedCardModal.position.name}
                </p>
              </div>
              
              <div className="relative w-full max-w-xs mx-auto">
                <ImageWithFallback
                  src={selectedCardModal.card.imageUrl}
                  alt={language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {(language === 'ko' ? selectedCardModal.card.keywordsKr : selectedCardModal.card.keywords).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="border-premium-gold/40 text-premium-gold bg-premium-gold/10">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-white/90 leading-relaxed text-sm">
                  {language === 'ko' ? selectedCardModal.card.meaningKr : selectedCardModal.card.meaning}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}