/**
 * TarotSessionContext.tsx - 일일 타로 세션 상태 관리 컨텍스트
 * Timer 화면에서 사용할 24시간 타로 카드 세션 관리
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  ReactNode,
  useEffect 
} from 'react';
import { useDailyTarotStore, dailyTarotActions } from '@/stores';

// 시간별 카드 데이터 타입
export interface HourCard {
  id: string;
  hour: number;
  cardKey: string;
  cardName: string;
  keywords: string[];
  isRevealed: boolean;
  revealedAt?: string;
  memo?: string;
}

// 세션 상태 타입
export interface TarotSessionState {
  // 현재 세션 정보
  sessionId: string | null;
  sessionDate: string;
  isSessionActive: boolean;
  
  // 현재 시간 및 카드
  currentHour: number;
  currentCard: HourCard | null;
  
  // 24시간 카드 배열
  hourCards: HourCard[];
  
  // 세션 통계
  totalRevealed: number;
  completionRate: number;
  
  // UI 상태
  isLoading: boolean;
  error: string | null;
  
  // 설정
  autoReveal: boolean;
  showProgress: boolean;
}

// 액션 타입
export type TarotSessionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SESSION'; payload: { sessionId: string; sessionDate: string } }
  | { type: 'SET_CURRENT_HOUR'; payload: number }
  | { type: 'SET_HOUR_CARDS'; payload: HourCard[] }
  | { type: 'REVEAL_CARD'; payload: { hour: number; revealedAt: string } }
  | { type: 'UPDATE_MEMO'; payload: { hour: number; memo: string } }
  | { type: 'SET_AUTO_REVEAL'; payload: boolean }
  | { type: 'SET_SHOW_PROGRESS'; payload: boolean }
  | { type: 'RESET_SESSION' };

// 초기 상태
const initialState: TarotSessionState = {
  sessionId: null,
  sessionDate: new Date().toISOString().split('T')[0],
  isSessionActive: false,
  currentHour: new Date().getHours(),
  currentCard: null,
  hourCards: [],
  totalRevealed: 0,
  completionRate: 0,
  isLoading: false,
  error: null,
  autoReveal: true,
  showProgress: true,
};

// 리듀서
function tarotSessionReducer(state: TarotSessionState, action: TarotSessionAction): TarotSessionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_SESSION':
      return { 
        ...state, 
        sessionId: action.payload.sessionId,
        sessionDate: action.payload.sessionDate,
        isSessionActive: true 
      };
      
    case 'SET_CURRENT_HOUR':
      const newHour = action.payload;
      const newCurrentCard = state.hourCards.find(card => card.hour === newHour) || null;
      return { 
        ...state, 
        currentHour: newHour,
        currentCard: newCurrentCard 
      };
      
    case 'SET_HOUR_CARDS':
      const cards = action.payload;
      const revealed = cards.filter(card => card.isRevealed).length;
      const currentCard = cards.find(card => card.hour === state.currentHour) || null;
      
      return { 
        ...state, 
        hourCards: cards,
        totalRevealed: revealed,
        completionRate: Math.round((revealed / 24) * 100),
        currentCard 
      };
      
    case 'REVEAL_CARD':
      const updatedCards = state.hourCards.map(card => 
        card.hour === action.payload.hour 
          ? { ...card, isRevealed: true, revealedAt: action.payload.revealedAt }
          : card
      );
      const newRevealed = updatedCards.filter(card => card.isRevealed).length;
      
      return {
        ...state,
        hourCards: updatedCards,
        totalRevealed: newRevealed,
        completionRate: Math.round((newRevealed / 24) * 100),
        currentCard: state.currentCard?.hour === action.payload.hour 
          ? { ...state.currentCard, isRevealed: true, revealedAt: action.payload.revealedAt }
          : state.currentCard
      };
      
    case 'UPDATE_MEMO':
      const cardsWithMemo = state.hourCards.map(card =>
        card.hour === action.payload.hour
          ? { ...card, memo: action.payload.memo }
          : card
      );
      
      return {
        ...state,
        hourCards: cardsWithMemo,
        currentCard: state.currentCard?.hour === action.payload.hour
          ? { ...state.currentCard, memo: action.payload.memo }
          : state.currentCard
      };
      
    case 'SET_AUTO_REVEAL':
      return { ...state, autoReveal: action.payload };
      
    case 'SET_SHOW_PROGRESS':
      return { ...state, showProgress: action.payload };
      
    case 'RESET_SESSION':
      return { ...initialState, currentHour: new Date().getHours() };
      
    default:
      return state;
  }
}

// 컨텍스트 타입
interface TarotSessionContextType {
  state: TarotSessionState;
  dispatch: React.Dispatch<TarotSessionAction>;
  
  // 액션 함수들
  initializeSession: () => Promise<void>;
  revealCard: (hour: number) => Promise<void>;
  updateCardMemo: (hour: number, memo: string) => Promise<void>;
  navigateToHour: (hour: number) => void;
  refreshSession: () => Promise<void>;
  
  // 유틸리티
  getCardForHour: (hour: number) => HourCard | null;
  isCardRevealed: (hour: number) => boolean;
  getSessionProgress: () => { revealed: number; total: number; percentage: number };
}

// 컨텍스트 생성
const TarotSessionContext = createContext<TarotSessionContextType | null>(null);

// Provider
export function TarotSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tarotSessionReducer, initialState);
  const zustandStore = useDailyTarotStore();

  // 세션 초기화
  const initializeSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Zustand 스토어에서 오늘의 세션 로드
      await dailyTarotActions.initializeToday();
      
      const dailyState = zustandStore.getState();
      
      if (dailyState.todaySession) {
        // 세션 정보 설정
        dispatch({ 
          type: 'SET_SESSION', 
          payload: { 
            sessionId: dailyState.todaySession.id, 
            sessionDate: dailyState.todaySession.date 
          } 
        });

        // 시간별 카드 변환 및 설정
        const hourCards: HourCard[] = Array.from({ length: 24 }, (_, hour) => {
          const card = dailyState.todaySession?.cards.find(c => c.hour === hour);
          return {
            id: card?.id || `hour-${hour}`,
            hour,
            cardKey: card?.cardKey || '',
            cardName: card?.cardName || '미공개 카드',
            keywords: card?.keywords || [],
            isRevealed: !!card?.isRevealed,
            revealedAt: card?.revealedAt,
            memo: card?.memo,
          };
        });

        dispatch({ type: 'SET_HOUR_CARDS', payload: hourCards });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '세션을 초기화할 수 없습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [zustandStore]);

  // 카드 공개
  const revealCard = useCallback(async (hour: number) => {
    try {
      await dailyTarotActions.revealCardForHour(hour);
      dispatch({ 
        type: 'REVEAL_CARD', 
        payload: { hour, revealedAt: new Date().toISOString() } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '카드를 공개할 수 없습니다.' });
    }
  }, []);

  // 메모 업데이트
  const updateCardMemo = useCallback(async (hour: number, memo: string) => {
    try {
      await dailyTarotActions.updateCardMemo(hour, memo);
      dispatch({ type: 'UPDATE_MEMO', payload: { hour, memo } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '메모를 저장할 수 없습니다.' });
    }
  }, []);

  // 시간 네비게이션
  const navigateToHour = useCallback((hour: number) => {
    dispatch({ type: 'SET_CURRENT_HOUR', payload: hour });
  }, []);

  // 세션 새로고침
  const refreshSession = useCallback(async () => {
    await initializeSession();
  }, [initializeSession]);

  // 유틸리티 함수들
  const getCardForHour = useCallback((hour: number) => 
    state.hourCards.find(card => card.hour === hour) || null, [state.hourCards]);

  const isCardRevealed = useCallback((hour: number) => 
    state.hourCards.some(card => card.hour === hour && card.isRevealed), [state.hourCards]);

  const getSessionProgress = useCallback(() => ({
    revealed: state.totalRevealed,
    total: 24,
    percentage: state.completionRate
  }), [state.totalRevealed, state.completionRate]);

  // 시간 변경 감지 및 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      if (currentHour !== state.currentHour) {
        dispatch({ type: 'SET_CURRENT_HOUR', payload: currentHour });
        
        // 자동 공개 설정이 켜져있다면 새로운 시간의 카드 공개
        if (state.autoReveal && !isCardRevealed(currentHour)) {
          revealCard(currentHour);
        }
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [state.currentHour, state.autoReveal, isCardRevealed, revealCard]);

  const contextValue: TarotSessionContextType = {
    state,
    dispatch,
    initializeSession,
    revealCard,
    updateCardMemo,
    navigateToHour,
    refreshSession,
    getCardForHour,
    isCardRevealed,
    getSessionProgress,
  };

  return (
    <TarotSessionContext.Provider value={contextValue}>
      {children}
    </TarotSessionContext.Provider>
  );
}

// 커스텀 훅
export function useTarotSession() {
  const context = useContext(TarotSessionContext);
  if (!context) {
    throw new Error('useTarotSession must be used within a TarotSessionProvider');
  }
  return context;
}

// 개별 상태 접근 훅들 (성능 최적화)
export function useTarotSessionState() {
  const { state } = useTarotSession();
  return state;
}

export function useTarotSessionActions() {
  const { 
    initializeSession, 
    revealCard, 
    updateCardMemo, 
    navigateToHour, 
    refreshSession 
  } = useTarotSession();
  
  return {
    initializeSession,
    revealCard,
    updateCardMemo,
    navigateToHour,
    refreshSession,
  };
}

export function useCurrentCard() {
  const { state, getCardForHour } = useTarotSession();
  return {
    currentCard: state.currentCard,
    currentHour: state.currentHour,
    getCardForHour,
  };
}

export default TarotSessionContext;