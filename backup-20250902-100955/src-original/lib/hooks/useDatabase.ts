/**
 * Database hooks for easy access to database operations
 */

import { useEffect, useState } from 'react';
import { databaseService } from '../database';
import { useDatabase as useDatabaseContext } from '../database/DatabaseProvider';
import { 
  DailySession, 
  DailyCard, 
  Spread, 
  Setting 
} from '../database/types';

/**
 * Hook for daily tarot operations
 */
export function useDailyTarot() {
  const { isReady } = useDatabaseContext();
  const [todaySession, setTodaySession] = useState<DailySession | null>(null);
  const [todayCards, setTodayCards] = useState<DailyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodaySession = async () => {
    if (!isReady) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const session = await databaseService.dailyTarot.getTodaySession();
      const cards = await databaseService.dailyTarot.getCardsBySession(session.id);
      
      setTodaySession(session);
      setTodayCards(cards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load today session';
      console.error('Failed to load today session:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCardMemo = async (cardId: number, memo: string) => {
    try {
      await databaseService.dailyTarot.updateCard({ id: cardId, memo });
      // Reload cards to get updated data
      if (todaySession) {
        const cards = await databaseService.dailyTarot.getCardsBySession(todaySession.id);
        setTodayCards(cards);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update memo';
      console.error('Failed to update card memo:', errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    loadTodaySession();
  }, [isReady]);

  return {
    todaySession,
    todayCards,
    isLoading,
    error,
    reload: loadTodaySession,
    updateCardMemo
  };
}

/**
 * Hook for spread operations
 */
export function useSpreads() {
  const { isReady } = useDatabaseContext();
  const [spreads, setSpreads] = useState<Spread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpreads = async (limit = 20) => {
    if (!isReady) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const recentSpreads = await databaseService.spreads.getRecentSpreads(limit);
      setSpreads(recentSpreads);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load spreads';
      console.error('Failed to load spreads:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpread = async (id: number) => {
    try {
      await databaseService.spreads.deleteSpread(id);
      // Remove from local state
      setSpreads(prev => prev.filter(spread => spread.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete spread';
      console.error('Failed to delete spread:', errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    loadSpreads();
  }, [isReady]);

  return {
    spreads,
    isLoading,
    error,
    reload: loadSpreads,
    deleteSpread
  };
}

/**
 * Hook for app settings
 */
export function useSettings() {
  const { isReady } = useDatabaseContext();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    if (!isReady) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const allSettings = await databaseService.settings.getAllSettings();
      const settingsMap = allSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      
      setSettings(settingsMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      console.error('Failed to load settings:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await databaseService.settings.setSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update setting';
      console.error('Failed to update setting:', errorMessage);
      setError(errorMessage);
    }
  };

  const getSetting = (key: string, defaultValue = ''): string => {
    return settings[key] || defaultValue;
  };

  const getBooleanSetting = (key: string, defaultValue = false): boolean => {
    const value = settings[key];
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  };

  useEffect(() => {
    loadSettings();
  }, [isReady]);

  return {
    settings,
    isLoading,
    error,
    getSetting,
    getBooleanSetting,
    updateSetting,
    reload: loadSettings
  };
}

/**
 * Hook for database statistics
 */
export function useDatabaseStats() {
  const { isReady } = useDatabaseContext();
  const [stats, setStats] = useState<{
    totalSessions: number;
    totalSpreads: number;
    totalMemos: number;
    recentActivity: number;
  }>({
    totalSessions: 0,
    totalSpreads: 0,
    totalMemos: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    if (!isReady) return;
    
    try {
      setIsLoading(true);
      
      // Get session count
      const sessionsResult = await databaseService.getConnection().queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM daily_sessions'
      );
      
      // Get spread count
      const spreadsResult = await databaseService.getConnection().queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM spreads'
      );
      
      // Get memos count
      const memosResult = await databaseService.getConnection().queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM daily_cards WHERE memo IS NOT NULL AND memo != ""'
      );
      
      // Get recent activity (last 7 days)
      const recentResult = await databaseService.getConnection().queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM daily_sessions 
         WHERE created_at >= datetime('now', '-7 days')`
      );
      
      setStats({
        totalSessions: sessionsResult?.count || 0,
        totalSpreads: spreadsResult?.count || 0,
        totalMemos: memosResult?.count || 0,
        recentActivity: recentResult?.count || 0
      });
    } catch (err) {
      console.error('Failed to load database stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [isReady]);

  return {
    stats,
    isLoading,
    reload: loadStats
  };
}