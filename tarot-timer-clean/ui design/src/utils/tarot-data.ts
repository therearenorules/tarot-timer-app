// 기존 웹 버전의 타로 데이터를 React Native로 이식
export const generateDailyCards = (date: Date) => {
  // 24장 카드 생성 로직 - 웹 버전과 동일
  const cards = [];
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  
  for (let i = 0; i < 24; i++) {
    const cardId = (seed + i * 137) % 78 + 1; // 간단한 의사 난수
    cards.push({
      id: cardId,
      name: `Card ${cardId}`,
      nameKr: `카드 ${cardId}`,
      meaning: `Meaning for card ${cardId}`,
      meaningKr: `카드 ${cardId}의 의미`,
      keywords: ['keyword1', 'keyword2', 'keyword3'],
      keywordsKr: ['키워드1', '키워드2', '키워드3'],
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + cardId * 1000000}?w=400&h=600&fit=crop`,
      element: 'Fire',
      suit: 'Major',
      type: 'Major Arcana' as 'Major Arcana' | 'Minor Arcana',
    });
  }
  
  return cards;
};

export const getCurrentHour = () => {
  return new Date().getHours();
};

export const formatHour = (hour: number) => {
  if (hour === 0) return '자정 12:00';
  if (hour < 12) return `오전 ${hour}:00`;
  if (hour === 12) return '정오 12:00';
  return `오후 ${hour - 12}:00`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  meaning: string;
  meaningKr: string;
  keywords: string[];
  keywordsKr: string[];
  imageUrl: string;
  element: string;
  suit: string;
  type: 'Major Arcana' | 'Minor Arcana';
}

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  cardCount: number;
  isPremium: boolean;
}

export const SPREAD_TYPES: SpreadType[] = [
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKr: '3카드 스프레드',
    description: 'Past, Present, Future insight',
    descriptionKr: '과거, 현재, 미래의 통찰',
    cardCount: 3,
    isPremium: false,
  },
  {
    id: 'four-card',
    name: 'Four Card Spread', 
    nameKr: '4카드 스프레드',
    description: 'Comprehensive situation analysis',
    descriptionKr: '종합적인 상황 분석',
    cardCount: 4,
    isPremium: false,
  },
  {
    id: 'five-card',
    name: 'Five Card Spread',
    nameKr: '5카드 스프레드', 
    description: 'Inner growth and development',
    descriptionKr: '내면 성장과 발전',
    cardCount: 5,
    isPremium: false,
  },
  {
    id: 'ab-choice',
    name: 'AB Choice Spread',
    nameKr: 'AB선택 스프레드',
    description: 'Two option comparison',
    descriptionKr: '두 가지 선택지 비교',
    cardCount: 7,
    isPremium: false,
  },
  {
    id: 'celtic-cross', 
    name: 'Celtic Cross',
    nameKr: '켈틱 크로스',
    description: 'Comprehensive life reading',
    descriptionKr: '종합적인 인생 리딩',
    cardCount: 10,
    isPremium: true,
  },
  {
    id: 'relationship',
    name: 'Relationship Spread',
    nameKr: '관계 스프레드',
    description: 'Deep relationship insights',
    descriptionKr: '깊은 관계 통찰',
    cardCount: 11,
    isPremium: true,
  },
];

export interface ViewType {
  tabs: string;
  spreadDetail: string;
  savedSpreadDetail: string;
  dailyTarotDetail: string;
}

export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

export interface SavedSpread {
  id: string;
  title: string;
  spreadType: string;
  spreadName: string;
  date: string;
  cards: TarotCard[];
  insights: string;
  savedAt: string;
}

// Mock data for development
export const loadDailyTarotSaves = (): DailyTarotSave[] => {
  // 이 함수는 실제로는 AsyncStorage에서 데이터를 불러옴
  return [];
};