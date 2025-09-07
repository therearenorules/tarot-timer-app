/**
 * Main App Entry Point - Phase 2 Complete with Tab Navigation
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SpreadScreen } from './src/screens/SpreadScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TabNavigation, GradientBackground, LoadingScreen } from './src/components/ui';
import { colors } from './src/constants/DesignTokens';
import { useFonts } from './src/hooks/useFonts';

type TabScreen = 'home' | 'spread' | 'journal' | 'settings';

const tabs = [
  { key: 'home', label: '홈', icon: '🏠' },
  { key: 'spread', label: '스프레드', icon: '🔮' },
  { key: 'journal', label: '일기', icon: '📖' },
  { key: 'settings', label: '설정', icon: '⚙️' },
];

export default function App() {
  console.log('🔮 Tarot Timer App - Phase 4 Visual Enhancement');
  
  const { isReady: fontsReady } = useFonts();
  const [activeTab, setActiveTab] = useState<TabScreen>('home');

  // 폰트가 로드되지 않았다면 로딩 화면 표시
  if (!fontsReady) {
    return <LoadingScreen message="타로 타이머 로딩 중..." />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'spread':
        return <SpreadScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <GradientBackground variant="main" style={{ flex: 1 }}>
      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      
      {/* Bottom Tab Navigation with Gradient Background */}
      <GradientBackground variant="subtle" style={{ flexDirection: 'row' }}>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab as TabScreen)}
          position="bottom"
          size="medium"
          variant="filled"
        />
      </GradientBackground>
    </GradientBackground>
  );
}