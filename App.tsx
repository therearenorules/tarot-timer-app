import React, { useState, useEffect } from 'react';
import { Timer } from './src/screens/Timer';
import { Spreads } from './src/screens/Spreads';
import { Journal } from './src/screens/Journal';
import { Settings } from './src/screens/Settings';
import { SpreadDetail } from './src/screens/SpreadDetail';
import { SavedSpreadViewer } from './src/screens/SavedSpreadViewer';
import { DailyTarotViewer } from './src/screens/DailyTarotViewer';
import { LanguageProvider, useLanguage } from './src/providers/LanguageProvider';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import { 
  Clock, 
  TarotCards, 
  BookOpen, 
  Settings as SettingsIcon 
} from './src/components/mystical-ui/icons';
import { type SpreadType, type DailyTarotSave } from './src/utils/tarot';
import { ScaleHover, FadeIn } from './src/components/AnimationComponents';
import { TouchFeedback } from './src/components/TouchFeedback';
import { LinearGradient } from 'expo-linear-gradient';
import { CosmicBackgroundGradient } from './src/design-system/components/gradients/MysticalGradients';

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

function AppContent() {
  const { t } = useLanguage();
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
          <View style={styles.container}>
            {/* 메인 콘텐츠 */}
            <View style={styles.content}>
              {(() => {
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
              })()}
            </View>
            
            {/* 🌟 MYSTICAL TAB BAR WITH GOLD GLOW */}
            <View style={styles.tabBar}>
              <LinearGradient
                colors={[
                  'rgba(212, 175, 55, 0.3)',  // Gold glow top
                  'rgba(138, 36, 170, 0.4)',  // Purple middle  
                  'rgba(10, 5, 26, 0.9)'      // Deep space bottom
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.tabBarGlassBackground}
              />
              <View style={styles.tabBarContainer}>
                {[
                  { 
                    key: 'timer' as const, 
                    labelKey: 'timer.title' as const,
                    icon: Clock 
                  },
                  { 
                    key: 'spreads' as const, 
                    labelKey: 'spreads.title' as const,
                    icon: TarotCards 
                  },
                  { 
                    key: 'journal' as const, 
                    labelKey: 'journal.title' as const,
                    icon: BookOpen 
                  },
                  { 
                    key: 'settings' as const, 
                    labelKey: 'settings.title' as const,
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
                      style={[
                        styles.tabButton,
                        isActive && styles.tabButtonActive
                      ]}
                    >
                      <View style={styles.tabButtonContent}>
                        {/* 아이콘 컨테이너 */}
                        <View style={[
                          styles.iconContainer,
                          isActive && styles.iconContainerActive
                        ]}>
                          <IconComponent 
                            color={isActive ? '#d4af37' : '#8e24aa'}  // Gold for active, purple for inactive
                            size={30}
                          />
                        </View>
                        
                        {/* 라벨 */}
                        <Text style={[
                          styles.tabLabel,
                          { color: isActive ? '#d4af37' : '#8e24aa' }  // Gold for active, purple for inactive
                        ]}>
                          {t(tab.labelKey)}
                        </Text>
                      </View>
                    </TouchFeedback>
                  );
                })}
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CosmicBackgroundGradient />
      <View style={styles.mainContent}>
        {renderCurrentView()}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

// 🔥🔥🔥 CACHE BUSTER COMMENT - CHANGE DETECTED 🔥🔥🔥

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a051a', // Deep cosmic space
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  mysticalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold glow overlay
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  // 🌟 ENHANCED MYSTICAL TAB BAR STYLING
  tabBar: {
    position: 'relative',
    backgroundColor: 'rgba(10, 5, 26, 0.95)', // Deep space base
    borderTopWidth: 3,
    borderTopColor: '#d4af37', // Bright gold border
    paddingBottom: 16,
    paddingTop: 24,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 25,
    // Mystical glow effect
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabBarGlassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    // Subtle mystical glow for all buttons
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#d4af3740', // Gold with transparency
    borderWidth: 1,
    borderColor: '#d4af3760',
    // Enhanced glow for active button
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButtonContent: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle glass effect
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconContainerActive: {
    backgroundColor: '#d4af3730',
    borderWidth: 2,
    borderColor: '#d4af3780',
    // Mystical glow effect
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});