import React, { useState } from 'react';
import { useLanguage } from '../utils/language';
import { TarotCard, SpreadType, FULL_TAROT_DECK } from '../utils/tarot-data';

// Import icons
import {
  ChevronLeft,
  Zap,
  Sparkles,
  RotateCcw,
  Save,
  Crown,
  Star,
  BookOpen
} from './mystical-ui/icons';

// Import UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Textarea,
  ImageWithFallback
} from './mystical-ui/components';

interface SpreadDetailProps {
  spread: SpreadType;
  onBack: () => void;
}

export default function SpreadDetailScreen({ spread, onBack }: SpreadDetailProps) {
  const { t, language } = useLanguage();
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [notes, setNotes] = useState<{ [position: string]: string }>({});
  const [isComplete, setIsComplete] = useState(false);

  // 카드 뽑기 함수
  const drawCards = () => {
    setIsDrawing(true);
    
    setTimeout(() => {
      const shuffled = [...FULL_TAROT_DECK].sort(() => Math.random() - 0.5);
      const selectedCards = shuffled.slice(0, spread.cardCount);
      setDrawnCards(selectedCards);
      setIsDrawing(false);
      setIsComplete(true);
      setSelectedCardIndex(0); // 첫 번째 카드 자동 선택
    }, 2000);
  };

  // 다시 뽑기 함수
  const redrawCards = () => {
    setIsDrawing(true);
    
    setTimeout(() => {
      const shuffled = [...FULL_TAROT_DECK].sort(() => Math.random() - 0.5);
      const selectedCards = shuffled.slice(0, spread.cardCount);
      setDrawnCards(selectedCards);
      setIsDrawing(false);
      setSelectedCardIndex(0);
      setNotes({});
    }, 2000);
  };

  // 카드 선택 함수
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  // 노트 업데이트 함수
  const handleNoteChange = (value: string) => {
    if (selectedCardIndex !== null) {
      const positionName = spread.positions[selectedCardIndex] || `Position ${selectedCardIndex + 1}`;
      setNotes(prev => ({
        ...prev,
        [positionName]: value
      }));
    }
  };

  // 스프레드 저장 함수
  const saveSpread = () => {
    // 여기서 실제 저장 로직을 구현할 수 있습니다
    alert('Spread saved to your journal!');
  };

  const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;
  const selectedPosition = selectedCardIndex !== null ? spread.positions[selectedCardIndex] : null;
  const selectedPositionKr = selectedCardIndex !== null ? spread.positionsKr[selectedCardIndex] : null;
  const currentNote = selectedCardIndex !== null && selectedPosition ? notes[selectedPosition] || '' : '';

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '500ms'
      }}></div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {language === 'ko' ? spread.nameKr : spread.name}
            </h1>
            <p className="text-white/70 text-sm">
              {language === 'ko' ? spread.name : spread.nameKr}
            </p>
          </div>
          {spread.isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-none">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {/* Spread Description */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
          <CardContent className="p-6">
            <p className="text-white/90 leading-relaxed">
              {language === 'ko' ? spread.descriptionKr : spread.description}
            </p>
          </CardContent>
        </Card>

        {/* Draw Cards Section */}
        {drawnCards.length === 0 && (
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-purple-600/30 blur-xl rounded-2xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Zap className="h-12 w-12 text-yellow-400 animate-pulse" />
                      <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('spreads.beginReading')}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Draw {spread.cardCount} cards for your {language === 'ko' ? spread.nameKr : spread.name} reading
                  </p>
                </div>
                <Button 
                  onClick={drawCards} 
                  disabled={isDrawing}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl disabled:opacity-50"
                >
                  {isDrawing ? (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 animate-spin" />
                      Drawing Cards...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      Draw {spread.cardCount} Cards
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Selected Card Display */}
        {selectedCard && (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-2xl rounded-3xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                {/* Position Info */}
                <div className="text-center space-y-2">
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                    {language === 'ko' ? selectedPositionKr : selectedPosition}
                  </Badge>
                  <p className="text-white/70 text-sm">
                    {language === 'ko' ? selectedPosition : selectedPositionKr}
                  </p>
                </div>

                {/* Card Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-yellow-400/30 blur-xl rounded-2xl"></div>
                    <div className="relative w-48 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/50">
                      <ImageWithFallback
                        src={selectedCard.imageUrl}
                        alt={language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Card overlay info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg drop-shadow-lg">
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
                      <Badge key={index} variant="outline" className="border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
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

        {/* Cards Grid */}
        {drawnCards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Your Spread
              </h2>
              <Button 
                onClick={redrawCards} 
                disabled={isDrawing}
                variant="outline" 
                size="sm"
                className="border-yellow-400/30 text-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10"
              >
                {isDrawing ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                    Redrawing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Redraw
                  </>
                )}
              </Button>
            </div>

            {/* Card Grid - Responsive layout based on card count */}
            <div className={`grid gap-3 ${
              spread.cardCount <= 3 ? 'grid-cols-3' : 
              spread.cardCount <= 4 ? 'grid-cols-2' : 
              'grid-cols-3'
            }`}>
              {drawnCards.map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedCardIndex === index ? 'scale-105 z-10' : 'hover:scale-102'
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="text-center space-y-2">
                    <div className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedCardIndex === index 
                        ? 'ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/30' 
                        : 'shadow-lg hover:shadow-xl'
                    }`}>
                      <ImageWithFallback
                        src={card.imageUrl}
                        alt={language === 'ko' ? card.nameKr : card.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedCardIndex === index && (
                        <div className="absolute inset-0 bg-yellow-400/20"></div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-yellow-400">
                        {language === 'ko' ? spread.positionsKr[index] : spread.positions[index]}
                      </p>
                      <p className="text-xs text-white/60 line-clamp-1">
                        {language === 'ko' ? card.nameKr : card.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {isComplete && selectedCard && (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-yellow-400" />
                  Reading Notes
                  {selectedPosition && (
                    <Badge className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                      {language === 'ko' ? selectedPositionKr : selectedPosition}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`Write your interpretation for ${language === 'ko' ? selectedPositionKr : selectedPosition}...`}
                  value={currentNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="min-h-[120px] resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400/50"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">
                    {currentNote.length}/500 characters
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={saveSpread}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 shadow-2xl shadow-yellow-400/30"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Reading
            </Button>
          </div>
        )}

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}