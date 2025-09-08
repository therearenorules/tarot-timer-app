import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DailyTarotSave, formatHour } from '../utils/tarot-data';
import { useLanguage } from '../utils/language';
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  BookOpen, 
  Star,
  Sparkles
} from './mystical-ui/icons';

interface DailyTarotViewerProps {
  dailyTarotSave: DailyTarotSave;
  onBack: () => void;
}

export function DailyTarotViewer({ dailyTarotSave, onBack }: DailyTarotViewerProps) {
  const { t, language } = useLanguage();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  
  const selectedCard = selectedCardIndex !== null ? dailyTarotSave.hourlyCards[selectedCardIndex] : null;
  const currentMemo = selectedCardIndex !== null ? (dailyTarotSave.memos?.[selectedCardIndex] || '') : '';

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  return (
    <div className="h-full bg-gradient-to-br from-midnight-blue via-deep-purple to-midnight-blue relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent animate-pulse"></div>
      <div className="absolute top-12 left-8 w-1 h-1 bg-premium-gold rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-48 left-16 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header */}
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
              <Clock className="h-5 w-5 text-premium-gold" />
              {language === 'ko' ? '데일리 타로' : 'Daily Tarot'}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {new Date(dailyTarotSave.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="w-12 flex-shrink-0" />
        </div>

        <div className="flex-1 overflow-auto scrollbar-none pb-6">
          <div className="container mx-auto px-6 py-6 max-w-md space-y-8">
            
            {/* Selected Card Display */}
            {selectedCard && (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-premium-gold/20 via-transparent to-premium-gold/20 blur-2xl rounded-3xl"></div>
                <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                  <CardContent className="p-6 space-y-6">
                    {/* Time Badge */}
                    <div className="flex justify-center">
                      <Badge className="bg-premium-gold text-midnight-blue border-none shadow-lg text-sm px-4 py-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatHour(selectedCardIndex!)}
                      </Badge>
                    </div>

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

                    {/* Memo Display */}
                    {currentMemo && (
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="h-4 w-4 text-premium-gold" />
                          <span className="text-premium-gold font-medium text-sm">
                            {language === 'ko' ? '메모' : 'Memo'}
                          </span>
                        </div>
                        <p className="text-white/80 leading-relaxed text-sm">
                          {currentMemo}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Initial State - Show Overview */}
            {!selectedCard && (
              <div className="space-y-6">
                {/* Stats Card */}
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-premium-gold/20 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-premium-gold" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {language === 'ko' ? '24시간 타로 리딩' : '24-Hour Tarot Reading'}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {Object.keys(dailyTarotSave.memos || {}).length}개 시간대 메모
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        {language === 'ko' ? '완료' : 'Complete'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights Card */}
                {dailyTarotSave.insights && (
                  <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-premium-gold" />
                        {language === 'ko' ? '오늘의 인사이트' : "Today's Insights"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 leading-relaxed">
                        {dailyTarotSave.insights}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Instructions */}
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/70 text-sm">
                    {language === 'ko' 
                      ? '아래 시간대별 카드를 탭하여 자세한 내용을 확인하세요' 
                      : 'Tap on the hourly cards below to view details'}
                  </p>
                </div>
              </div>
            )}

            {/* 24-Hour Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-premium-gold" />
                  {language === 'ko' ? '시간대별 카드' : 'Hourly Cards'}
                </h2>
                <Badge className="bg-premium-gold/20 text-premium-gold border border-premium-gold/30">
                  {dailyTarotSave.hourlyCards.length}장
                </Badge>
              </div>
              
              {/* Enhanced horizontal scroll with touch optimization */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-current to-transparent z-10 pointer-events-none" style={{
                  background: 'linear-gradient(to right, #1a1f3a, transparent)'
                }}></div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-current to-transparent z-10 pointer-events-none" style={{
                  background: 'linear-gradient(to left, #1a1f3a, transparent)'
                }}></div>
                
                <div className="overflow-x-auto pb-2 scrollbar-none">
                  <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
                    {dailyTarotSave.hourlyCards.map((card, index) => (
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
                              : 'shadow-lg hover:shadow-xl border border-white/20'
                          }`}>
                            <ImageWithFallback
                              src={card.imageUrl}
                              alt={language === 'ko' ? card.nameKr : card.name}
                              className="w-full h-full object-cover"
                            />
                            {selectedCardIndex === index && (
                              <div className="absolute inset-0 bg-premium-gold/20"></div>
                            )}
                            
                            {/* Memo indicator */}
                            {dailyTarotSave.memos?.[index] && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-premium-gold rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className={`text-xs font-medium ${
                              selectedCardIndex === index ? 'text-premium-gold font-bold' : 'text-white/70'
                            }`}>
                              {formatHour(index)}
                            </p>
                            {dailyTarotSave.memos?.[index] && (
                              <div className="flex justify-center">
                                <div className="w-1 h-1 bg-premium-gold rounded-full"></div>
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

            {/* Memos Summary */}
            {Object.keys(dailyTarotSave.memos || {}).length > 0 && (
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-premium-gold" />
                    {language === 'ko' ? '시간대별 메모' : 'Hourly Memos'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(dailyTarotSave.memos || {}).map(([hour, memo]) => (
                    <div key={hour} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-premium-gold/30 text-premium-gold text-xs">
                          {formatHour(parseInt(hour))}
                        </Badge>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {memo}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Mystical Quote */}
            <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-white/80 italic leading-relaxed text-sm">
                {language === 'ko' 
                  ? '"시간은 우리에게 주어진 가장 소중한 선물이며, 각 순간마다 새로운 메시지가 담겨 있습니다."'
                  : '"Time is the most precious gift given to us, and each moment contains a new message."'}
              </p>
            </div>

            {/* Bottom padding */}
            <div className="h-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}