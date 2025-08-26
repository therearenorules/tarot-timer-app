/**
 * Functional App with Working Navigation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { registerRootComponent } from 'expo';

// Mock data for demonstration
const mockCards = [
  { id: 1, name: "The Fool", hour: 9, meaning: "새로운 시작과 모험" },
  { id: 2, name: "The Magician", hour: 10, meaning: "의지력과 창조" },
  { id: 3, name: "The High Priestess", hour: 11, meaning: "직관과 내면의 지혜" },
  { id: 4, name: "The Empress", hour: 12, meaning: "풍요로움과 어머니적 사랑" },
];

function FunctionalApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentHour] = useState(new Date().getHours());

  const TabButton = ({ id, title, isActive, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTab]} 
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const HomeTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>🔮 현재 시간: {currentHour}시</Text>
      <Text style={styles.subtitle}>오늘의 24시간 타로 카드</Text>
      
      {mockCards.map((card) => (
        <TouchableOpacity key={card.id} style={styles.card}>
          <Text style={styles.cardHour}>{card.hour}시</Text>
          <Text style={styles.cardTitle}>{card.name}</Text>
          <Text style={styles.cardMeaning}>{card.meaning}</Text>
        </TouchableOpacity>
      ))}
      
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>오늘의 통계</Text>
        <Text style={styles.statsText}>• 뽑은 카드: {mockCards.length}장</Text>
        <Text style={styles.statsText}>• 남은 시간: {24 - currentHour}시간</Text>
      </View>
    </ScrollView>
  );

  const SpreadsTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>🃏 타로 스프레드</Text>
      <Text style={styles.subtitle}>다양한 카드 배치법을 선택하세요</Text>
      
      {[
        { name: "원 카드", desc: "간단한 질문에 대한 답" },
        { name: "쓰리 카드", desc: "과거-현재-미래" },
        { name: "켈틱 크로스", desc: "복잡한 상황 분석" },
        { name: "관계 스프레드", desc: "인간관계 분석" },
      ].map((spread, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{spread.name}</Text>
          <Text style={styles.cardText}>{spread.desc}</Text>
          <Text style={styles.actionText}>탭하여 시작</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const DiaryTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>📖 타로 다이어리</Text>
      <Text style={styles.subtitle}>당신의 타로 기록을 관리하세요</Text>
      
      <TouchableOpacity style={styles.newEntryButton}>
        <Text style={styles.newEntryText}>+ 새 기록 추가</Text>
      </TouchableOpacity>
      
      {[
        { date: "2025-08-26", card: "The Fool", note: "새로운 프로젝트 시작" },
        { date: "2025-08-25", card: "The Magician", note: "창의력이 넘치는 하루" },
        { date: "2025-08-24", card: "The High Priestess", note: "직감을 믿었던 결정" },
      ].map((entry, index) => (
        <TouchableOpacity key={index} style={styles.diaryEntry}>
          <Text style={styles.entryDate}>{entry.date}</Text>
          <Text style={styles.entryCard}>{entry.card}</Text>
          <Text style={styles.entryNote}>{entry.note}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const SettingsTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>⚙️ 설정</Text>
      <Text style={styles.subtitle}>앱 환경을 설정하세요</Text>
      
      {[
        { title: "알림 설정", desc: "시간별 카드 알림" },
        { title: "테마 설정", desc: "다크/라이트 모드" },
        { title: "덱 관리", desc: "타로 덱 선택" },
        { title: "백업", desc: "데이터 백업/복원" },
        { title: "정보", desc: "앱 버전 및 정보" },
      ].map((setting, index) => (
        <TouchableOpacity key={index} style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDesc}>{setting.desc}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'spreads': return <SpreadsTab />;
      case 'diary': return <DiaryTab />;
      case 'settings': return <SettingsTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔮 타로 타이머</Text>
        <Text style={styles.headerTime}>{new Date().toLocaleTimeString()}</Text>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TabButton
          id="home"
          title="홈"
          isActive={activeTab === 'home'}
          onPress={() => setActiveTab('home')}
        />
        <TabButton
          id="spreads"
          title="스프레드"
          isActive={activeTab === 'spreads'}
          onPress={() => setActiveTab('spreads')}
        />
        <TabButton
          id="diary"
          title="다이어리"
          isActive={activeTab === 'diary'}
          onPress={() => setActiveTab('diary')}
        />
        <TabButton
          id="settings"
          title="설정"
          isActive={activeTab === 'settings'}
          onPress={() => setActiveTab('settings')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: '#16213e',
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerTime: {
    fontSize: 14,
    color: '#cccccc',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#16213e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0f3460',
  },
  cardHour: {
    fontSize: 12,
    color: '#0f3460',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  cardMeaning: {
    fontSize: 14,
    color: '#cccccc',
  },
  cardText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#0f3460',
    fontWeight: 'bold',
  },
  stats: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  newEntryButton: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  newEntryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  diaryEntry: {
    backgroundColor: '#16213e',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  entryDate: {
    fontSize: 12,
    color: '#0f3460',
    fontWeight: 'bold',
  },
  entryCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 5,
  },
  entryNote: {
    fontSize: 14,
    color: '#cccccc',
  },
  settingItem: {
    backgroundColor: '#16213e',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  settingDesc: {
    fontSize: 14,
    color: '#cccccc',
  },
  arrow: {
    fontSize: 18,
    color: '#0f3460',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#0f3460',
  },
  tabText: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default registerRootComponent(FunctionalApp);