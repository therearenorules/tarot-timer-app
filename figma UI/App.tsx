import React, { useState, useEffect, createContext, useContext } from 'react';
import { LanguageProvider, useLanguage } from './utils/language';
import { 
  TarotCard, 
  SpreadType, 
  SavedSpread, 
  DailyTarotSave,
  ViewType,
  SPREAD_TYPES,
  generateDailyCards,
  getCurrentHour,
  formatHour,
  formatDate,
  saveDailyTarot,
  loadDailyTarotSaves,
  getTodaysSave
} from './utils/tarot-data';

// Import SpreadDetail component
import { SpreadDetail } from './components/SpreadDetail';
import { DailyTarotViewer } from './components/DailyTarotViewer';
import { SpreadMiniatureForJournal } from './components/SpreadMiniatureForJournal';

// Import icons
import {
  Clock,
  Layout,
  BookOpen,
  Settings as SettingsIcon,
  Moon,
  TarotCards,
  Star,
  Sparkles,
  Zap,
  RotateCcw,
  Save,
  Crown,
  Calendar,
  Sun,
  Globe,
  Volume2,
  Bell,
  Lock,
  Shield,
  HelpCircle
} from './components/mystical-ui/icons';

// Import UI components  
import {
  MysticalCard as Card,
  MysticalButton as Button,
  MysticalInput as Input,
  MysticalSwitch as Switch,
  MysticalProgress,
  MysticalModal,
  MysticalTooltip,
  IconButton,
  ImageWithFallback
} from './components/mystical-ui/components';

// Legacy components for compatibility
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CardHeader: React.FC<CardHeaderProps> = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ className = "", children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent: React.FC<CardContentProps> = ({ className = "", children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Badge: React.FC<BadgeProps> = ({ 
  className = "", 
  variant = "default", 
  children, 
  ...props 
}) => {
  const variantStyles = {
    default: "bg-yellow-400 text-black border-transparent",
    secondary: "bg-gray-800 text-yellow-400 border-yellow-400/30",
    destructive: "bg-red-500 text-white border-transparent", 
    outline: "text-yellow-400 border-yellow-400/30 bg-transparent"
  };
  
  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-yellow-400/20 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// ==========================================
// MAIN COMPONENTS
// ==========================================

// Timer Component
function Timer() {
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
      try {
        const newDailyCards = generateDailyCards(currentTime);
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          console.error('Failed to generate 24 cards, got:', newDailyCards.length);
          alert('카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Error generating daily cards:', error);
        alert('카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };
  
  // 다시 뽑기
  const redrawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(new Date(currentTime.getTime() + Math.random() * 1000));
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          console.error('Failed to generate 24 cards, got:', newDailyCards.length);
          alert('카드를 재생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Error regenerating daily cards:', error);
        alert('카드를 재생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
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
          <div className="overline text-yellow-400/80">
            {t('timer.currentHour')}
          </div>
          <div className="display-large text-white mt-1">
            {parts[0]} {parts[1]}
          </div>
        </div>
      );
    }
    
    return (
      <div className="display-large text-white">
        {timeText}
      </div>
    );
  };
  
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
      <div className="absolute top-64 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{
        animationDelay: '3000ms'
      }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-2">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="display-large bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
                {t('timer.title')}
              </h1>
              
              <p className="body-small text-white/70 tracking-wide">
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
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-2xl rounded-3xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                {/* Card Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-yellow-400/30 blur-xl rounded-2xl"></div>
                    <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/50 animate-mystical-float">
                      <ImageWithFallback
                        src={selectedCard.imageUrl}
                        alt={language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Card overlay info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="title-medium text-white drop-shadow-lg">
                          {language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        </h3>
                        <p className="body-small text-white/90 mt-1 drop-shadow">
                          {language === 'ko' ? selectedCard.name : selectedCard.nameKr}
                        </p>
                      </div>
                      
                      {isCurrentHourSelected && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-400/90 text-black border-none shadow-lg">
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
                      <Badge key={index} variant="outline" className="border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="body-medium text-white/90 leading-relaxed max-w-sm mx-auto">
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
                  <h3 className="title-large text-white">
                    {t('timer.revealDestiny')}
                  </h3>
                  <p className="body-medium text-white/70 leading-relaxed">
                    {t('timer.cosmicMessage')}
                  </p>
                </div>
                <Button 
                  onClick={drawAll24Cards} 
                  disabled={isDrawingAll}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl disabled:opacity-50 animate-mystical-pulse hover:animate-mystical-glow"
                >
                  {isDrawingAll ? (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 animate-spin" />
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
              <h2 className="title-medium text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                {t('timer.energyFlow')}
              </h2>
              <Button 
                onClick={redrawAll24Cards} 
                disabled={isDrawingAll}
                variant="outline" 
                size="sm"
                className="border-yellow-400/30 text-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10"
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
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-current to-transparent z-10 pointer-events-none" style={{
                background: 'linear-gradient(to right, #1a1f3a, transparent)'
              }}></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-current to-transparent z-10 pointer-events-none" style={{
                background: 'linear-gradient(to left, #1a1f3a, transparent)'
              }}></div>
              
              <div className="overflow-x-auto pb-2 scrollbar-none">
                <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
                  {dailyCards.map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-500 hover:animate-mystical-pulse ${
                        selectedCardIndex === index ? 'scale-110 z-10 animate-mystical-glow' : 'hover:scale-105'
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="text-center space-y-2">
                        <div className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedCardIndex === index 
                            ? 'ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/30' 
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
                            <div className="absolute inset-0 bg-yellow-400/20"></div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className={`text-xs font-medium ${
                            index === currentHour ? 'text-yellow-400 font-bold' : 'text-white/70'
                          }`}>
                            {formatHour(index)}
                          </p>
                          {index === currentHour && (
                            <Badge variant="default" className="text-xs px-2 py-0 bg-yellow-400 text-black">
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
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 to-yellow-400/20 blur-xl rounded-2xl"></div>
              <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-yellow-400" />
                    {t('timer.sacredJournal')}
                    {selectedCardIndex !== null && (
                      <Badge className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
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
                    className="min-h-[120px] resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400/50"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/50">
                      {currentMemo.length}/500 {t('common.characters')}
                    </span>
                    {selectedCardIndex !== null && (
                      <span className="text-yellow-400 text-xs">
                        {language === 'ko' ? `${formatHour(selectedCardIndex)} 카드 메모` : `${formatHour(selectedCardIndex)} Card Memo`}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Save Daily Tarot Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/40 to-yellow-500/40 blur-lg rounded-xl"></div>
              <Button
                onClick={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
                className={`relative w-full py-4 text-lg font-bold transition-all duration-500 ${
                  isDailyTarotSaved 
                    ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30 animate-mystical-pulse' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-2xl shadow-yellow-400/30 hover:animate-mystical-glow'
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

// Spreads Component
interface SpreadsProps {
  onSpreadSelect: (spread: SpreadType) => void;
}

function Spreads({ onSpreadSelect }: SpreadsProps) {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-16 left-12 w-1 h-1 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-32 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      <div className="absolute bottom-48 left-20 w-1.5 h-1.5 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '500ms'
      }}></div>
      <div className="absolute top-64 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '3000ms'
      }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Layout className="h-12 w-12 text-yellow-400 animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="display-large bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
                {t('spreads.title')}
              </h1>
              
              <p className="body-small text-white/70 tracking-wide">
                {t('spreads.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Spread Cards */}
        <div className="space-y-6">
          {SPREAD_TYPES.map((spread) => (
            <div key={spread.id} className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Card 
                className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10 hover:scale-[1.02] hover:border-yellow-400/30"
                onClick={() => onSpreadSelect(spread)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Layout className="h-6 w-6 text-yellow-400" />
                          <div className="absolute inset-0 bg-yellow-400/30 blur-sm rounded-full"></div>
                        </div>
                        <h3 className="title-medium text-white group-hover:text-yellow-400 transition-colors">
                          {language === 'ko' ? spread.nameKr : spread.name}
                        </h3>
                        {spread.isPremium && (
                          <div className="relative">
                            <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-none shadow-lg">
                              <Crown className="h-3 w-3" />
                              {t('spreads.premium')}
                            </Badge>
                            <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <p className="body-small text-yellow-400/80 tracking-wide">
                        {language === 'ko' ? spread.name : spread.nameKr}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="body-small text-white/90 leading-relaxed">
                      {language === 'ko' ? spread.descriptionKr : spread.description}
                    </p>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 text-base hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl shadow-yellow-400/20 group-hover:shadow-yellow-400/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpreadSelect(spread);
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {t('spreads.beginReading')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Premium Feature Highlight */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 blur-xl rounded-2xl"></div>
          <Card className="relative bg-white/10 backdrop-blur-lg border border-yellow-400/30 shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Crown className="h-12 w-12 text-yellow-400 animate-mystical-pulse" />
                    <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full"></div>
                  </div>
                </div>
                <h3 className="title-large text-white">
                  {t('spreads.premiumTitle')}
                </h3>
                <p className="body-medium text-white/70 leading-relaxed">
                  {t('spreads.premiumDesc')}
                </p>
              </div>
              <div className="flex justify-center">
                <Badge className="gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2">
                  <Star className="h-4 w-4" />
                  {t('spreads.premiumActive')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('spreads.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

// Journal Component
interface JournalProps {
  onSavedSpreadSelect: (spread: SavedSpread) => void;
  onDailyTarotSelect: (dailyTarot: DailyTarotSave) => void;
}

function Journal({ onSavedSpreadSelect, onDailyTarotSelect }: JournalProps) {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'daily' | 'spreads'>('daily');
  const [dailyTarotSaves, setDailyTarotSaves] = useState<DailyTarotSave[]>([]);
  const [savedSpreads] = useState<SavedSpread[]>([
    // 예시 데이터 - 스프레드 기록들
    {
      id: 'spread-1',
      title: '새로운 직장에 대한 결정',
      spreadType: 'career',
      spreadName: 'AB선택 스프레드',
      date: new Date('2024-01-15').toISOString(),
      cards: [],
      insights: '두 선택지 모두 좋은 기회가 될 것 같습니다. A는 안정성을, B는 도전을 의미합니다.',
      savedAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 'spread-2', 
      title: '연인 관계의 미래',
      spreadType: 'love',
      spreadName: '컵 오브 릴레이션십',
      date: new Date('2024-01-12').toISOString(),
      cards: [],
      insights: '서로에 대한 깊은 이해와 소통이 필요한 시기입니다. 감정적 유대감을 강화하세요.',
      savedAt: new Date('2024-01-12').toISOString()
    },
    {
      id: 'spread-3',
      title: '인생의 전환점',
      spreadType: 'celtic-cross',
      spreadName: '켈틱 크로스',
      date: new Date('2024-01-08').toISOString(),
      cards: [],
      insights: '큰 변화의 시기가 다가오고 있습니다. 과거의 경험을 바탕으로 현명한 결정을 내��세요.',
      savedAt: new Date('2024-01-08').toISOString()
    },
    {
      id: 'spread-4',
      title: '내면의 성장',
      spreadType: 'five-card',
      spreadName: '5카드 스프레드',
      date: new Date('2024-01-05').toISOString(),
      cards: [],
      insights: '자아 발견의 여정이 시작됩니다. 내면의 목소리에 귀를 기울이고 직감을 믿으세요.',
      savedAt: new Date('2024-01-05').toISOString()
    },
    {
      id: 'spread-5',
      title: '현재 상황 점검',
      spreadType: 'four-card',
      spreadName: '4카드 스프레드',
      date: new Date('2024-01-02').toISOString(),
      cards: [],
      insights: '현재 상황을 차분히 분석하고 앞으로 나아갈 방향을 명확히 할 때입니다.',
      savedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 'spread-6',
      title: '과거-현재-미래',
      spreadType: 'three-card',
      spreadName: '3카드 스프레드',
      date: new Date('2023-12-28').toISOString(),
      cards: [],
      insights: '과거의 교훈을 바탕으로 현재를 충실히 살아가면 밝은 미래가 펼쳐질 것입니다.',
      savedAt: new Date('2023-12-28').toISOString()
    }
  ]);
  
  useEffect(() => {
    const saves = loadDailyTarotSaves();
    // 예시 데이터 추가 - 실제 저장된 데이터가 없을 때를 위해
    const mockDailyTarotSaves: DailyTarotSave[] = [
      {
        id: 'daily-1',
        date: new Date('2024-01-15').toDateString(),
        hourlyCards: Array.from({length: 24}, (_, i) => ({
          id: i + 1,
          name: `Card ${i + 1}`,
          nameKr: `카드 ${i + 1}`,
          meaning: 'Sample meaning',
          meaningKr: '예시 의미',
          keywords: ['keyword1', 'keyword2'],
          keywordsKr: ['키워드1', '키워드2'],
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          element: 'Fire',
          suit: 'Major',
          type: 'Major Arcana'
        })),
        memos: {
          9: '아침부터 좋은 에너지를 느꼈습니다.',
          12: '점심시간에 중요한 결정을 내렸어요.',
          18: '저녁에 가족과 좋은 시간을 보냈습니다.',
          22: '하루를 마무리하며 감사한 마음이 듭니다.'
        },
        insights: '오늘은 전반적으로 긍정적인 에너지가 흐르는 하루였습니다. 특히 오후에 좋은 기회가 있을 것 같습니다.',
        savedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 'daily-2',
        date: new Date('2024-01-12').toDateString(),
        hourlyCards: Array.from({length: 24}, (_, i) => ({
          id: i + 25,
          name: `Card ${i + 25}`,
          nameKr: `카드 ${i + 25}`,
          meaning: 'Sample meaning',
          meaningKr: '예시 의미',
          keywords: ['keyword1', 'keyword2'],
          keywordsKr: ['키워드1', '키워드2'],
          imageUrl: 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=400',
          element: 'Water',
          suit: 'Major',
          type: 'Major Arcana'
        })),
        memos: {
          8: '이른 아침부터 명상을 했습니다.',
          14: '오후에 친구와 의미 있는 대화를 나눴어요.',
          20: '저녁에 새로운 취미를 시작했습니다.'
        },
        insights: '변화와 성장의 하루였습니다. 내면의 목소리에 귀를 기울이는 것이 중요합니다.',
        savedAt: new Date('2024-01-12').toISOString()
      },
      {
        id: 'daily-3',
        date: new Date('2024-01-08').toDateString(),
        hourlyCards: Array.from({length: 24}, (_, i) => ({
          id: i + 49,
          name: `Card ${i + 49}`,
          nameKr: `카드 ${i + 49}`,
          meaning: 'Sample meaning',
          meaningKr: '예시 의미',
          keywords: ['keyword1', 'keyword2'],
          keywordsKr: ['키워드1', '키워드2'],
          imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400',
          element: 'Earth',
          suit: 'Major',
          type: 'Major Arcana'
        })),
        memos: {
          10: '아침 운동으로 하루를 시작했습니다.',
          16: '중요한 프로젝트를 완료했어요.',
          21: '밤하늘을 보며 깊은 생각에 잠겼습니다.'
        },
        insights: '실행력과 의지력이 돋보이는 하루였습니다. 목표를 향해 꾸준히 나아가고 있습니다.',
        savedAt: new Date('2024-01-08').toISOString()
      }
    ];
    
    // 실제 저장된 데이터가 있으면 그것을 사용하고, 없으면 예시 데이터 사용
    setDailyTarotSaves(saves.length > 0 ? saves : mockDailyTarotSaves);
  }, []);
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-16 left-12 w-1 h-1 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-32 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <BookOpen className="h-12 w-12 text-yellow-400 animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="display-large bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
                {t('journal.title')}
              </h1>
              
              <p className="body-small text-white/70 tracking-wide">
                {t('journal.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Section Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setActiveSection('daily')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeSection === 'daily' 
                ? 'bg-yellow-400 text-black shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('journal.dailyTarot')}
          </button>
          <button
            onClick={() => setActiveSection('spreads')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeSection === 'spreads' 
                ? 'bg-yellow-400 text-black shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('journal.spreadRecords')}
          </button>
        </div>
        
        {/* Daily Tarot Section */}
        {activeSection === 'daily' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="title-medium text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                {t('journal.dailyReadings')}
              </h2>
              <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                {dailyTarotSaves.length} {t('journal.records')}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {dailyTarotSaves.length === 0 ? (
                <Card className="bg-white/5 border border-white/10">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Star className="h-12 w-12 text-yellow-400/50" />
                        <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="title-small text-white">{t('journal.noReadings')}</h3>
                      <p className="body-small text-white/60 leading-relaxed">
                        {t('journal.noReadingsDesc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                dailyTarotSaves.map((save) => (
                  <Card key={save.id} className="bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 cursor-pointer" onClick={() => onDailyTarotSelect(save)}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-yellow-400" />
                            <span className="body-medium text-white">
                              {new Date(save.date).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                              })}
                            </span>
                          </div>
                          <p className="body-small text-white/70">
                            24시간 타로 리딩
                          </p>
                        </div>
                        <Badge className="text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          {t('journal.saved')}
                        </Badge>
                      </div>
                      
                      {/* 카드 미리보기 */}
                      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                        {save.hourlyCards.slice(0, 8).map((card, index) => (
                          <div key={index} className="flex-shrink-0 w-8 h-12 rounded overflow-hidden border border-yellow-400/30 shadow-lg">
                            <ImageWithFallback
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {save.hourlyCards.length > 8 && (
                          <div className="flex-shrink-0 w-8 h-12 rounded bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-xs text-white/60">+{save.hourlyCards.length - 8}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 인사이트 미리보기 */}
                      {save.insights && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="body-small text-white/80 line-clamp-2 leading-relaxed">
                            {save.insights}
                          </p>
                        </div>
                      )}
                      
                      {/* 메모 카운트 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-yellow-400" />
                          <span className="caption text-yellow-400">
                            {Object.keys(save.memos || {}).length}개 시간대 메모
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDailyTarotSelect(save);
                          }}
                        >
                          {t('journal.view')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Spread Records Section */}
        {activeSection === 'spreads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="title-medium text-white flex items-center gap-2">
                <Layout className="h-5 w-5 text-yellow-400" />
                {t('journal.spreadRecords')}
              </h2>
              <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                {savedSpreads.length} {t('journal.records')}
              </Badge>
            </div>
            
            <div className="space-y-6">
              {savedSpreads.length === 0 ? (
                <Card className="bg-white/5 border border-white/10">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Layout className="h-12 w-12 text-yellow-400/50" />
                        <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="title-small text-white">{t('journal.noSpreads')}</h3>
                      <p className="body-small text-white/60 leading-relaxed">
                        {t('journal.noSpreadsDesc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                savedSpreads.map((spread) => (
                  <Card key={spread.id} className="bg-white/5 border border-white/10 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-500 cursor-pointer group hover:scale-[1.02] transform-gpu" onClick={() => onSavedSpreadSelect(spread)}>
                    <CardContent className="p-5 space-y-4">
                      {/* Header with title and status */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Layout className="h-4 w-4 text-yellow-400" />
                            <span className="body-medium text-white group-hover:text-yellow-400 transition-colors">
                              {spread.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-yellow-400/70" />
                            <span className="body-small text-white/70">
                              {new Date(spread.date).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                              })}
                            </span>
                          </div>
                        </div>
                        <Badge className="text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          {t('journal.saved')}
                        </Badge>
                      </div>

                      {/* Spread Visual Preview */}
                      <div className="relative">
                        <SpreadMiniatureForJournal 
                          spread={spread} 
                          className="group-hover:border-yellow-400/40 transition-colors duration-300"
                        />
                      </div>
                      
                      {/* Spread Type Badge */}
                      <div className="flex items-center justify-center">
                        <Badge className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-3 py-1">
                          {spread.spreadName}
                        </Badge>
                      </div>
                      
                      {/* Insights Preview */}
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-3 w-3 text-yellow-400" />
                          <span className="caption text-yellow-400">
                            {language === 'ko' ? '인사이트' : 'Insights'}
                          </span>
                        </div>
                        <p className="body-small text-white/80 line-clamp-2 leading-relaxed">
                          {spread.insights}
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group-hover:border-yellow-400/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSavedSpreadSelect(spread);
                          }}
                        >
                          <Layout className="h-3 w-3 mr-2" />
                          {t('journal.view')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('journal.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

// Settings Component
function SettingsScreen() {
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-16 left-12 w-1 h-1 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-32 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <SettingsIcon className="h-12 w-12 text-yellow-400 animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="display-large bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
              
              <p className="body-small text-white/70 tracking-wide">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Premium Membership */}
        <Card className="bg-white/5 border border-yellow-400/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-400" />
                <div>
                  <h3 className="title-small text-white">{t('settings.premium')}</h3>
                  <p className="body-small text-white/60">{t('settings.active')}</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                {t('settings.active')}
              </Badge>
            </div>
            
            <div className="space-y-3 pl-9">
              <div className="flex items-center gap-2 body-small text-white/80">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                {t('settings.premiumSpreads')}
              </div>
              <div className="flex items-center gap-2 body-small text-white/80">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                {t('settings.adFree')}
              </div>
              <div className="flex items-center gap-2 body-small text-white/80">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                {t('settings.unlimitedStorage')}
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
            >
              {t('settings.managePremium')}
            </Button>
          </CardContent>
        </Card>
        
        {/* Display & Theme */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="title-small text-white flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-400" />
              {t('settings.displayTheme')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-medium text-white">{t('settings.darkMode')}</p>
                  <p className="body-small text-white/60">Always on for mystical experience</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-medium text-white">{t('settings.language')}</p>
                  <p className="body-small text-white/60">
                    {language === 'ko' ? t('settings.korean') : t('settings.english')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {language === 'ko' ? 'EN' : '한'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="title-small text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              {t('settings.notifications')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-medium text-white">{t('settings.spreadCompletion')}</p>
                  <p className="body-small text-white/60">{t('settings.spreadCompletionDesc')}</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Sound & Haptics */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="title-small text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-yellow-400" />
              {t('settings.soundHaptics')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-medium text-white">{t('settings.soundEffects')}</p>
                  <p className="body-small text-white/60">Mystical sounds and chimes</p>
                </div>
                <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-medium text-white">{t('settings.hapticFeedback')}</p>
                  <p className="body-small text-white/60">{t('settings.hapticFeedbackDesc')}</p>
                </div>
                <Switch checked={hapticFeedback} onCheckedChange={setHapticFeedback} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy & Security */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="title-small text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              {t('settings.privacySecurity')}
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                <Lock className="h-4 w-4 mr-2" />
                {t('settings.privacyPolicy')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                {t('settings.dataManagement')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Support & Info */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="title-small text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-yellow-400" />
              {t('settings.support')}
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('settings.helpFaq')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                <Star className="h-4 w-4 mr-2" />
                {t('settings.supportDev')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Version Info */}
        <div className="text-center space-y-2 py-6">
          <p className="body-small text-white/60">{t('settings.version')}</p>
          <p className="caption text-white/40">{t('settings.copyright')}</p>
        </div>
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('settings.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('tabs');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [selectedSavedSpread, setSelectedSavedSpread] = useState<SavedSpread | null>(null);
  const [selectedDailyTarot, setSelectedDailyTarot] = useState<DailyTarotSave | null>(null);
  const [activeTab, setActiveTab] = useState('timer');
  const { t } = useLanguage();
  
  const handleSpreadSelect = (spread: SpreadType) => {
    setSelectedSpread(spread);
    setCurrentView('spreadDetail');
  };
  
  const handleSavedSpreadSelect = (savedSpread: SavedSpread) => {
    setSelectedSavedSpread(savedSpread);
    setCurrentView('savedSpreadDetail');
  };
  
  const handleDailyTarotSelect = (dailyTarot: DailyTarotSave) => {
    setSelectedDailyTarot(dailyTarot);
    setCurrentView('dailyTarotDetail');
  };
  
  const handleBackToSpreads = () => {
    setCurrentView('tabs');
    setSelectedSpread(null);
    setActiveTab('spreads');
  };
  
  const handleBackToJournal = () => {
    setCurrentView('tabs');
    setSelectedSavedSpread(null);
    setSelectedDailyTarot(null);
    setActiveTab('journal');
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentView('tabs');
    setSelectedSpread(null);
    setSelectedSavedSpread(null);
    setSelectedDailyTarot(null);
  };
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-8 left-8 w-1 h-1 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '500ms'
      }}></div>
      <div className="absolute top-48 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '3000ms'
      }}></div>
      <div className="absolute bottom-48 right-1/4 w-1 h-1 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1500ms'
      }}></div>
      <div className="absolute top-72 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{
        animationDelay: '4000ms'
      }}></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        <div className="flex flex-col h-full">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
              {currentView === 'tabs' && (
                <div className="h-full pb-20 overflow-auto scrollbar-none">
                  {activeTab === 'timer' && (
                    <div className="mt-0 h-full">
                      <Timer />
                    </div>
                  )}
                  {activeTab === 'spreads' && (
                    <div className="mt-0 h-full">
                      <Spreads onSpreadSelect={handleSpreadSelect} />
                    </div>
                  )}
                  {activeTab === 'journal' && (
                    <div className="mt-0 h-full">
                      <Journal onSavedSpreadSelect={handleSavedSpreadSelect} onDailyTarotSelect={handleDailyTarotSelect} />
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="mt-0 h-full">
                      <SettingsScreen />
                    </div>
                  )}
                </div>
              )}

              {currentView === 'spreadDetail' && selectedSpread && (
                <SpreadDetail 
                  spread={selectedSpread} 
                  onBack={handleBackToSpreads} 
                />
              )}

              {currentView === 'savedSpreadDetail' && selectedSavedSpread && (
                <div className="h-full">
                  {/* Saved spread detail view - placeholder */}
                  <div className="p-6">
                    <button onClick={handleBackToJournal}>Back to Journal</button>
                    <h1>Saved Spread: {selectedSavedSpread.title}</h1>
                  </div>
                </div>
              )}

              {currentView === 'dailyTarotDetail' && selectedDailyTarot && (
                <DailyTarotViewer 
                  dailyTarotSave={selectedDailyTarot} 
                  onBack={handleBackToJournal} 
                />
              )}
            </div>
            
            {/* Bottom Navigation */}
            <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-50">
              {/* Glow effect */}
              <div className="absolute -top-8 inset-x-0 h-8 pointer-events-none" style={{
                background: 'linear-gradient(to top, rgba(26, 31, 58, 0.8), transparent)'
              }}></div>
              
              {/* Navigation */}
              <div className="backdrop-blur-xl border-t shadow-2xl" style={{
                background: 'rgba(26, 31, 58, 0.95)',
                borderTopColor: 'rgba(212, 175, 55, 0.2)'
              }}>
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
                }}></div>
                
                <div className="container mx-auto max-w-md relative">
                  <div className="grid w-full grid-cols-4 bg-transparent border-none rounded-none h-auto p-0">
                    <button 
                      onClick={() => handleTabChange('timer')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-none bg-transparent border-none transition-all duration-300 group hover:text-white/80 ${
                        activeTab === 'timer' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
                      }`}
                    >
                      <div className="relative">
                        <Clock className={`h-6 w-6 transition-all duration-300 ${activeTab === 'timer' ? 'scale-110 drop-shadow-lg' : ''}`} />
                        <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${activeTab === 'timer' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.2)'
                        }} />
                        <div className={`absolute -inset-1 rounded-full transition-opacity animate-pulse -z-10 ${activeTab === 'timer' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.3)'
                        }} />
                      </div>
                      <span className="caption font-medium">{t('nav.timer')}</span>
                      <div className={`h-0.5 w-8 rounded-full transition-opacity shadow-lg ${activeTab === 'timer' ? 'opacity-100' : 'opacity-0'}`} style={{
                        backgroundColor: '#d4af37',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
                      }} />
                    </button>
                    
                    <button 
                      onClick={() => handleTabChange('spreads')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-none bg-transparent border-none transition-all duration-300 group hover:text-white/80 ${
                        activeTab === 'spreads' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
                      }`}
                    >
                      <div className="relative">
                        <Layout className={`h-6 w-6 transition-all duration-300 ${activeTab === 'spreads' ? 'scale-110 drop-shadow-lg' : ''}`} />
                        <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${activeTab === 'spreads' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.2)'
                        }} />
                        <div className={`absolute -inset-1 rounded-full transition-opacity animate-pulse -z-10 ${activeTab === 'spreads' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.3)'
                        }} />
                      </div>
                      <span className="caption font-medium">{t('nav.spreads')}</span>
                      <div className={`h-0.5 w-8 rounded-full transition-opacity shadow-lg ${activeTab === 'spreads' ? 'opacity-100' : 'opacity-0'}`} style={{
                        backgroundColor: '#d4af37',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
                      }} />
                    </button>
                    
                    <button 
                      onClick={() => handleTabChange('journal')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-none bg-transparent border-none transition-all duration-300 group hover:text-white/80 ${
                        activeTab === 'journal' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
                      }`}
                    >
                      <div className="relative">
                        <BookOpen className={`h-6 w-6 transition-all duration-300 ${activeTab === 'journal' ? 'scale-110 drop-shadow-lg' : ''}`} />
                        <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${activeTab === 'journal' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.2)'
                        }} />
                        <div className={`absolute -inset-1 rounded-full transition-opacity animate-pulse -z-10 ${activeTab === 'journal' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.3)'
                        }} />
                      </div>
                      <span className="caption font-medium">{t('nav.journal')}</span>
                      <div className={`h-0.5 w-8 rounded-full transition-opacity shadow-lg ${activeTab === 'journal' ? 'opacity-100' : 'opacity-0'}`} style={{
                        backgroundColor: '#d4af37',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
                      }} />
                    </button>
                    
                    <button 
                      onClick={() => handleTabChange('settings')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-none bg-transparent border-none transition-all duration-300 group hover:text-white/80 ${
                        activeTab === 'settings' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
                      }`}
                    >
                      <div className="relative">
                        <SettingsIcon className={`h-6 w-6 transition-all duration-300 ${activeTab === 'settings' ? 'scale-110 drop-shadow-lg' : ''}`} />
                        <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.2)'
                        }} />
                        <div className={`absolute -inset-1 rounded-full transition-opacity animate-pulse -z-10 ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0'}`} style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.3)'
                        }} />
                      </div>
                      <span className="caption font-medium">{t('nav.settings')}</span>
                      <div className={`h-0.5 w-8 rounded-full transition-opacity shadow-lg ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0'}`} style={{
                        backgroundColor: '#d4af37',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      {/* Additional overlay */}
      <div className="fixed top-0 left-0 w-full h-32 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(26, 31, 58, 0.3), transparent)'
      }}></div>
      

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}