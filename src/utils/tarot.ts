// 타로 유틸리티 (UI Design 기반)
import { MAJOR_ARCANA } from './tarot-cards';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TarotCard {
  id: string;
  name: string;
  nameKr: string;
  suit?: 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  description: string;
  descriptionKr: string;
  keywords: string[];
  keywordsKr: string[];
  imageUrl: string;
}

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description?: string;
  cardCount: number;
  positions?: Array<{
    id: string;
    name: string;
    nameKr: string;
    x: number;
    y: number;
  }>;
}

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos?: { [hour: number]: string };
  savedAt: string;
}

// 전체 타로 카드 덱 결합
const ALL_TAROT_CARDS = [
  ...MAJOR_ARCANA,
  // Minor Arcana는 아직 구현되지 않았으므로 Major Arcana만 사용
  // 24장이 필요하므로 MAJOR_ARCANA를 반복
  ...MAJOR_ARCANA.slice(0, 2), // 총 24장 확보
];

// 24시간 타로 카드 생성 (실제 타로 카드 사용)
export const generateDailyCards = (date?: Date): TarotCard[] => {
  const targetDate = date || new Date();
  const seed = targetDate.toDateString(); // 날짜별로 일관된 시드
  
  // 간단한 시드 기반 셔플
  const shuffledCards = [...ALL_TAROT_CARDS];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer로 변환
  }
  
  // Fisher-Yates 셔플 (시드 기반)
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    hash = ((hash * 1103515245) + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }
  
  return shuffledCards.slice(0, 24);
};

export const getCurrentHour = (): number => {
  return new Date().getHours();
};

export const formatHour = (hour: number): string => {
  return hour.toString().padStart(2, '0') + ':00';
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// AsyncStorage 기반 데이터 저장/로드
export const saveDailyTarot = async (dailyTarot: DailyTarotSave): Promise<void> => {
  try {
    await AsyncStorage.setItem('dailyTarot', JSON.stringify(dailyTarot));
    console.log('✅ Daily tarot saved successfully');
  } catch (error) {
    console.error('❌ Failed to save daily tarot:', error);
  }
};

export const getTodaysSave = async (): Promise<DailyTarotSave | null> => {
  try {
    const saved = await AsyncStorage.getItem('dailyTarot');
    if (!saved) return null;
    
    const dailyTarot: DailyTarotSave = JSON.parse(saved);
    const today = formatDate(new Date());
    
    // 오늘 날짜와 비교하여 같은 날짜면 반환, 아니면 null
    if (dailyTarot.date === today) {
      return dailyTarot;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to load daily tarot:', error);
    return null;
  }
};

// 동기 버전 (기존 코드 호환성)
export const getTodaysSaveSync = (): DailyTarotSave | null => {
  // 임시로 null 반환 (비동기 버전 사용 권장)
  return null;
};