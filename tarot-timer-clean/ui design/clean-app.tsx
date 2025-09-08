import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Spreads } from './components/Spreads';
import { Journal } from './components/Journal';
import { Settings } from './components/Settings';
import { SpreadDetail } from './components/SpreadDetail';
import { SavedSpreadViewer } from './components/SavedSpreadViewer';
import { DailyTarotViewer } from './components/DailyTarotViewer';
import { LanguageProvider } from './utils/language';
import { 
  Clock, 
  TarotCards, 
  BookOpen, 
  Settings as SettingsIcon 
} from './components/mystical-ui/icons';
import { type SpreadType, type DailyTarotSave } from './utils/tarot';
import { ScaleHover, FadeIn, TouchFeedback } from './components/AnimationComponents';
import { tokens, commonStyles, combineStyles, conditionalStyle } from './utils/webStyles';

// ViewType 정의
type ViewType = 'tabs' | 'spreadDetail' | 'savedSpreadDetail' | 'dailyTarotDetail';

// SavedSpread 타입 정의
interface SavedSpread {
  id: string;
  spreadType: string;
  title: string;
  spreadName: string;
  spreadNameKr: string;
  date: string;
  cards: Array<{
    id: string;
    nameKr: string;
    name: string;
    imageUrl: string;
    position: string;
    positionKr: string;
    isRevealed: boolean;
  }>;
  notes?: string;
  savedAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'spreads' | 'journal' | 'settings'>('timer');
  const [currentView, setCurrentView] = useState<ViewType>('tabs');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [selectedSavedSpread, setSelectedSavedSpread] = useState<SavedSpread | null>(null);
  const [selectedDailyTarot, setSelectedDailyTarot] = useState<DailyTarotSave | null>(null);
  
  // 스프레드 선택 핸들러
  const handleSpreadSelect = (spread: SpreadType) => {
    setSelectedSpread(spread);
    setCurrentView('spreadDetail');
  };

  // 저장된 스프레드 상세보기 핸들러
  const handleSavedSpreadView = (savedSpread: SavedSpread) => {
    setSelectedSavedSpread(savedSpread);
    setCurrentView('savedSpreadDetail');
  };

  // 데일리 타로 상세보기 핸들러
  const handleDailyTarotView = (dailyTarot: DailyTarotSave) => {
    setSelectedDailyTarot(dailyTarot);
    setCurrentView('dailyTarotDetail');
  };

  // 뒤로가기 핸들러
  const handleBackToTabs = () => {
    setCurrentView('tabs');
    setSelectedSpread(null);
    setSelectedSavedSpread(null);
    setSelectedDailyTarot(null);
  };

  // 메인 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'spreads':
        return <Spreads onSpreadSelect={handleSpreadSelect} />;
      case 'journal':
        return (
          <Journal 
            onSavedSpreadView={handleSavedSpreadView}
            onDailyTarotView={handleDailyTarotView}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Timer />;
    }
  };

  // 현재 뷰에 따른 콘텐츠 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'spreadDetail':
        return selectedSpread ? (
          <SpreadDetail 
            spread={selectedSpread} 
            onBack={handleBackToTabs}
          />
        ) : null;
      
      case 'savedSpreadDetail':
        return selectedSavedSpread ? (
          <SavedSpreadViewer 
            savedSpread={selectedSavedSpread} 
            onBack={handleBackToTabs}
          />
        ) : null;
      
      case 'dailyTarotDetail':
        return selectedDailyTarot ? (
          <DailyTarotViewer 
            dailyTarot={selectedDailyTarot} 
            onBack={handleBackToTabs}
          />
        ) : null;
      
      case 'tabs':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* 메인 콘텐츠 */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderTabContent()}
            </div>
            
            {/* 탭 바 */}
            <div 
              style={combineStyles(
                commonStyles.tabBar,
                {
                  backgroundColor: tokens.colors.card + 'FC',
                  borderTop: `1px solid ${tokens.colors.border}66`,
                }
              )}
            >
              <div style={commonStyles.tabBarContainer}>
                {[
                  { 
                    key: 'timer' as const, 
                    label: '타이머', 
                    labelEn: 'Timer',
                    icon: Clock 
                  },
                  { 
                    key: 'spreads' as const, 
                    label: '스프레드', 
                    labelEn: 'Spreads',
                    icon: TarotCards 
                  },
                  { 
                    key: 'journal' as const, 
                    label: '저널', 
                    labelEn: 'Journal',
                    icon: BookOpen 
                  },
                  { 
                    key: 'settings' as const, 
                    label: '설정', 
                    labelEn: 'Settings',
                    icon: SettingsIcon 
                  },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.key;
                  
                  return (
                    <TouchFeedback
                      key={tab.key}
                      onPress={() => setActiveTab(tab.key)}
                      touchType="tabButton"
                      hapticFeedback={true}
                      style={combineStyles(
                        commonStyles.tabButton,
                        {
                          borderRadius: tokens.borderRadius.lg,
                          margin: tokens.spacing.xs,
                          border: 'none',
                          backgroundColor: 'transparent',
                        },
                        conditionalStyle(
                          isActive, 
                          { backgroundColor: tokens.colors.accent + '1A' }
                        )
                      )}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.spacing.xs }}>
                        {/* 아이콘 컨테이너 */}
                        <div
                          style={combineStyles(
                            commonStyles.iconContainer,
                            conditionalStyle(
                              isActive,
                              { backgroundColor: tokens.colors.accent + '26' }
                            )
                          )}
                        >
                          <IconComponent 
                            className={`w-6 h-6 ${
                              isActive ? 'text-accent' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        
                        {/* 라벨 */}
                        <span
                          style={combineStyles(
                            commonStyles.caption,
                            {
                              color: isActive ? tokens.colors.accent : tokens.colors.mutedForeground,
                              textAlign: 'center',
                            }
                          )}
                        >
                          {tab.label}
                        </span>
                      </div>
                    </TouchFeedback>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <LanguageProvider>
      <div style={{ minHeight: '100vh', ...commonStyles.safeArea }}>
        {/* 배경 그라데이션 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${tokens.colors.background}, ${tokens.colors.muted}20, ${tokens.colors.background})`,
            pointerEvents: 'none',
          }}
        />
        
        {/* 메인 콘텐츠 */}
        <div style={{ position: 'relative', zIndex: 10, ...commonStyles.container }}>
          {renderCurrentView()}
        </div>
      </div>
    </LanguageProvider>
  );
}