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
          {/* Spread content here - shortened for brevity */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-premium-gold">
              <p className="text-lg mb-4">{language === 'ko' ? spread.nameKr : spread.name}</p>
              <p className="text-sm opacity-70">
                {language === 'ko' ? '스프레드 내용이 여기에 표시됩니다' : 'Spread content will be displayed here'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Fixed Action Buttons - 네비게이션 바 위에 배치 */}
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-20">
          <div className="bg-gradient-to-t from-midnight-blue/95 via-midnight-blue/90 to-transparent backdrop-blur-xl border-t border-premium-gold/20">
            <div className="container mx-auto max-w-md px-6 py-4">
              <div className="space-y-3">
                {/* 전체 카드 뽑기 버튼 */}
                {hasEmptyCards && (
                  <Button
                    onClick={drawAllCards}
                    disabled={isBulkDrawing}
                    className="w-full bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-2xl shadow-premium-gold/30 py-3 font-bold"
                  >
                    {isBulkDrawing ? (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        {language === 'ko' ? '카드를 뽑는 중...' : 'Drawing Cards...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        {language === 'ko' ? '전체 카드 뽑기' : 'Draw All Cards'}
                      </div>
                    )}
                  </Button>
                )}
                
                {/* 다시뽑기/저장 버튼들 */}
                {allCardsDrawn && (
                  <div className="flex gap-3">
                    <Button
                      onClick={resetSpread}
                      variant="outline"
                      className="flex-1 border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10 py-3 font-medium"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {language === 'ko' ? '다시 뽑기' : 'Redraw'}
                    </Button>
                    <Button
                      onClick={saveReading}
                      className="flex-1 bg-gradient-to-r from-deep-purple to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 py-3 font-medium"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {language === 'ko' ? '스프레드 저장' : 'Save Reading'}
                    </Button>
                  </div>
                )}
              </div>
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
                <h3 className="text-lg font-semibold text-premium-gold mb-2">
                  {language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                </h3>
                <p className="text-sm text-white/60">
                  {language === 'ko' ? selectedCardModal.position.nameKr : selectedCardModal.position.name}
                </p>
              </div>
              
              <div className="relative aspect-[2/3] max-w-xs mx-auto">
                <ImageWithFallback
                  src={selectedCardModal.card.imageUrl}
                  alt={language === 'ko' ? selectedCardModal.card.nameKr : selectedCardModal.card.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-premium-gold mb-1">
                    {language === 'ko' ? '일반적 의미' : 'General Meaning'}
                  </h4>
                  <p className="text-sm text-white/80">
                    {language === 'ko' ? selectedCardModal.card.meaningKr : selectedCardModal.card.meaning}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-premium-gold mb-1">
                    {language === 'ko' ? '키워드' : 'Keywords'}
                  </h4>
                  <p className="text-sm text-white/80">
                    {language === 'ko' ? selectedCardModal.card.keywordsKr.join(', ') : selectedCardModal.card.keywords.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}