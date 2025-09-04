/**
 * 중앙 상태 관리 스토어
 * Zustand 기반 앱 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Slices
import { createTimerSlice, type TimerSlice } from './slices/timerSlice';
import { createTarotSlice, type TarotSlice } from './slices/tarotSlice';
import { createJournalSlice, type JournalSlice } from './slices/journalSlice';
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';

// Storage
import { mmkvStorage } from '../services/storage';

// ===== 앱 스토어 인터페이스 =====
export interface AppStore extends 
  TimerSlice,
  TarotSlice, 
  JournalSlice,
  SettingsSlice,
  UiSlice {
  
  // 전역 액션들
  initialize: () => Promise<void>;
  reset: () => void;
  isInitialized: boolean;
}

/**
 * 메인 앱 스토어 생성
 * 모든 슬라이스를 결합하고 미들웨어 적용
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get, api) => ({
        // 초기화 상태
        isInitialized: false,

        // 슬라이스들 통합
        ...createTimerSlice(set, get, api),
        ...createTarotSlice(set, get, api),
        ...createJournalSlice(set, get, api),
        ...createSettingsSlice(set, get, api),
        ...createUiSlice(set, get, api),

        // 전역 액션들
        initialize: async () => {
          try {
            // 각 슬라이스 초기화
            await get().initializeTimer?.();
            await get().initializeTarot?.();
            await get().initializeJournal?.();
            await get().initializeSettings?.();
            
            set((state) => {
              state.isInitialized = true;
            });
          } catch (error) {
            console.error('Store initialization failed:', error);
            throw error;
          }
        },

        reset: () => {
          set((state) => {
            // 모든 상태를 초기값으로 리셋
            const initialState = create<AppStore>()(
              immer((set, get, api) => ({
                isInitialized: false,
                ...createTimerSlice(set, get, api),
                ...createTarotSlice(set, get, api),
                ...createJournalSlice(set, get, api),
                ...createSettingsSlice(set, get, api),
                ...createUiSlice(set, get, api),
                initialize: async () => {},
                reset: () => {},
              }))
            ).getState();

            Object.assign(state, initialState);
          });
        },
      })),
      {
        name: 'tarot-timer-storage',
        storage: {
          getItem: (name: string) => mmkvStorage.get(name),
          setItem: (name: string, value: string) => mmkvStorage.set(name, value),
          removeItem: (name: string) => mmkvStorage.delete(name),
        },
        // 중요한 데이터만 영속화
        partialize: (state) => ({
          timer: state.timer,
          tarot: {
            dailyCards: state.tarot.dailyCards,
            savedReadings: state.tarot.savedReadings,
            lastGeneratedDate: state.tarot.lastGeneratedDate,
          },
          journal: {
            entries: state.journal.entries,
            savedSpreads: state.journal.savedSpreads,
          },
          settings: state.settings,
          // UI 상태는 영속화하지 않음 (세션별로 초기화)
        }),
        version: 1,
        migrate: (persistedState, version) => {
          // 스토어 구조 변경 시 마이그레이션 로직
          if (version === 0) {
            // v0 → v1 마이그레이션 예시
            return persistedState;
          }
          return persistedState as AppStore;
        },
      }
    ),
    {
      name: 'TarotTimer',
      enabled: __DEV__, // 개발 환경에서만 devtools 활성화
    }
  )
);

// 편의를 위한 개별 선택자들
export const useTimerState = () => useAppStore((state) => state.timer);
export const useTarotState = () => useAppStore((state) => state.tarot);
export const useJournalState = () => useAppStore((state) => state.journal);
export const useSettingsState = () => useAppStore((state) => state.settings);
export const useUiState = () => useAppStore((state) => state.ui);

// 액션들을 위한 선택자들
export const useTimerActions = () => useAppStore((state) => ({
  startTimer: state.startTimer,
  stopTimer: state.stopTimer,
  pauseTimer: state.pauseTimer,
  resetTimer: state.resetTimer,
  updateCurrentCard: state.updateCurrentCard,
}));

export const useTarotActions = () => useAppStore((state) => ({
  generateDailyCards: state.generateDailyCards,
  saveReading: state.saveReading,
  loadReading: state.loadReading,
  deleteReading: state.deleteReading,
}));

export const useJournalActions = () => useAppStore((state) => ({
  addEntry: state.addEntry,
  updateEntry: state.updateEntry,
  deleteEntry: state.deleteEntry,
  saveSpreads: state.saveSpread,
}));

export const useSettingsActions = () => useAppStore((state) => ({
  updateLanguage: state.updateLanguage,
  updateTheme: state.updateTheme,
  updateNotifications: state.updateNotifications,
  resetSettings: state.resetSettings,
}));

export const useUiActions = () => useAppStore((state) => ({
  setActiveTab: state.setActiveTab,
  showModal: state.showModal,
  hideModal: state.hideModal,
  setLoading: state.setLoading,
  showNotification: state.showNotification,
}));