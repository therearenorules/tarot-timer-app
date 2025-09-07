import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  TarotCard,
  TimeDisplay,
  TabNavigation,
  MemoPad,
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from '../../components/ui';

export const ComponentTestScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [memoText, setMemoText] = useState('HTML 디자인을 React Native로 완벽하게 변환했습니다. 신비로운 애니메이션과 함께 타로의 미학을 그대로 담았습니다.');

  const tabItems = [
    { id: 'cards', label: '카드', icon: '🎴' },
    { id: 'timer', label: '타이머', icon: '⏰', badge: 3 },
    { id: 'diary', label: '일기', icon: '📖' },
    { id: 'settings', label: '설정', icon: '⚙️' },
  ];

  const handleTimeEnd = () => {
    console.log('타이머 종료!');
  };

  const handleMemoSave = (text: string) => {
    console.log('메모 저장:', text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🔮 컴포넌트 테스트</Text>
          <Text style={styles.subtitle}>HTML → React Native 변환 결과</Text>
        </View>

        {/* TarotCard 테스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. TarotCard 컴포넌트</Text>
          
          <View style={styles.cardRow}>
            <TarotCard
              size="small"
              variant="placeholder"
              onPress={() => console.log('Placeholder card pressed')}
              testID="placeholder-card"
            />
            
            <TarotCard
              size="medium"
              variant="revealed"
              cardImage="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop"
              cardName="The Fool"
              description="새로운 시작"
              position="1"
              mysticalEffect={true}
              onPress={() => console.log('Revealed card pressed')}
              testID="revealed-card"
            />
            
            <TarotCard
              size="small"
              variant="flipped"
              onPress={() => console.log('Flipped card pressed')}
              testID="flipped-card"
            />
          </View>

          <View style={styles.cardRow}>
            <TarotCard
              size="large"
              variant="revealed"
              cardImage="https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=300&h=500&fit=crop"
              cardName="The Magician"
              description="의지와 창조력"
              mysticalEffect={true}
              onPress={() => console.log('Large card pressed')}
              testID="large-card"
            />
          </View>
        </View>

        {/* TimeDisplay 테스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. TimeDisplay 컴포넌트</Text>
          
          <View style={styles.timeRow}>
            <TimeDisplay
              minutes={5}
              seconds={23}
              isActive={true}
              variant="default"
              size="small"
              label="기본"
              testID="timer-basic"
            />
            
            <TimeDisplay
              minutes={3}
              seconds={45}
              isActive={true}
              variant="mystical"
              size="medium"
              label="신비로운"
              onTimeEnd={handleTimeEnd}
              testID="timer-mystical"
            />
          </View>

          <View style={styles.timeRow}>
            <TimeDisplay
              minutes={0}
              seconds={45}
              isActive={true}
              variant="default"
              size="medium"
              label="경고 상태"
              showTimestamp={true}
              testID="timer-warning"
            />
            
            <TimeDisplay
              minutes={2}
              seconds={30}
              isPaused={true}
              variant="mystical"
              size="medium"
              label="일시정지"
              testID="timer-paused"
            />
          </View>
        </View>

        {/* TabNavigation 테스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. TabNavigation 컴포넌트</Text>
          
          <View style={styles.tabContainer}>
            <Text style={styles.tabLabel}>기본 스타일</Text>
            <TabNavigation
              tabs={tabItems}
              activeTabId={activeTab}
              onTabPress={setActiveTab}
              variant="default"
              size="regular"
              testID="tab-default"
            />
          </View>

          <View style={styles.tabContainer}>
            <Text style={styles.tabLabel}>신비로운 스타일</Text>
            <TabNavigation
              tabs={tabItems}
              activeTabId={activeTab}
              onTabPress={setActiveTab}
              variant="mystical"
              size="regular"
              testID="tab-mystical"
            />
          </View>

          <View style={styles.tabContainer}>
            <Text style={styles.tabLabel}>컴팩트 사이즈</Text>
            <TabNavigation
              tabs={tabItems}
              activeTabId={activeTab}
              onTabPress={setActiveTab}
              variant="minimal"
              size="compact"
              testID="tab-minimal"
            />
          </View>
        </View>

        {/* MemoPad 테스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. MemoPad 컴포넌트</Text>
          
          <View style={styles.memoContainer}>
            <Text style={styles.memoLabel}>기본 메모패드</Text>
            <MemoPad
              value={memoText}
              onChangeText={setMemoText}
              variant="default"
              size="regular"
              showWordCount={true}
              placeholder="생각을 적어보세요..."
              testID="memo-default"
            />
          </View>

          <View style={styles.memoContainer}>
            <Text style={styles.memoLabel}>신비로운 메모패드 (저장 기능)</Text>
            <MemoPad
              value=""
              onChangeText={() => {}}
              variant="mystical"
              size="compact"
              showWordCount={true}
              showTimestamp={true}
              onSave={handleMemoSave}
              placeholder="타로 해석을 기록해보세요..."
              testID="memo-mystical"
            />
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['6xl'],
  },

  header: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
    marginBottom: spacing['3xl'],
  },

  title: {
    fontSize: typography.size.displayLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  section: {
    marginBottom: spacing['4xl'],
  },

  sectionTitle: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing['2xl'],
    paddingLeft: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.main,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    flexWrap: 'wrap',
    gap: spacing.lg,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    flexWrap: 'wrap',
    gap: spacing.lg,
  },

  tabContainer: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.card.background,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.medium,
  },

  tabLabel: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  memoContainer: {
    marginBottom: spacing['3xl'],
  },

  memoLabel: {
    fontSize: typography.size.bodyMedium,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  bottomSpace: {
    height: spacing['6xl'],
  },
});

export default ComponentTestScreen;