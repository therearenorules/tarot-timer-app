import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { GradientBackground } from '../components/ui';
import { colors, typography, spacing, radius } from '../constants/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

export interface WelcomeScreenProps {
  onStartTimer: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTimer }) => {
  return (
    <GradientBackground variant="main" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔮</Text>
          </View>
          <Text style={styles.title}>Tarot Timer</Text>
          <Text style={styles.subtitle}>24시간 타로 여정을 시작하세요</Text>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📚</Text>
            </View>
            <Text style={styles.cardTitle}>24시간의 신비로운 여정</Text>
            <Text style={styles.cardDescription}>
              하루 24시간, 각 시간마다의 특별한 메시지를 담은{'\n'}
              타로카드를 뽑아보세요.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={onStartTimer}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>24시간 타로 뽑기</Text>
          </TouchableOpacity>
        </View>

        {/* Mystical Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "별들이 속삭이는 비밀을 들어보세요. 당신의 운명이 펼쳐집니다."
          </Text>
        </View>

        {/* Bottom Navigation Space */}
        <View style={styles.bottomSpace} />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(244, 208, 63, 0.2)',
    borderWidth: 2,
    borderColor: '#f4d03f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    ...typography.styles.displayLarge,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.styles.bodyLarge,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing['3xl'],
    marginHorizontal: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(244, 208, 63, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    ...typography.styles.titleLarge,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  cardDescription: {
    ...typography.styles.bodyMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#f4d03f',
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    shadowColor: '#f4d03f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    ...typography.styles.bodyLarge,
    color: '#0f0f1a',
    fontWeight: '600',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing['2xl'],
    marginHorizontal: spacing.sm,
  },
  quote: {
    ...typography.styles.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 120, // Space for bottom navigation
  },
});

export default WelcomeScreen;