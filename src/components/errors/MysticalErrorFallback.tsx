/**
 * 신비로운 테마의 에러 폴백 UI 컴포넌트
 * 타로 앱의 신비로운 분위기를 유지하면서 사용자에게 친화적인 에러 화면 제공
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import { type SanitizedError } from '@/lib/errorHandling/SecureErrorHandler';

interface MysticalErrorFallbackProps {
  error: SanitizedError;
  onRetry: () => void;
  onReport: () => void;
  onReset: () => void;
  retryCount?: number;
  maxRetries?: number;
}

const { width, height } = Dimensions.get('window');

export const MysticalErrorFallback: React.FC<MysticalErrorFallbackProps> = ({
  error,
  onRetry,
  onReport,
  onReset,
  retryCount = 0,
  maxRetries = 3,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [particleOpacity] = useState(new Animated.Value(0.3));

  // 진입 애니메이션
  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(particleOpacity, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(particleOpacity, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [animatedValue, particleOpacity]);

  // 에러 타입별 메시지 생성
  const getErrorMessage = useCallback(() => {
    const messages = {
      network: {
        title: '연결의 실이 끊어졌습니다',
        description: '신비로운 에너지의 흐름이 일시적으로 방해받고 있습니다.\n잠시 후 다시 시도해보세요.',
        icon: '🌐',
        advice: '네트워크 연결을 확인해보세요',
      },
      runtime: {
        title: '예상치 못한 신비한 현상',
        description: '카드들이 예기치 못한 움직임을 보이고 있습니다.\n잠깐 쉬었다가 다시 시도해보세요.',
        icon: '🔮',
        advice: '앱을 새로고침하면 해결될 수 있습니다',
      },
      validation: {
        title: '입력된 에너지가 불안정합니다',
        description: '제공된 정보에 문제가 있는 것 같습니다.\n다시 한 번 확인해주세요.',
        icon: '⚠️',
        advice: '입력한 정보를 다시 확인해보세요',
      },
      security: {
        title: '보호막이 활성화되었습니다',
        description: '안전을 위해 일시적으로 접근이 제한되었습니다.\n잠시 후 다시 시도해주세요.',
        icon: '🛡️',
        advice: '보안상 이유로 접근이 제한되었습니다',
      },
      unknown: {
        title: '알 수 없는 신비한 힘',
        description: '예상치 못한 상황이 발생했습니다.\n타로의 신비로운 힘이 일시적으로 불안정한 것 같습니다.',
        icon: '✨',
        advice: '잠시 후 다시 시도해보세요',
      },
    };

    return messages[error.type] || messages.unknown;
  }, [error.type]);

  const errorInfo = getErrorMessage();
  const canRetry = retryCount < maxRetries && error.recovered;

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getSeverityColor = (severity: SanitizedError['severity']) => {
    switch (severity) {
      case 'critical':
        return '#ff4757';
      case 'high':
        return '#ffa726';
      case 'medium':
        return '#ffeb3b';
      case 'low':
        return '#66bb6a';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getSeverityText = (severity: SanitizedError['severity']) => {
    switch (severity) {
      case 'critical':
        return '심각';
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '알 수 없음';
    }
  };

  return (
    <View style={styles.container}>
      {/* 신비로운 배경 파티클 */}
      <Animated.View style={[styles.particleContainer, { opacity: particleOpacity }]}>
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${(i * 16 + 10) % 100}%`,
                top: `${(i * 23 + 15) % 100}%`,
                transform: [
                  {
                    rotate: `${i * 60}deg`,
                  },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* 메인 컨텐츠 */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: animatedValue,
          },
        ]}
      >
        {/* 아이콘과 타이틀 */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{errorInfo.icon}</Text>
          </View>
          <Text variant="title2" style={styles.title}>
            {errorInfo.title}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.description}>
            {errorInfo.description}
          </Text>
        </View>

        {/* 심각도 표시 */}
        <View style={styles.severityContainer}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(error.severity) + '20' }]}>
            <View style={[styles.severityDot, { backgroundColor: getSeverityColor(error.severity) }]} />
            <Text style={[styles.severityText, { color: getSeverityColor(error.severity) }] as any}>
              심각도: {getSeverityText(error.severity)}
            </Text>
          </View>
        </View>

        {/* 조언 메시지 */}
        <View style={styles.adviceContainer}>
          <Text variant="body" color={theme.colors.premiumGold} style={styles.advice}>
            💡 {errorInfo.advice}
          </Text>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actions}>
          {canRetry && (
            <Button
              title={`다시 시도 (${maxRetries - retryCount}회 남음)`}
              variant="primary"
              onPress={onRetry}
              style={[styles.button, styles.retryButton]}
            />
          )}

          <View style={styles.secondaryActions}>
            {error.reportable && (
              <Button
                title="문제 신고"
                variant="outline"
                onPress={onReport}
                style={[styles.button, styles.secondaryButton]}
              />
            )}
            
            <Button
              title="앱 재시작"
              variant="outline"
              onPress={onReset}
              style={[styles.button, styles.secondaryButton]}
            />
          </View>
        </View>

        {/* 상세 정보 토글 */}
        <TouchableOpacity 
          style={styles.detailsToggle} 
          onPress={toggleDetails}
          activeOpacity={0.7}
        >
          <Text variant="caption" color={theme.colors.textSecondary}>
            {showDetails ? '상세 정보 숨기기' : '상세 정보 보기'} {showDetails ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* 상세 정보 (개발 환경 또는 토글 시) */}
        {showDetails && (
          <Animated.View style={styles.detailsContainer}>
            <View style={styles.detailsContent}>
              <Text variant="caption" style={styles.detailsTitle}>기술적 세부사항:</Text>
              
              <View style={styles.detailRow}>
                <Text variant="caption" color={theme.colors.textSecondary}>에러 ID:</Text>
                <Text variant="caption" color={theme.colors.text} selectable>
                  {error.id}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="caption" color={theme.colors.textSecondary}>유형:</Text>
                <Text variant="caption" color={theme.colors.text}>
                  {error.type}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="caption" color={theme.colors.textSecondary}>카테고리:</Text>
                <Text variant="caption" color={theme.colors.text}>
                  {error.category}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="caption" color={theme.colors.textSecondary}>시간:</Text>
                <Text variant="caption" color={theme.colors.text}>
                  {new Date(error.timestamp).toLocaleString('ko-KR')}
                </Text>
              </View>

              {__DEV__ && error.sanitizedStack && (
                <View style={styles.stackContainer}>
                  <Text variant="caption" style={styles.detailsTitle}>스택 트레이스:</Text>
                  <Text variant="caption" color={theme.colors.textSecondary} style={styles.stackTrace}>
                    {error.sanitizedStack}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* 푸터 메시지 */}
        <View style={styles.footer}>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.footerText}>
            "모든 어려움은 새로운 지혜로 이어지는 길입니다" ✨
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.footerText}>
            문제가 지속되면 앱을 다시 시작해보세요
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.premiumGold + '40',
    shadowColor: theme.colors.premiumGold,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    margin: theme.spacing.lg,
    maxWidth: 400,
    width: '90%',
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.premiumGold + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.premiumGold + '40',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.premiumGold,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  severityContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  adviceContainer: {
    backgroundColor: theme.colors.premiumGold + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.premiumGold,
  },
  advice: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    minHeight: 48,
  },
  retryButton: {
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    flex: 1,
  },
  detailsToggle: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  detailsContainer: {
    marginBottom: theme.spacing.lg,
  },
  detailsContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailsTitle: {
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },
  stackContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stackTrace: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    maxHeight: 100,
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
});

export default MysticalErrorFallback;