import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { generateDailyCards, getCurrentHour, formatHour, formatDate, saveDailyTarot, getTodaysSave, type TarotCard, type DailyTarotSave } from '../utils/tarot';
import { useLanguage } from '../utils/language';
import { Sparkles, Clock, BookOpen, RotateCcw, Star, Save, Zap, Moon, Sun } from './ui/icons';
import { MysticalPulse, GentleGlow, LoadingSpinner, ScaleHover } from './AnimationComponents';
import { Container, Flex, Text, ScrollView } from './ReactNativeComponents';
import { tokens, commonStyles, combineStyles } from '../utils/webStyles';

interface TimerProps {}

export function Timer({}: TimerProps) {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyMemos, setHourlyMemos] = useState<{ [hour: number]: string }>({});
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [dailyCards, setDailyCards] = useState<TarotCard[]>([]);
  const [isDailyTarotSaved, setIsDailyTarotSaved] = useState(false);
  const [showRecordingSection, setShowRecordingSection] = useState(false);
  
  const currentHour = getCurrentHour();
  
  // 컴포넌트 마운트 시 오늘의 카드들과 저장 상태 확인
  useEffect(() => {
    const todaysSave = getTodaysSave();
    if (todaysSave) {
      setDailyCards(todaysSave.hourlyCards);
      setHasDrawnAll24Cards(true);
      setIsDailyTarotSaved(true);
      setShowRecordingSection(true);
      setHourlyMemos(todaysSave.memos || {});
    } else {
      setDailyCards([]);
      setHasDrawnAll24Cards(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(false);
      setHourlyMemos({});
    }
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const currentCard = dailyCards[currentHour] || null;
  
  // 24시간 카드 한번에 뽑기
  const drawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      const newDailyCards = generateDailyCards(currentTime);
      setDailyCards(newDailyCards);
      setHasDrawnAll24Cards(true);
      setIsDrawingAll(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(true);
      setSelectedCardIndex(currentHour);
      setHourlyMemos({});
    }, 2000);
  };
  
  // 다시 뽑기
  const redrawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      const newDailyCards = generateDailyCards(new Date(currentTime.getTime() + Math.random() * 1000));
      setDailyCards(newDailyCards);
      setHasDrawnAll24Cards(true);
      setIsDrawingAll(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(true);
      setSelectedCardIndex(currentHour);
      setHourlyMemos({});
    }, 2000);
  };
  
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };
  
  // 현재 선택된 카드 시간의 메모 업데이트
  const handleMemoChange = (value: string) => {
    const targetHour = selectedCardIndex !== null ? selectedCardIndex : currentHour;
    setHourlyMemos(prev => ({
      ...prev,
      [targetHour]: value
    }));
  };
  
  // 데일리 타로 저장하기
  const saveDailyTarotReading = () => {
    if (!hasDrawnAll24Cards || dailyCards.length === 0) return;
    
    const dailyTarotSave: DailyTarotSave = {
      id: Date.now().toString(),
      date: currentTime.toDateString(),
      hourlyCards: dailyCards,
      memos: hourlyMemos,
      insights: Object.values(hourlyMemos).join('\n') || 'Today\'s 24-hour tarot reading',
      savedAt: new Date().toISOString()
    };
    
    saveDailyTarot(dailyTarotSave);
    setIsDailyTarotSaved(true);
    
    // 성공 메시지
    alert('Daily tarot reading has been saved to your journal!');
  };
  
  const selectedCard = selectedCardIndex !== null ? dailyCards[selectedCardIndex] : currentCard;
  const isCurrentHourSelected = selectedCardIndex === currentHour;
  const currentMemo = hourlyMemos[selectedCardIndex !== null ? selectedCardIndex : currentHour] || '';
  
  // Enhanced time display formatting with mystical styling
  const formatTimeDisplay = (hour: number) => {
    const timeText = formatHour(hour);
    const parts = timeText.split(' ');
    
    if (parts.length >= 2) {
      return (
        <div className="text-center">
          <div className="text-sm text-premium-gold/80 font-medium tracking-wider uppercase">
            {t('timer.currentHour')}
          </div>
          <div className="text-3xl font-bold text-white mt-1">
            {parts[1]} {parts[2]}
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-3xl font-bold text-white">
        {timeText}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-10 left-10 w-2 h-2 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      <div className="absolute top-64 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-3000"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-premium-gold/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Moon className="h-12 w-12 text-premium-gold animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-premium-gold via-white to-premium-gold bg-clip-text text-transparent">
                {t('timer.title')}
              </h1>
              
              <p className="text-white/70 text-sm font-medium tracking-wide">
                {formatDate(currentTime)}
              </p>
              
              {hasDrawnAll24Cards && currentCard && (
                <div className="mt-6">
                  {formatTimeDisplay(selectedCardIndex !== null ? selectedCardIndex : currentHour)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Current Card Display - Enhanced for mystical feel */}
        {hasDrawnAll24Cards && selectedCard && (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur-2xl rounded-3xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                {/* Card Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-premium-gold/30 blur-xl rounded-2xl"></div>
                    <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-premium-gold/50">
                      <ImageWithFallback
                        src={selectedCard.imageUrl}
                        alt={language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Card overlay info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl drop-shadow-lg">
                          {language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        </h3>
                        <p className="text-white/90 text-sm mt-1 drop-shadow">
                          {language === 'ko' ? selectedCard.name : selectedCard.nameKr}
                        </p>
                      </div>
                      
                      {isCurrentHourSelected && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-premium-gold/90 text-midnight-blue border-none shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            {t('timer.now')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="text-center space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex flex-wrap justify-center gap-2">
                    {(language === 'ko' ? selectedCard.keywordsKr : selectedCard.keywords).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-premium-gold/40 text-premium-gold bg-premium-gold/10">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                    {language === 'ko' ? selectedCard.meaningKr : selectedCard.meaning}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 24시간 카드 뽑기 버튼 */}
        {!hasDrawnAll24Cards && (
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-premium-gold/30 to-deep-purple/30 blur-xl rounded-2xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Zap className="h-12 w-12 text-premium-gold animate-pulse" />
                      <div className="absolute inset-0 bg-premium-gold/30 blur-lg rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('timer.revealDestiny')}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {t('timer.cosmicMessage')}
                  </p>
                </div>
                <Button 
                  onClick={drawAll24Cards} 
                  disabled={isDrawingAll}
                  className="w-full bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue font-bold py-4 text-lg hover:from-yellow-500 hover:to-premium-gold transition-all duration-500 shadow-2xl disabled:opacity-50"
                >
                  {isDrawingAll ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner className="w-5 h-5" />
                      {t('timer.drawingCards')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      {t('timer.drawCards')}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 24-Hour Cards Scroll - Enhanced for touch scrolling */}
        {hasDrawnAll24Cards && dailyCards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-premium-gold" />
                {t('timer.energyFlow')}
              </h2>
              <Button 
                onClick={redrawAll24Cards} 
                disabled={isDrawingAll}
                variant="outline" 
                size="sm"
                className="border-premium-gold/30 text-premium-gold bg-premium-gold/5 hover:bg-premium-gold/10"
              >
                {isDrawingAll ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                    {t('timer.reshuffling')}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    {t('timer.redraw')}
                  </>
                )}
              </Button>
            </div>
            
            {/* Enhanced horizontal scroll with touch optimization */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-midnight-blue to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-midnight-blue to-transparent z-10 pointer-events-none"></div>
              
              <div className="overflow-x-auto pb-2 horizontal-scroll">
                <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
                  {dailyCards.map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-500 ${
                        selectedCardIndex === index ? 'scale-110 z-10' : 'hover:scale-105'
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="text-center space-y-2">
                        <div className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedCardIndex === index 
                            ? 'ring-2 ring-premium-gold shadow-2xl shadow-premium-gold/30' 
                            : 'shadow-lg hover:shadow-xl'
                        } ${
                          index === currentHour 
                            ? 'ring-2 ring-white shadow-xl shadow-white/20' 
                            : ''
                        }`}>
                          <ImageWithFallback
                            src={card.imageUrl}
                            alt={language === 'ko' ? card.nameKr : card.name}
                            className="w-full h-full object-cover"
                          />
                          {index === currentHour && (
                            <div className="absolute inset-0 bg-white/10"></div>
                          )}
                          {selectedCardIndex === index && (
                            <div className="absolute inset-0 bg-premium-gold/20"></div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className={`text-xs font-medium ${
                            index === currentHour ? 'text-premium-gold font-bold' : 'text-white/70'
                          }`}>
                            {formatHour(index)}
                          </p>
                          {index === currentHour && (
                            <Badge variant="default" className="text-xs px-2 py-0 bg-premium-gold text-midnight-blue">
                              {t('timer.now')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recording Section - 카드별 메모 시스템 */}
        {showRecordingSection && (
          <div className="space-y-6">
            {/* Card-specific Journal */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-deep-purple/30 to-premium-gold/20 blur-xl rounded-2xl"></div>
              <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-premium-gold" />
                    {t('timer.sacredJournal')}
                    {selectedCardIndex !== null && (
                      <Badge className="text-xs bg-premium-gold/20 text-premium-gold border-premium-gold/30">
                        {formatHour(selectedCardIndex)}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={t('timer.journalPlaceholder')}
                    value={currentMemo}
                    onChange={(e) => handleMemoChange(e.target.value)}
                    className="min-h-[120px] resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-premium-gold/50"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/50">
                      {currentMemo.length}/500 {t('common.characters')}
                    </span>
                    {selectedCardIndex !== null && (
                      <span className="text-premium-gold text-xs">
                        {language === 'ko' ? `${formatHour(selectedCardIndex)} 카드 메모` : `${formatHour(selectedCardIndex)} Card Memo`}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Save Daily Tarot Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold/40 to-yellow-500/40 blur-lg rounded-xl"></div>
              <Button
                onClick={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
                className={`relative w-full py-4 text-lg font-bold transition-all duration-500 ${
                  isDailyTarotSaved 
                    ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30' 
                    : 'bg-gradient-to-r from-premium-gold to-yellow-500 text-midnight-blue hover:from-yellow-500 hover:to-premium-gold shadow-2xl shadow-premium-gold/30'
                }`}
              >
                <Save className="h-5 w-5 mr-2" />
                {isDailyTarotSaved ? t('timer.saved') : t('timer.saveReading')}
              </Button>
            </div>
          </div>
        )}
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('timer.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}