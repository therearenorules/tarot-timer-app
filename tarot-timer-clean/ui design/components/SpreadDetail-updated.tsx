import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getRandomCard, type TarotCard, type SpreadType } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { Layout, Crown, RotateCcw, Save, Sparkles, Star, Zap, ChevronLeft, Check, X, Eye, Shuffle } from './mystical-ui/icons';

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
          {/* Placeholder for spread layouts - simplified version for demo */}
          <div className="w-full h-full relative bg-gradient-to-br from-deep-purple via-midnight-blue to-deep-purple p-4">
            {/* Simple grid layout for demonstration */}
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
        </div>

        {/* Bottom Action Bar - Updated with reduced border thickness and elevated Draw All button */}
        <div className="flex-shrink-0 bg-midnight-blue/80 backdrop-blur-xl border-t border-premium-gold/20 p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent"></div>
          
          <div className="relative z-10 w-full max-w-lg mx-auto space-y-3">
            {/* Floating Draw All Cards Button - Moved up by 2% more */}
            {hasEmptyCards && (
              <div className="transform -translate-y-4">
                <Button
                  onClick={drawAllCards}
                  disabled={isBulkDrawing || isDrawing}
                  className="w-full bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold py-4 text-lg rounded-xl shadow-2xl shadow-premium-gold/30 hover:shadow-premium-gold/50 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:scale-100 border border-premium-gold/50"
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
            
            {/* Action Button Grid - Updated with reduced border thickness */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={resetSpread}
                disabled={isDrawing || isBulkDrawing}
                className="bg-white/10 border border-premium-gold/40 text-premium-gold hover:bg-premium-gold/20 hover:border-premium-gold/60 transition-all duration-300 py-3 rounded-xl backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {language === 'ko' ? '다시 뽑기' : 'Shuffle'}
              </Button>
              
              <Button
                onClick={saveReading}
                disabled={!allCardsDrawn}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:from-gray-500 disabled:to-gray-600 border border-green-500/30"
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