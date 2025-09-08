import React, { useState, useCallback } from 'react';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getRandomCard, type TarotCard, type ExtendedSpreadType } from '../../utils/tarot';
import { useLanguage } from '../../utils/language';
import { Layout, Crown, Shuffle, RotateCcw, Save, Sparkles, Star, Zap, ChevronLeft, Check, X, Eye } from '../ui/icons';

interface SpreadPosition {
  id: string;
  name: string;
  nameKr: string;
  card: TarotCard | null;
  isRevealed: boolean;
}

interface SpreadDetailProps {
  spread: ExtendedSpreadType;
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
    }, 800);
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
    }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative mobile-optimized">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-12 left-8 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-16 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Mobile-Optimized Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="mobile-button border-premium-gold/30 text-premium-gold bg-premium-gold/10 hover:bg-premium-gold/20 backdrop-blur-sm touch-target"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent flex items-center gap-2">
              <Layout className="h-4 w-4 text-premium-gold" />
              <span>{language === 'ko' ? spread.nameKr : spread.name}</span>
              {spread.isPremium && (
                <Badge className="gap-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue border-none text-xs">
                  <Crown className="h-2 w-2" />
                  Premium
                </Badge>
              )}
            </h1>
          </div>
          
          <div className="w-12" />
        </div>
        
        {/* Title Section */}
        <div className="flex-shrink-0 px-4 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <>
                <div className="flex-1 relative">
                  <Input
                    value={spreadTitle}
                    onChange={(e) => setSpreadTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    placeholder={language === 'ko' ? "리딩 제목을 입력하세요..." : "Enter reading title..."}
                    className="mobile-button bg-white/10 border-premium-gold/30 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-premium-gold/50"
                    autoFocus
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={handleTitleSave} 
                  className="mobile-button bg-premium-gold/20 text-premium-gold border border-premium-gold/40 hover:bg-premium-gold/30 touch-target"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleTitleCancel} 
                  className="mobile-button border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10 touch-target"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 text-center">
                  <p className="text-premium-gold font-medium truncate text-sm">{spreadTitle}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {language === 'ko' ? '제목을 편집하려면 별표를 클릭하세요' : 'Click the star to edit title'}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingTitle(true)}
                  className="mobile-button border-premium-gold/30 text-premium-gold hover:bg-premium-gold/20 hover:border-premium-gold/50 touch-target"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Main Spread Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Simple Card Grid Layout for Mobile */}
          <div className="w-full h-full p-4">
            {/* Progress Indicator */}
            <div className="mb-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-premium-gold/30">
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
            
            {/* Mobile-Optimized Card Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {currentReading.map((position, index) => (
                <div 
                  key={position.id}
                  className="mobile-card cursor-pointer group relative touch-target"
                  onClick={() => handleCardClick(position, index)}
                >
                  <div className="aspect-[3/4] relative">
                    {/* Card Background */}
                    <div className={`
                      w-full h-full rounded-lg overflow-hidden transition-all duration-200 border-2
                      ${position.card && position.isRevealed 
                        ? 'border-premium-gold shadow-lg shadow-premium-gold/20' 
                        : 'border-dashed border-premium-gold/50 bg-white/10'
                      }
                      group-active:scale-95
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
                    <div className="absolute -bottom-5 left-0 right-0 text-center">
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
        
        {/* Action Buttons */}
        <div className="flex-shrink-0 p-4 bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={drawAllCards}
              disabled={!hasEmptyCards || isDrawing || isBulkDrawing}
              className="mobile-button bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold hover:from-yellow-500 hover:to-premium-gold disabled:opacity-50 touch-target"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {language === 'ko' ? '모든 카드 뽑기' : 'Draw All Cards'}
            </Button>
            
            <Button
              onClick={saveReading}
              disabled={!allCardsDrawn}
              variant="outline"
              className="mobile-button border-premium-gold/50 text-premium-gold hover:bg-premium-gold/20 disabled:opacity-50 touch-target"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === 'ko' ? '리딩 저장' : 'Save Reading'}
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