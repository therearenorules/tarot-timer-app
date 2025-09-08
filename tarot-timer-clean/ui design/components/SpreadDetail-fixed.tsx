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
              <style jsx>{`
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
            /* AB선택 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <style jsx>{`
                .ab-grid {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: grid;
                  grid-template-columns: repeat(100, 1fr);
                  grid-template-rows: repeat(100, 1fr);
                }
                
                .ab-card {
                  position: absolute;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  width: min(14vw, 85px);
                  height: calc(min(14vw, 85px) * 1.5);
                }
                
                /* AB선택 위치 */
                .ab-1 { left: 25%; top: 25%; transform: translate(-50%, -50%); }
                .ab-2 { left: 25%; top: 50%; transform: translate(-50%, -50%); }
                .ab-3 { left: 25%; top: 75%; transform: translate(-50%, -50%); }
                .ab-4 { left: 50%; top: 50%; transform: translate(-50%, -50%); }
                .ab-5 { left: 75%; top: 25%; transform: translate(-50%, -50%); }
                .ab-6 { left: 75%; top: 50%; transform: translate(-50%, -50%); }
                .ab-7 { left: 75%; top: 75%; transform: translate(-50%, -50%); }
                
                .ab-label {
                  position: absolute;
                  top: -25px;
                  left: 50%;
                  transform: translateX(-50%);
                  font-size: 16px;
                  font-weight: bold;
                  color: #d4af37;
                  z-index: 10;
                }
                
                /* A/B 구분 영역 */
                .ab-grid::before,
                .ab-grid::after {
                  content: '';
                  position: absolute;
                  width: 20%;
                  height: 70%;
                  border: 1px dashed rgba(212, 175, 55, 0.2);
                  border-radius: 12px;
                  background: rgba(212, 175, 55, 0.05);
                  pointer-events: none;
                  top: 15%;
                }
                
                .ab-grid::before {
                  left: 15%;
                }
                
                .ab-grid::after {
                  right: 15%;
                }
              `}</style>
              
              <div className="ab-grid">
                {currentReading.map((position, index) => {
                  const abGroups = ['A', 'A', 'A', '', 'B', 'B', 'B'];
                  
                  return (
                    <div 
                      key={position.id}
                      className={`ab-card ab-${index + 1}`}
                      onClick={() => handleCardClick(position, index)}
                    >
                      {/* A/B 라벨 */}
                      {abGroups[index] && (
                        <div className="ab-label">{abGroups[index]}</div>
                      )}
                      
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
                            <div className="absolute top-2 right-2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                              <Eye className="h-3 w-3 text-white" />
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
                    </div>
                  );
                })}
              </div>
              
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                </div>
              </div>
            </div>
          ) : spread.id === 'love' ? (
            /* 컵 오브 릴레이션십 스프레드 */
            <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
              <style jsx>{`
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
                
                /* 관계 연결선 가이드 */
                .relationship-grid::before,
                .relationship-grid::after {
                  content: '';
                  position: absolute;
                  pointer-events: none;
                  z-index: 0;
                }
                
                .relationship-grid::before {
                  left: 25%;
                  top: 25%;
                  width: 50%;
                  height: 55%;
                  border: 1px dashed rgba(212, 175, 55, 0.1);
                  border-radius: 15px;
                }
                
                .relationship-grid::after {
                  left: 50%;
                  top: 25%;
                  width: 1px;
                  height: 55%;
                  background: linear-gradient(to bottom, 
                    rgba(212, 175, 55, 0.3) 0%,
                    rgba(212, 175, 55, 0.15) 40%,
                    rgba(212, 175, 55, 0.25) 50%,
                    rgba(212, 175, 55, 0.15) 60%,
                    rgba(212, 175, 55, 0.3) 100%);
                  transform: translateX(-50%);
                }
              `}</style>
              
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
                    <div className="rel-label">
                      {spread.positionsKr[index]}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-premium-gold/30 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                  <span className="text-sm text-premium-gold font-medium">
                    {currentReading.filter(p => p.card).length} / {currentReading.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* 기본 스프레드 (3카드, 4카드, 5카드 등) */
            <div className="w-full h-full p-4 flex items-center justify-center">
              <div className="grid gap-4 max-w-2xl w-full">
                {/* 프로그레스 표시 */}
                <div className="mb-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-premium-gold/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                      <span className="text-sm text-premium-gold font-medium">
                        {currentReading.filter(p => p.card).length} / {currentReading.length}
                      </span>
                    </div>
                    <span className="text-xs text-white/70">
                      {language === 'ko' ? '카드를 탭해서 뽑아보세요' : 'Tap cards to draw'}
                    </span>
                  </div>
                </div>
                
                {/* 카드 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentReading.map((position, index) => (
                    <div
                      key={position.id}
                      className="cursor-pointer group relative"
                      onClick={() => handleCardClick(position, index)}
                    >
                      <div className="aspect-[3/4] relative">
                        <div className={`
                          w-full h-full rounded-lg overflow-hidden transition-all duration-200 border-2
                          ${position.card && position.isRevealed 
                            ? 'border-premium-gold shadow-lg shadow-premium-gold/20' 
                            : 'border-dashed border-premium-gold/50 bg-white/10'
                          }
                          group-hover:scale-105
                        `}>
                          {position.card && position.isRevealed ? (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={position.card.imageUrl}
                                alt={language === 'ko' ? position.card.nameKr : position.card.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
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
                                  <div className="w-6 h-6 rounded-full border border-premium-gold/60 flex items-center justify-center bg-premium-gold/10 mx-auto mb-1">
                                    <span className="text-xs text-premium-gold font-bold">{index + 1}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Position Label */}
                        <div className="absolute -bottom-6 left-0 right-0 text-center">
                          <span className="text-xs text-premium-gold font-medium">
                            {spread.positionsKr[index]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons - Fixed Bottom */}
        <div className="flex-shrink-0 p-4 bg-midnight-blue/50 backdrop-blur-xl border-t border-premium-gold/20">
          <div className="flex gap-3 max-w-lg mx-auto">
            <Button
              onClick={drawAllCards}
              disabled={!hasEmptyCards || isDrawing || isBulkDrawing}
              className="flex-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold hover:from-yellow-500 hover:to-premium-gold disabled:opacity-50"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {language === 'ko' ? '모든 카드 뽑기' : 'Draw All Cards'}
            </Button>
            
            <Button
              onClick={saveReading}
              disabled={!allCardsDrawn}
              variant="outline"
              className="flex-1 border-premium-gold/50 text-premium-gold hover:bg-premium-gold/20 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === 'ko' ? '리딩 저장' : 'Save Reading'}
            </Button>
            
            <Button
              onClick={resetSpread}
              variant="outline"
              className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCardModal && (
        <Dialog open={!!selectedCardModal} onOpenChange={() => setSelectedCardModal(null)}>
          <DialogContent className="max-w-sm mx-auto bg-gradient-to-br from-midnight-blue to-deep-purple border border-premium-gold/30">
            <div className="text-center space-y-4">
              <div className="relative w-40 h-60 mx-auto">
                <ImageWithFallback
                  src={selectedCardModal.card.imageUrl}
                  alt={language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                  className="w-full h-full object-cover rounded-lg border-2 border-premium-gold/50"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                </h3>
                <p className="text-sm text-premium-gold font-medium">
                  {selectedCardModal.position.nameKr}
                </p>
                {selectedCardModal.card.meaningKr && (
                  <p className="text-sm text-white/80 italic mt-3 leading-relaxed">
                    "{selectedCardModal.card.meaningKr}"
                  </p>
                )}
              </div>
              
              <Button
                onClick={() => setSelectedCardModal(null)}
                className="w-full bg-premium-gold text-midnight-blue font-bold"
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}