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
import './globals.css';

// 타로 카드 컴포넌트
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
  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-20 h-30',
    large: 'w-32 h-48'
  };

  return (
    <div 
      className={`${sizeClasses[size]} cursor-pointer transition-all duration-300 hover:scale-105`}
      onClick={onClick}
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

// 타이머 탭 컴포넌트
const TimerTab: React.FC = () => {
  const { t } = useLanguage();
  const [dailyCards, setDailyCards] = useState<TarotCard[]>([]);
  const [currentHour, setCurrentHour] = useState(getCurrentHour());
  const [isDrawing, setIsDrawing] = useState(false);
  const [journal, setJournal] = useState('');
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);

  useEffect(() => {
    const cards = generateDailyCards();
    setDailyCards(cards);
    if (cards.length > currentHour) {
      setCurrentCard(cards[currentHour]);
    }
  }, [currentHour]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(getCurrentHour());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDrawCards = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const newCards = generateDailyCards();
      setDailyCards(newCards);
      if (newCards.length > currentHour) {
        setCurrentCard(newCards[currentHour]);
      }
      setIsDrawing(false);
    }, 2000);
  };

  const handleSaveReading = () => {
    if (dailyCards.length === 0) return;
    
    const dailyReading = {
      id: new Date().toISOString(),
      date: new Date().toDateString(),
      hourlyCards: dailyCards,
      memos: { [currentHour]: journal },
      insights: journal,
      savedAt: new Date().toISOString()
    };
    
    saveDailyTarot(dailyReading);
    alert(t('timer.saved'));
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
          {t('timer.title')}
        </h1>
        <p className="text-mystical-text">{formatDate(new Date())}</p>
      </div>

      {/* 현재 시간 카드 */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <p className="text-lg text-premium-gold">{t('timer.currentHour')}</p>
          <p className="text-2xl font-bold">{formatHour(currentHour)} - {t('timer.now')}</p>
        </div>

        {currentCard && (
          <div className="flex justify-center">
            <TarotCardDisplay 
              card={currentCard} 
              isRevealed={true} 
              size="large"
            />
          </div>
        )}

        {currentCard && (
          <div className="max-w-md mx-auto text-center space-y-2">
            <h3 className="text-xl font-semibold text-premium-gold">{currentCard.nameKr}</h3>
            <p className="text-sm text-mystical-text">{currentCard.meaningKr}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {currentCard.keywordsKr.map((keyword, index) => (
                <Badge key={index} className="bg-deep-purple/20 text-premium-gold border border-premium-gold/30">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 24시간 카드 뽑기 */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-premium-gold">{t('timer.revealDestiny')}</h2>
          <p className="text-sm text-mystical-text">{t('timer.cosmicMessage')}</p>
        </div>
        
        <Button 
          onClick={handleDrawCards} 
          disabled={isDrawing}
          className="bg-gradient-to-r from-deep-purple to-midnight-blue hover:from-deep-purple/80 hover:to-midnight-blue/80 text-white px-6 py-3 rounded-lg shadow-mystical"
        >
          {isDrawing ? (
            <>{t('timer.drawingCards')} <SparklesIcon className="ml-2 animate-spin" /></>
          ) : (
            <>{t('timer.drawCards')} <TarotCardsIcon className="ml-2" /></>
          )}
        </Button>
      </div>

      {/* 24시간 카드 그리드 */}
      {dailyCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-premium-gold">{t('timer.energyFlow')}</h3>
          <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
            {dailyCards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="text-center">
                <p className="text-xs text-mystical-text mb-1">{formatHour(index)}</p>
                <TarotCardDisplay 
                  card={card} 
                  isRevealed={index <= currentHour} 
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 성스러운 저널 */}
      <div className="max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-center text-premium-gold">{t('timer.sacredJournal')}</h3>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder={t('timer.journalPlaceholder')}
          className="w-full h-32 p-4 bg-mystical-bg/50 border border-premium-gold/30 rounded-lg text-mystical-text placeholder-mystical-text/60 focus:border-premium-gold focus:outline-none resize-none"
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-mystical-text">{journal.length}/500 {t('common.characters')}</span>
          <Button 
            onClick={handleSaveReading}
            className="bg-premium-gold hover:bg-bright-gold text-midnight-blue px-4 py-2 rounded-lg"
          >
            <SaveIcon className="w-4 h-4 mr-1" />
            {t('timer.saveReading')}
          </Button>
        </div>
      </div>

      {/* 신비로운 인용구 */}
      <div className="text-center text-sm text-mystical-text/80 italic max-w-md mx-auto">
        {t('timer.quote')}
      </div>
    </div>
  );
};

// 스프레드 탭 컴포넌트
const SpreadsTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
          {t('spreads.title')}
        </h1>
        <p className="text-mystical-text">{t('spreads.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPREAD_TYPES.map((spread) => (
          <Card key={spread.id} className="mystical-glow hover:shadow-mystical transition-all duration-300">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-premium-gold">{spread.nameKr}</h3>
                {spread.isPremium && (
                  <Badge className="bg-premium-gold text-midnight-blue">
                    <StarIcon className="w-3 h-3 mr-1" />
                    {t('spreads.premium')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-mystical-text">{spread.descriptionKr}</p>
              <div className="flex flex-wrap gap-1">
                {spread.positionsKr.slice(0, 3).map((position, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-premium-gold/30 text-mystical-text">
                    {position}
                  </Badge>
                ))}
                {spread.positionsKr.length > 3 && (
                  <Badge variant="outline" className="text-xs border-premium-gold/30 text-mystical-text">
                    +{spread.positionsKr.length - 3}
                  </Badge>
                )}
              </div>
              <Button className="w-full bg-deep-purple hover:bg-deep-purple/80 text-white">
                <LayoutIcon className="w-4 h-4 mr-2" />
                {t('spreads.beginReading')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-mystical-text/80 italic max-w-md mx-auto">
        {t('spreads.quote')}
      </div>
    </div>
  );
};

// 저널 탭 컴포넌트
const JournalTab: React.FC = () => {
  const { t } = useLanguage();
  const [savedReadings, setSavedReadings] = useState(loadDailyTarotSaves());

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
          {t('journal.title')}
        </h1>
        <p className="text-mystical-text">{t('journal.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 일일 타로 기록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-premium-gold flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            {t('journal.dailyTarot')}
          </h2>
          <div className="space-y-3">
            {savedReadings.length > 0 ? (
              savedReadings.slice(0, 3).map((reading) => (
                <Card key={reading.id} className="mystical-glow hover:shadow-mystical transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-premium-gold">{formatDate(new Date(reading.date))}</h3>
                      <Badge variant="outline" className="text-xs border-premium-gold/30 text-mystical-text">
                        {t('journal.saved')}
                      </Badge>
                    </div>
                    <p className="text-sm text-mystical-text mb-3 line-clamp-2">{reading.insights}</p>
                    <Button variant="ghost" size="sm" className="text-premium-gold hover:text-bright-gold">
                      {t('journal.view')}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 space-y-2">
                <MoonIcon className="w-12 h-12 mx-auto text-mystical-text/50" />
                <p className="text-mystical-text">{t('journal.noReadings')}</p>
                <p className="text-sm text-mystical-text/70">{t('journal.noReadingsDesc')}</p>
              </div>
            )}
          </div>
        </div>

        {/* 스프레드 기록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-premium-gold flex items-center">
            <LayoutIcon className="w-5 h-5 mr-2" />
            {t('journal.spreadRecords')}
          </h2>
          <div className="text-center py-8 space-y-2">
            <SparklesIcon className="w-12 h-12 mx-auto text-mystical-text/50" />
            <p className="text-mystical-text">{t('journal.noSpreads')}</p>
            <p className="text-sm text-mystical-text/70">{t('journal.noSpreadsDesc')}</p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-mystical-text/80 italic max-w-md mx-auto">
        {t('journal.quote')}
      </div>
    </div>
  );
};

// 설정 탭 컴포넌트
const SettingsTab: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-bright-gold bg-clip-text text-transparent">
          {t('settings.title')}
        </h1>
        <p className="text-mystical-text">{t('settings.subtitle')}</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* 프리미엄 멤버십 */}
        <Card className="mystical-glow">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-premium-gold">{t('settings.premium')}</h3>
              <Badge className="bg-premium-gold text-midnight-blue">
                <StarIcon className="w-3 h-3 mr-1" />
                {t('settings.active')}
              </Badge>
            </div>
            <div className="text-sm text-mystical-text space-y-1">
              <p>✓ {t('settings.premiumSpreads')}</p>
              <p>✓ {t('settings.adFree')}</p>
              <p>✓ {t('settings.unlimitedStorage')}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-midnight-blue">
              {t('settings.managePremium')}
            </Button>
          </CardContent>
        </Card>

        {/* 화면 & 테마 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-premium-gold">{t('settings.displayTheme')}</h3>
          <div className="flex justify-between items-center">
            <span className="text-mystical-text">{t('settings.darkMode')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-premium-gold' : 'bg-gray-600'}`}>
                <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${darkMode ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-mystical-text">{t('settings.language')}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
              className="bg-mystical-bg/50 border border-premium-gold/30 rounded px-3 py-1 text-mystical-text focus:border-premium-gold focus:outline-none"
            >
              <option value="ko">{t('settings.korean')}</option>
              <option value="en">{t('settings.english')}</option>
            </select>
          </div>
        </div>

        {/* 기타 설정들 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-premium-gold">{t('settings.soundHaptics')}</h3>
          <div className="flex justify-between items-center">
            <span className="text-mystical-text">{t('settings.soundEffects')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${soundEffects ? 'bg-premium-gold' : 'bg-gray-600'}`}>
                <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${soundEffects ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="text-center text-sm text-mystical-text/70 space-y-1">
          <p>{t('settings.version')}</p>
          <p>{t('settings.copyright')}</p>
        </div>
      </div>

      <div className="text-center text-sm text-mystical-text/80 italic max-w-md mx-auto">
        {t('settings.quote')}
      </div>
    </div>
  );
};

// 메인 앱 컴포넌트
const MysticalTarotApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'spreads' | 'journal' | 'settings'>('timer');
  const { t } = useLanguage();

  const tabConfig = [
    { key: 'timer' as const, icon: ClockIcon, label: t('nav.timer') },
    { key: 'spreads' as const, icon: LayoutIcon, label: t('nav.spreads') },
    { key: 'journal' as const, icon: BookOpenIcon, label: t('nav.journal') },
    { key: 'settings' as const, icon: SettingsIcon, label: t('nav.settings') }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerTab />;
      case 'spreads':
        return <SpreadsTab />;
      case 'journal':
        return <JournalTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <TimerTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mystical text-mystical-text">
      {/* 신비로운 배경 효과 */}
      <div className="fixed inset-0 bg-mystic-pattern opacity-10 pointer-events-none"></div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>

        {/* 하단 네비게이션 */}
        <div className="bg-mystical-nav/90 backdrop-blur-md border-t border-premium-gold/20">
          <div className="flex justify-around items-center py-2">
            {tabConfig.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                  activeTab === key
                    ? 'text-premium-gold bg-premium-gold/10'
                    : 'text-mystical-text hover:text-premium-gold'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 최종 앱 컴포넌트 (언어 프로바이더로 감싸기)
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MysticalTarotApp />
    </LanguageProvider>
  );
};

export default App;
