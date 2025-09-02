// src/components/dev/DevPanel.tsx - 개발 전용 디버깅 패널
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Switch,
  Modal,
  Platform 
} from 'react-native';
import { isDev, tarotDevConfig, performanceUtils, tarotLog } from '@/lib/devMode';
import { theme } from '@/constants';

interface DevPanelState {
  visible: boolean;
  logs: Array<{ type: string; message: string; timestamp: number }>;
  activeTab: 'config' | 'performance' | 'logs' | 'tools';
}

export function DevPanel() {
  const [state, setState] = useState<DevPanelState>({
    visible: false,
    logs: [],
    activeTab: 'config',
  });
  
  const [config, setConfig] = useState({ ...tarotDevConfig });

  // 개발 모드가 아니면 렌더링하지 않음
  if (!isDev) return null;

  useEffect(() => {
    // 콘솔 로그 캐치 (개발 환경에서만)
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args.join(' '));
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args.join(' '));
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args.join(' '));
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const addLog = (type: string, message: string) => {
    setState(prev => ({
      ...prev,
      logs: [
        { type, message, timestamp: Date.now() },
        ...prev.logs.slice(0, 99) // 최대 100개 로그 유지
      ],
    }));
  };

  const toggleConfig = (key: keyof typeof tarotDevConfig) => {
    const newValue = !config[key];
    setConfig(prev => ({ ...prev, [key]: newValue }));
    (tarotDevConfig as any)[key] = newValue;
    tarotLog.mysticalEffect(`설정 변경: ${key}`, 0);
  };

  const clearLogs = () => {
    setState(prev => ({ ...prev, logs: [] }));
  };

  const generateTestCard = () => {
    const testCards = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress'];
    const randomCard = testCards[Math.floor(Math.random() * testCards.length)];
    const currentHour = new Date().getHours();
    
    tarotLog.cardGenerated(randomCard!, currentHour);
    performanceUtils.logTarotEvent('테스트 카드 생성', { card: randomCard, hour: currentHour });
  };

  const simulateHourChange = () => {
    const oldHour = new Date().getHours();
    const newHour = (oldHour + 1) % 24;
    tarotLog.hourChanged(oldHour, newHour);
  };

  const testMysticalEffect = () => {
    const effects = ['✨ 반짝임', '🌟 별빛', '💫 소용돌이', '🔮 오라'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    tarotLog.mysticalEffect(randomEffect!, Math.random() * 2000);
  };

  const renderConfigTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>성능 설정</Text>
      {Object.entries(config).map(([key, value]) => {
        if (typeof value !== 'boolean') return null;
        
        return (
          <View key={key} style={styles.configItem}>
            <Text style={styles.configLabel}>{key}</Text>
            <Switch
              value={value}
              onValueChange={() => toggleConfig(key as keyof typeof tarotDevConfig)}
              trackColor={{ false: theme.colors.border, true: theme.colors.premiumGold + '40' }}
              thumbColor={value ? theme.colors.premiumGold : theme.colors.textSecondary}
            />
          </View>
        );
      })}
    </ScrollView>
  );

  const renderPerformanceTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>성능 도구</Text>
      
      <Pressable style={styles.toolButton} onPress={() => performanceUtils.startTimer('수동 측정')}>
        <Text style={styles.toolButtonText}>⏱️ 타이머 시작</Text>
      </Pressable>
      
      <Pressable style={styles.toolButton} onPress={() => performanceUtils.endTimer('수동 측정')}>
        <Text style={styles.toolButtonText}>⏹️ 타이머 중지</Text>
      </Pressable>
      
      {Platform.OS === 'web' && (
        <Pressable 
          style={styles.toolButton} 
          onPress={() => {
            if ((window.performance as any)?.memory) {
              const memory = (window.performance as any).memory;
              console.log('💾 메모리 사용량:', {
                used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
                total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
                limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
              });
            }
          }}
        >
          <Text style={styles.toolButtonText}>💾 메모리 확인</Text>
        </Pressable>
      )}
    </ScrollView>
  );

  const renderLogsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.logHeader}>
        <Text style={styles.sectionTitle}>로그 ({state.logs.length})</Text>
        <Pressable style={styles.clearButton} onPress={clearLogs}>
          <Text style={styles.clearButtonText}>지우기</Text>
        </Pressable>
      </View>
      
      <ScrollView style={styles.logContainer}>
        {state.logs.map((log, index) => (
          <View key={index} style={[
            styles.logItem,
            log.type === 'error' && styles.logError,
            log.type === 'warn' && styles.logWarning,
          ]}>
            <Text style={styles.logType}>{log.type.toUpperCase()}</Text>
            <Text style={styles.logMessage} numberOfLines={3}>
              {log.message}
            </Text>
            <Text style={styles.logTime}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderToolsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>타로 도구</Text>
      
      <Pressable style={styles.toolButton} onPress={generateTestCard}>
        <Text style={styles.toolButtonText}>🃏 테스트 카드 생성</Text>
      </Pressable>
      
      <Pressable style={styles.toolButton} onPress={simulateHourChange}>
        <Text style={styles.toolButtonText}>⏰ 시간 변경 시뮬레이션</Text>
      </Pressable>
      
      <Pressable style={styles.toolButton} onPress={testMysticalEffect}>
        <Text style={styles.toolButtonText}>✨ 신비 효과 테스트</Text>
      </Pressable>
      
      <Pressable 
        style={styles.toolButton} 
        onPress={() => {
          console.log('🔮 현재 타로 설정:', config);
        }}
      >
        <Text style={styles.toolButtonText}>⚙️ 설정 출력</Text>
      </Pressable>
    </ScrollView>
  );

  return (
    <>
      {/* 개발 패널 트리거 버튼 */}
      <Pressable
        style={styles.trigger}
        onPress={() => setState(prev => ({ ...prev, visible: true }))}
      >
        <Text style={styles.triggerText}>🔧</Text>
      </Pressable>

      {/* 개발 패널 모달 */}
      <Modal
        visible={state.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setState(prev => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.panel}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>🔮 타로 개발 도구</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setState(prev => ({ ...prev, visible: false }))}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {/* 탭 네비게이션 */}
            <View style={styles.tabBar}>
              {(['config', 'performance', 'logs', 'tools'] as const).map((tab) => (
                <Pressable
                  key={tab}
                  style={[
                    styles.tab,
                    state.activeTab === tab && styles.activeTab,
                  ]}
                  onPress={() => setState(prev => ({ ...prev, activeTab: tab }))}
                >
                  <Text style={[
                    styles.tabText,
                    state.activeTab === tab && styles.activeTabText,
                  ]}>
                    {tab === 'config' ? '설정' :
                     tab === 'performance' ? '성능' :
                     tab === 'logs' ? '로그' : '도구'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 탭 콘텐츠 */}
            {state.activeTab === 'config' && renderConfigTab()}
            {state.activeTab === 'performance' && renderPerformanceTab()}
            {state.activeTab === 'logs' && renderLogsTab()}
            {state.activeTab === 'tools' && renderToolsTab()}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.premiumGold,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  triggerText: {
    fontSize: 20,
    color: theme.colors.deepPurple,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mystical.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.premiumGold,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mystical.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.premiumGold,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.premiumGold,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  configLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  toolButton: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.mystical.border,
  },
  toolButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: theme.colors.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: theme.colors.error,
  },
  logContainer: {
    flex: 1,
  },
  logItem: {
    backgroundColor: theme.colors.surface,
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.textSecondary,
  },
  logError: {
    borderLeftColor: theme.colors.error,
  },
  logWarning: {
    borderLeftColor: theme.colors.warning,
  },
  logType: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  logMessage: {
    fontSize: 11,
    color: theme.colors.text,
    marginBottom: 4,
  },
  logTime: {
    fontSize: 9,
    color: theme.colors.textTertiary,
    textAlign: 'right',
  },
});