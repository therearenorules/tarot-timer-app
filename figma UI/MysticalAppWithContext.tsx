/**
 * Mystical App with Context API Integration
 * Context API 상태 관리가 통합된 타로 타이머 앱
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './utils/language';
import { Card, CardContent, Button, Badge, ImageWithFallback } from './components/mystical-ui/components';
import { 
  ClockIcon, 
  LayoutIcon, 
  BookOpenIcon, 
  SettingsIcon,
  TarotCardsIcon,
  StarIcon,
  SparklesIcon,
  RotateCcwIcon,
  SaveIcon,
  MoonIcon
} from './components/mystical-ui/icons';
import {
  generateDailyCards,
  getCurrentHour,
  formatHour,
  formatDate,
  SPREAD_TYPES,
  TarotCard,
  SpreadType,
  saveDailyTarot,
  loadDailyTarotSaves,
  getTodaysSave
} from './utils/tarot-data';

// Context API imports
import { 
  AppProviders, 
  useError, 
  useLoading, 
  useAsyncLoading,
  useErrorReporter 
} from './contexts';

import './globals.css';

// 타로 카드 컴포넌트 (Context API 통합)
interface TarotCardDisplayProps {
  card: TarotCard;
  isRevealed?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ 
  card, 
  isRevealed = false, 
  onClick, 
  size = 'medium' 
}) => {
  const { reportAsyncError } = useErrorReporter();
  const { executeWithLoading } = useAsyncLoading();
  
  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-20 h-30',
    large: 'w-32 h-48'
  };

  const handleCardClick = async () => {
    if (onClick) {
      try {
        await executeWithLoading(
          'card-reveal',
          async (updateProgress) => {
            updateProgress?.(50);
            await new Promise(resolve => setTimeout(resolve, 300)); // 카드 뒤집기 애니메이션
            updateProgress?.(100);
            onClick();
          },
          {
            title: '카드 공개 중...',
            priority: 'low',
          }
        );
      } catch (error) {
        reportAsyncError(error as Error, { card: card.id });
      }
    }
  };

  return (
    <div 
      className={`${sizeClasses[size]} cursor-pointer transition-all duration-300 hover:scale-105`}
      onClick={handleCardClick}
    >
      <Card className="h-full mystical-glow hover:shadow-mystical">
        <CardContent className="p-2 flex flex-col justify-center items-center h-full">
          {isRevealed ? (
            <>
              <ImageWithFallback 
                src={`/assets/tarot-cards/classic-tarot/${card.id}.jpg`}
                alt={card.name}
                className="w-full h-3/4 rounded object-cover mb-1"
                fallback="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
              />
              <div className="text-center text-xs">
                <p className="font-medium text-premium-gold truncate">{card.nameKr}</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-deep-purple to-midnight-blue rounded flex flex-col items-center justify-center">
              <TarotCardsIcon className="w-8 h-8 text-premium-gold mb-2" />
              <div className="w-full h-2 bg-gradient-to-r from-premium-gold to-bright-gold rounded animate-mystical-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 타이머 탭 컴포넌트 (Context API 통합)
const TimerTab: React.FC = () => {
  const { t } = useLanguage();
  const { reportAsyncError } = useErrorReporter();
  const { executeWithLoading } = useAsyncLoading();
  const { isLoading } = useLoading();
  
  const [dailyCards, setDailyCards] = useState<TarotCard[]>([]);
  const [currentHour, setCurrentHour] = useState(getCurrentHour());
  const [isDrawing, setIsDrawing] = useState(false);
  const [journal, setJournal] = useState('');
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);

  // 일일 카드 생성 (에러 처리 및 로딩 적용)
  const initializeDailyCards = async () => {
    try {
      await executeWithLoading(
        'daily-cards',
        async (updateProgress) => {
          updateProgress?.(25);
          const cards = generateDailyCards();
          updateProgress?.(75);
          setDailyCards(cards);
          if (cards.length > currentHour) {
            setCurrentCard(cards[currentHour]);
          }
          updateProgress?.(100);
        },
        {
          title: t('loading.dailyCards', '일일 카드 생성 중...'),
          priority: 'medium',
        }
      );
    } catch (error) {
      reportAsyncError(error as Error, { context: 'daily-cards-init' });
    }
  };

  useEffect(() => {
    initializeDailyCards();
  }, [currentHour]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(getCurrentHour());
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, []);

  // 저널 저장 (에러 처리 및 로딩 적용)
  const handleSaveJournal = async () => {
    if (!currentCard || !journal.trim()) return;

    try {
      await executeWithLoading(
        'save-journal',
        async (updateProgress) => {
          updateProgress?.(30);
          
          const dailyTarotSave = {
            id: `daily-${formatDate(new Date())}`,
            date: formatDate(new Date()),
            hourlyCards: dailyCards.map((card, index) => ({
              hour: index,
              card,
              isRevealed: index <= currentHour,
              journal: index === currentHour ? journal : ''
            })),
            totalCards: dailyCards.length
          };
          
          updateProgress?.(70);
          saveDailyTarot(dailyTarotSave);
          updateProgress?.(100);
          
          setJournal('');
        },
        {
          title: t('saving.journal', '저널 저장 중...'),
          description: '소중한 생각을 기록하고 있습니다',
          priority: 'medium',
        }
      );
    } catch (error) {
      reportAsyncError(error as Error, { context: 'journal-save', card: currentCard.id });
    }
  };

  // 카드 뽑기 (에러 처리 및 로딩 적용)
  const handleDrawCard = async () => {
    try {
      await executeWithLoading(
        'draw-card',
        async (updateProgress) => {
          setIsDrawing(true);
          updateProgress?.(20);
          
          // 카드 뽑기 애니메이션 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          updateProgress?.(60);
          
          const cards = generateDailyCards();
          setDailyCards(cards);
          updateProgress?.(80);
          
          if (cards.length > currentHour) {
            setCurrentCard(cards[currentHour]);
          }
          
          updateProgress?.(100);
          setIsDrawing(false);
        },
        {
          title: t('drawing.card', '새로운 카드 뽑는 중...'),
          description: '우주의 에너지가 카드를 선택하고 있습니다',
          priority: 'high',
          timeout: 10000,
        }
      );
    } catch (error) {
      reportAsyncError(error as Error, { context: 'card-draw' });
      setIsDrawing(false);
    }
  };

  const isAnyLoading = isLoading();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ClockIcon className="w-8 h-8 text-premium-gold mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
            {t('timer.title', '시간별 타로')}
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-4 text-mystical-text">
          <Badge variant="outline" className="px-4 py-2">
            <StarIcon className="w-4 h-4 mr-2" />
            {formatHour(currentHour)}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <SparklesIcon className="w-4 h-4 mr-2" />
            {formatDate(new Date())}
          </Badge>
        </div>
      </div>

      {/* 현재 시간 카드 */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-mystical-text mb-2">
            {t('timer.currentCard', '현재 시간의 카드')}
          </h2>
          <p className="text-mystical-text-secondary">
            {formatHour(currentHour)} {t('timer.guidance', '의 안내')}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          {currentCard ? (
            <TarotCardDisplay
              card={currentCard}
              isRevealed={!isDrawing}
              size="large"
            />
          ) : (
            <div className="w-32 h-48 bg-gradient-to-br from-deep-purple to-midnight-blue rounded-lg flex items-center justify-center">
              <div className="text-premium-gold">
                {isAnyLoading ? (
                  <div className="animate-spin">
                    <SparklesIcon className="w-8 h-8" />
                  </div>
                ) : (
                  <TarotCardsIcon className="w-8 h-8" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            onClick={handleDrawCard}
            disabled={isAnyLoading}
            className="px-6 py-2 bg-gradient-to-r from-premium-gold to-bright-gold text-midnight-blue font-semibold hover:shadow-mystical transition-all"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            {t('timer.newCards', '새 카드 뽑기')}
          </Button>
        </div>

        {/* 저널 */}
        {currentCard && (
          <Card className="mystical-glow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BookOpenIcon className="w-5 h-5 text-premium-gold mr-2" />
                <h3 className="text-lg font-semibold text-mystical-text">
                  {t('journal.reflection', '카드에 대한 생각')}
                </h3>
              </div>
              
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder={t('journal.placeholder', '이 시간, 이 카드가 전하는 메시지에 대해 자유롭게 적어보세요...')}
                className="w-full h-32 p-4 bg-soft-lavender/50 border border-mystical-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-premium-gold/50 text-mystical-text placeholder-mystical-text-secondary"
                disabled={isAnyLoading}
              />
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSaveJournal}
                  disabled={!journal.trim() || isAnyLoading}
                  className="px-4 py-2 bg-gradient-to-r from-deep-purple to-midnight-blue text-white hover:shadow-mystical transition-all"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  {t('journal.save', '저장')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 24시간 카드 뷰 */}
      <Card className="mystical-glow">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <MoonIcon className="w-5 h-5 text-premium-gold mr-2" />
            <h3 className="text-lg font-semibold text-mystical-text">
              {t('timer.dailyCards', '오늘의 24시간 카드')}
            </h3>
          </div>
          
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {dailyCards.map((card, index) => (
              <div key={index} className="text-center">
                <div className="mb-1">
                  <TarotCardDisplay
                    card={card}
                    isRevealed={index <= currentHour && !isDrawing}
                    size="small"
                  />
                </div>
                <div className="text-xs text-mystical-text-secondary">
                  {String(index).padStart(2, '0')}:00
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 스프레드 탭 컴포넌트
const SpreadTab: React.FC = () => {
  const { t } = useLanguage();
  const { reportAsyncError } = useErrorReporter();
  const { executeWithLoading } = useAsyncLoading();
  
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(SPREAD_TYPES[0]);
  const [spreadCards, setSpreadCards] = useState<TarotCard[]>([]);

  const handleGenerateSpread = async () => {
    try {
      await executeWithLoading(
        'generate-spread',
        async (updateProgress) => {
          updateProgress?.(25);
          const cards = generateDailyCards().slice(0, selectedSpread.positions.length);
          updateProgress?.(75);
          setSpreadCards(cards);
          updateProgress?.(100);
        },
        {
          title: t('spread.generating', '스프레드 생성 중...'),
          description: `${selectedSpread.nameKr} 배치를 준비하고 있습니다`,
          priority: 'medium',
        }
      );
    } catch (error) {
      reportAsyncError(error as Error, { context: 'spread-generation', spread: selectedSpread.id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <LayoutIcon className="w-8 h-8 text-premium-gold mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
            {t('spread.title', '타로 스프레드')}
          </h1>
        </div>
      </div>

      {/* 스프레드 선택 */}
      <Card className="mystical-glow mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-mystical-text mb-4">
            {t('spread.selectType', '스프레드 유형 선택')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPREAD_TYPES.map((spread) => (
              <div
                key={spread.id}
                onClick={() => setSelectedSpread(spread)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedSpread.id === spread.id
                    ? 'border-premium-gold bg-premium-gold/10'
                    : 'border-mystical-border hover:border-premium-gold/50'
                }`}
              >
                <h4 className="font-semibold text-mystical-text">{spread.nameKr}</h4>
                <p className="text-sm text-mystical-text-secondary mt-1">
                  {spread.positions.length}장 / {spread.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 스프레드 생성 버튼 */}
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateSpread}
          className="px-8 py-3 bg-gradient-to-r from-premium-gold to-bright-gold text-midnight-blue font-semibold hover:shadow-mystical transition-all"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          {t('spread.generate', '스프레드 생성')}
        </Button>
      </div>

      {/* 생성된 스프레드 */}
      {spreadCards.length > 0 && (
        <Card className="mystical-glow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-mystical-text mb-6 text-center">
              {selectedSpread.nameKr}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {spreadCards.map((card, index) => (
                <div key={index} className="text-center">
                  <TarotCardDisplay
                    card={card}
                    isRevealed={true}
                    size="medium"
                  />
                  <div className="mt-2 text-sm text-mystical-text-secondary">
                    {selectedSpread.positions[index]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 설정 탭 컴포넌트
const SettingsTab: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <SettingsIcon className="w-8 h-8 text-premium-gold mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
            {t('settings.title', '설정')}
          </h1>
        </div>
      </div>

      <Card className="mystical-glow">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-mystical-text mb-4">
              {t('settings.language', '언어 설정')}
            </h3>
            <div className="flex space-x-4">
              <Button
                onClick={() => setLanguage('ko')}
                variant={language === 'ko' ? 'default' : 'outline'}
                className="px-4 py-2"
              >
                한국어
              </Button>
              <Button
                onClick={() => setLanguage('en')}
                variant={language === 'en' ? 'default' : 'outline'}
                className="px-4 py-2"
              >
                English
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 메인 앱 컴포넌트
const MysticalAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'spread' | 'settings'>('timer');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerTab />;
      case 'spread':
        return <SpreadTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <TimerTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-lavender via-white to-mystical-mist">
      {/* 네비게이션 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-mystical-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-4">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'timer'
                  ? 'bg-premium-gold text-midnight-blue'
                  : 'text-mystical-text hover:bg-premium-gold/10'
              }`}
            >
              <ClockIcon className="w-5 h-5" />
              <span>타이머</span>
            </button>
            <button
              onClick={() => setActiveTab('spread')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'spread'
                  ? 'bg-premium-gold text-midnight-blue'
                  : 'text-mystical-text hover:bg-premium-gold/10'
              }`}
            >
              <LayoutIcon className="w-5 h-5" />
              <span>스프레드</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-premium-gold text-midnight-blue'
                  : 'text-mystical-text hover:bg-premium-gold/10'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>설정</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
};

// 루트 앱 컴포넌트 (Context Providers 적용)
const MysticalAppWithContext: React.FC = () => {
  return (
    <AppProviders>
      <LanguageProvider>
        <MysticalAppContent />
      </LanguageProvider>
    </AppProviders>
  );
};

export default MysticalAppWithContext;