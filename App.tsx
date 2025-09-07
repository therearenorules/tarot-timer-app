/**
 * Main App Entry Point - Phase 2 Complete with Tab Navigation
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SpreadScreen } from './src/screens/SpreadScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TabNavigation } from './src/components/ui/TabNavigation';
import { colors } from './src/constants/DesignTokens';

type TabScreen = 'home' | 'spread' | 'journal' | 'settings';

const tabs = [
  { key: 'home', label: '홈', icon: '🏠' },
  { key: 'spread', label: '스프레드', icon: '🔮' },
  { key: 'journal', label: '일기', icon: '📖' },
  { key: 'settings', label: '설정', icon: '⚙️' },
];

export default function App() {
  console.log('🔮 Tarot Timer App - Phase 2 Complete');
  
  const [activeTab, setActiveTab] = useState<TabScreen>('home');

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
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      
      {/* Bottom Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab as TabScreen)}
        position="bottom"
        size="medium"
        variant="filled"
      />
    </View>
  );
}