/**
 * Extension Filter Dashboard
 * React component for monitoring and debugging the service worker extension filter
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, CardHeader, CardContent, Button, Text } from '@/components/ui';
import { theme } from '@/constants';

interface ExtensionStats {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  blockRate: string;
  uptime: string;
  extensionTypes: Record<string, number>;
  topBlockedIds: Record<string, number>;
  topExtensionTypes: [string, number][];
  topBlockedExtensions: [string, number][];
  lastReset: string;
  startTime: string;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

export function ExtensionFilterDashboard() {
  const [stats, setStats] = useState<ExtensionStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');

  // Service Worker communication helper
  const sendServiceWorkerMessage = useCallback(async (command: string, data?: any) => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
      throw new Error('No active service worker');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      messageChannel.port1.onerror = (error: any) => {
        reject(error);
      };

      registration.active?.postMessage({
        type: 'EXTENSION_FILTER_COMMAND',
        command,
        ...data
      }, [messageChannel.port2]);

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Service Worker communication timeout'));
      }, 5000);
    });
  }, []);

  // Load stats from service worker
  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await sendServiceWorkerMessage('getStats') as any;
      if (response.type === 'EXTENSION_FILTER_STATS') {
        setStats(response.data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to load extension filter stats:', error);
      Alert.alert('Error', 'Failed to load extension filter statistics');
    } finally {
      setIsLoading(false);
    }
  }, [sendServiceWorkerMessage]);

  // Load logs from service worker
  const loadLogs = useCallback(async (limit = 50) => {
    try {
      const response = await sendServiceWorkerMessage('getLogs', { limit }) as any;
      if (response.type === 'EXTENSION_FILTER_LOGS') {
        setLogs(response.data);
      }
    } catch (error) {
      console.error('Failed to load extension filter logs:', error);
      Alert.alert('Error', 'Failed to load extension filter logs');
    }
  }, [sendServiceWorkerMessage]);

  // Reset stats in service worker
  const resetStats = useCallback(async () => {
    try {
      await sendServiceWorkerMessage('resetStats');
      await loadStats();
      Alert.alert('Success', 'Extension filter statistics reset successfully');
    } catch (error) {
      console.error('Failed to reset extension filter stats:', error);
      Alert.alert('Error', 'Failed to reset extension filter statistics');
    }
  }, [sendServiceWorkerMessage, loadStats]);

  // Test URL analysis
  const testUrlAnalysis = useCallback(async () => {
    if (!testUrl.trim()) {
      Alert.alert('Error', 'Please enter a URL to test');
      return;
    }

    try {
      const response = await sendServiceWorkerMessage('testUrl', { url: testUrl }) as any;
      if (response.type === 'EXTENSION_FILTER_TEST') {
        setTestResult(response.data);
      }
    } catch (error) {
      console.error('Failed to test URL:', error);
      Alert.alert('Error', 'Failed to test URL');
    }
  }, [testUrl, sendServiceWorkerMessage]);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    loadStats();
    loadLogs();

    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadStats, loadLogs]);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return theme.colors.error;
      case 'warn': return theme.colors.warning;
      case 'info': return theme.colors.info;
      case 'debug': return theme.colors.textSecondary;
      default: return theme.colors.text;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <Card variant="premium" size="medium" style={styles.headerCard}>
        <CardHeader>
          <Text variant="title2" color={theme.colors.text} style={styles.title}>
            🛡️ Extension Filter Dashboard
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            Monitor and debug Chrome extension blocking
          </Text>
        </CardHeader>
        <CardContent>
          <View style={styles.headerActions}>
            <Button
              title="Refresh Stats"
              variant="primary"
              size="small"
              onPress={loadStats}
              disabled={isLoading}
            />
            <Button
              title="Reset Stats"
              variant="secondary"
              size="small"
              onPress={resetStats}
            />
          </View>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.lastUpdate}>
            Last updated: {lastUpdate}
          </Text>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card variant="default" size="medium" style={styles.statsCard}>
          <CardHeader title="📊 Filter Statistics" />
          <CardContent>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="title3" color={theme.colors.premiumGold}>
                  {stats.totalRequests}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Total Requests
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="title3" color={theme.colors.error}>
                  {stats.blockedRequests}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Blocked
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="title3" color={theme.colors.success}>
                  {stats.allowedRequests}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Allowed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="title3" color={theme.colors.info}>
                  {stats.blockRate}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Block Rate
                </Text>
              </View>
            </View>
            
            <View style={styles.additionalStats}>
              <Text variant="body" color={theme.colors.text}>
                Uptime: {stats.uptime}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Started: {formatTimestamp(stats.startTime)}
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Top Blocked Extensions */}
      {stats && stats.topBlockedExtensions && stats.topBlockedExtensions.length > 0 && (
        <Card variant="elevated" size="medium" style={styles.topBlockedCard}>
          <CardHeader title="🚫 Top Blocked Extensions" />
          <CardContent>
            {stats.topBlockedExtensions.slice(0, 5).map(([extensionId, count], index) => (
              <View key={extensionId} style={styles.blockedExtensionItem}>
                <View style={styles.blockedExtensionInfo}>
                  <Text variant="body" color={theme.colors.text} numberOfLines={1}>
                    {extensionId}
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    ID: {extensionId.substring(0, 16)}...
                  </Text>
                </View>
                <View style={styles.blockedExtensionCount}>
                  <Text variant="title3" color={theme.colors.error}>
                    {count}
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    requests
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      {/* URL Tester */}
      <Card variant="mystical" size="medium" style={styles.testerCard}>
        <CardHeader title="🔍 URL Tester" />
        <CardContent>
          <View style={styles.urlTesterContainer}>
            <Text variant="body" color={theme.colors.text} style={styles.testerLabel}>
              Test URL for extension detection:
            </Text>
            {/* Note: In a real React Native app, you'd use TextInput */}
            <View style={styles.urlInputContainer}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                URL Input (TextInput placeholder)
              </Text>
            </View>
            <Button
              title="Analyze URL"
              variant="primary"
              size="medium"
              onPress={testUrlAnalysis}
              style={styles.testButton}
            />
          </View>
          
          {testResult && (
            <View style={styles.testResultContainer}>
              <Text variant="title3" color={theme.colors.text}>
                Analysis Result:
              </Text>
              <View style={styles.testResultItem}>
                <Text variant="body" color={testResult.shouldBlock ? theme.colors.error : theme.colors.success}>
                  {testResult.shouldBlock ? '🚫 BLOCKED' : '✅ ALLOWED'}
                </Text>
              </View>
              <View style={styles.testResultItem}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Reason: {testResult.reason}
                </Text>
              </View>
              <View style={styles.testResultItem}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Confidence: {testResult.confidence}%
                </Text>
              </View>
              {testResult.extensionType && (
                <View style={styles.testResultItem}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Type: {testResult.extensionType}
                  </Text>
                </View>
              )}
            </View>
          )}
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card variant="default" size="medium" style={styles.logsCard}>
        <CardHeader>
          <View style={styles.logsHeader}>
            <Text variant="title3" color={theme.colors.text}>
              📝 Recent Filter Logs
            </Text>
            <Button
              title="Refresh"
              variant="ghost"
              size="small"
              onPress={() => loadLogs(50)}
            />
          </View>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <Text variant="body" color={theme.colors.textSecondary} style={styles.noLogsText}>
              No logs available
            </Text>
          ) : (
            <View style={styles.logsContainer}>
              {logs.slice(0, 10).map((log, index) => (
                <View key={index} style={styles.logEntry}>
                  <View style={styles.logHeader}>
                    <Text variant="caption" color={getLogLevelColor(log.level)} style={styles.logLevel}>
                      [{log.level.toUpperCase()}]
                    </Text>
                    <Text variant="caption" color={theme.colors.textTertiary} style={styles.logTimestamp}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text variant="caption" color={theme.colors.textSecondary} style={styles.logMessage}>
                    {log.message}
                  </Text>
                  {log.data && (
                    <Text variant="caption" color={theme.colors.textTertiary} style={styles.logData}>
                      {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : log.data}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  headerCard: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  lastUpdate: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: theme.spacing.sm,
  },
  additionalStats: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  
  topBlockedCard: {
    marginBottom: theme.spacing.lg,
  },
  blockedExtensionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  blockedExtensionInfo: {
    flex: 1,
  },
  blockedExtensionCount: {
    alignItems: 'center',
    minWidth: 60,
  },
  
  testerCard: {
    marginBottom: theme.spacing.lg,
  },
  urlTesterContainer: {
    marginBottom: theme.spacing.md,
  },
  testerLabel: {
    marginBottom: theme.spacing.sm,
  },
  urlInputContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  testButton: {
    alignSelf: 'center',
  },
  testResultContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  testResultItem: {
    marginBottom: theme.spacing.xs,
  },
  
  logsCard: {
    marginBottom: theme.spacing.xl,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logsContainer: {
    maxHeight: 400,
  },
  noLogsText: {
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
  },
  logEntry: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  logLevel: {
    fontWeight: '600',
  },
  logTimestamp: {
    fontSize: 10,
  },
  logMessage: {
    lineHeight: 16,
    marginBottom: theme.spacing.xs,
  },
  logData: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
});