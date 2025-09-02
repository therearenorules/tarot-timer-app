export interface TarotCard {
  id: string;
  name: string;
  nameKr: string;
  suit: 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  imageUrl: string;
  keywords: string[];
  keywordsKr: string[];
  meaning: string;
  meaningKr: string;
  reversed: string;
  reversedKr: string;
}

export interface DailyReading {
  date: string;
  hourlyCards: TarotCard[];
  currentHour: number;
  memo?: string;
}

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  positions: string[];
  positionsKr: string[];
  isPremium?: boolean;
}

export interface SpreadReading {
  id: string;
  spreadId: string;
  date: string;
  cards: (TarotCard | null)[];
  notes?: string;
  isComplete: boolean;
}

// 데일리 타로 저장을 위한 새로운 인터페이스
export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

// Mock tarot deck data
export const TAROT_DECK: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    nameKr: '바보',
    suit: 'major',
    number: 0,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
    keywords: ['new beginnings', 'innocence', 'spontaneity'],
    keywordsKr: ['새로운 시작', '순수함', '자발성'],
    meaning: 'New beginnings, having faith in the future, being inexperienced, not knowing what to expect.',
    meaningKr: '새로운 시작, 미래에 대한 믿음, 경험 부족, 무엇을 기대해야 할지 모름.',
    reversed: 'Recklessness, taken advantage of, inconsideration, stupidity.',
    reversedKr: '무모함, 이용당함, 배려 부족, 어리석음.'
  },
  {
    id: 'magician',
    name: 'The Magician',
    nameKr: '마법사',
    suit: 'major',
    number: 1,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop',
    keywords: ['manifestation', 'resourcefulness', 'power'],
    keywordsKr: ['현실화', '수완', '힘'],
    meaning: 'Having the tools and resources you need to accomplish your goals.',
    meaningKr: '목표를 달성하는 데 필요한 도구와 자원을 갖고 있음.',
    reversed: 'Manipulation, poor planning, untapped talents.',
    reversedKr: '조작, 열악한 계획, 개발되지 않은 재능.'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    nameKr: '여교황',
    suit: 'major',
    number: 2,
    imageUrl: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=300&h=500&fit=crop',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine'],
    keywordsKr: ['직감', '신성한 지식', '신성한 여성성'],
    meaning: 'Intuition, higher powers, mystery, subconscious mind.',
    meaningKr: '직관, 고차원의 힘, 신비, 잠재의식.',
    reversed: 'Lack of center, lost inner voice, repressed feelings.',
    reversedKr: '중심 부족, 잃어버린 내면의 목소리, 억압된 감정.'
  },
  {
    id: 'empress',
    name: 'The Empress',
    nameKr: '여황제',
    suit: 'major',
    number: 3,
    imageUrl: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=300&h=500&fit=crop',
    keywords: ['fertility', 'femininity', 'beauty'],
    keywordsKr: ['풍요', '여성성', '아름다움'],
    meaning: 'Fertility, femininity, beauty, nature, abundance.',
    meaningKr: '풍요로움, 여성성, 아름다움, 자연, 풍부함.',
    reversed: 'Creative block, dependence on others.',
    reversedKr: '창조적 막힘, 타인에 대한 의존.'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    nameKr: '황제',
    suit: 'major',
    number: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=500&fit=crop',
    keywords: ['authority', 'structure', 'control'],
    keywordsKr: ['권위', '구조', '통제'],
    meaning: 'Authority, structure, control, fatherhood.',
    meaningKr: '권위, 구조, 통제, 아버지 역할.',
    reversed: 'Tyranny, rigidity, coldness.',
    reversedKr: '독재, 경직성, 냉정함.'
  }
];

// Generate more cards to complete the deck
const generateMinorArcana = (): TarotCard[] => {
  const suits = [
    { name: 'cups', nameKr: '컵', baseUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=500&fit=crop' },
    { name: 'pentacles', nameKr: '펜타클', baseUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop' },
    { name: 'swords', nameKr: '검', baseUrl: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=300&h=500&fit=crop' },
    { name: 'wands', nameKr: '지팡이', baseUrl: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=300&h=500&fit=crop' }
  ];

  const cards: TarotCard[] = [];
  
  suits.forEach(suit => {
    for (let i = 1; i <= 10; i++) {
      cards.push({
        id: `${suit.name}-${i}`,
        name: `${i} of ${suit.name}`,
        nameKr: `${suit.nameKr} ${i}`,
        suit: suit.name as any,
        number: i,
        imageUrl: suit.baseUrl,
        keywords: ['energy', 'movement', 'progress'],
        keywordsKr: ['에너지', '움직임', '진보'],
        meaning: `The ${i} of ${suit.name} represents progress and development.`,
        meaningKr: `${suit.nameKr} ${i}은 진보와 발전을 나타냅니다.`,
        reversed: 'Blocked energy, delays, frustration.',
        reversedKr: '막힌 에너지, 지연, 좌절.'
      });
    }
  });
  
  return cards;
};

export const FULL_TAROT_DECK = [...TAROT_DECK, ...generateMinorArcana()];

// 수정 및 확장된 스프레드 타입들 - SpreadDetail 컴포넌트와 호환
export interface ExtendedSpreadType extends SpreadType {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const TAROT_SPREADS: ExtendedSpreadType[] = [
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKr: '3카드 스프레드',
    description: 'Past, Present, Future',
    descriptionKr: '과거, 현재, 미래의 흐름을 보는 기본 스프레드',
    positions: ['Past', 'Present', 'Future'],
    positionsKr: ['과거', '현재', '미래'],
    difficulty: 'beginner'
  },
  {
    id: 'four-card',
    name: 'Four Card Spread',
    nameKr: '4카드 스프레드',
    description: 'Balance and harmony in four key areas',
    descriptionKr: '네 가지 핵심 영역의 균형과 조화',
    positions: ['Mind', 'Body', 'Spirit', 'Action'],
    positionsKr: ['마음', '몸', '영혼', '행동'],
    difficulty: 'beginner'
  },
  {
    id: 'five-card',
    name: '5-Card V-Shape',
    nameKr: '5카드 V자형',
    description: 'V-shaped spread for comprehensive guidance',
    descriptionKr: '종합적인 안내를 위한 V자 형태 스프레드',
    positions: ['Foundation', 'Challenge', 'Strength', 'Advice', 'Outcome'],
    positionsKr: ['기반', '도전', '힘', '조언', '결과'],
    difficulty: 'intermediate'
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameKr: '켈틱 크로스',
    description: 'Complete life reading with 10 cards',
    descriptionKr: '10장으로 보는 완전한 인생 리딩',
    positions: ['Current Situation', 'Challenge/Cross', 'Distant Past', 'Recent Past', 'Possible Outcome', 'Immediate Future', 'Your Approach', 'External Influences', 'Hopes and Fears', 'Final Outcome'],
    positionsKr: ['현재 상황', '도전/장애', '먼 과거', '최근 과거', '가능한 결과', '가까운 미래', '당신의 접근법', '외부 영향', '희망과 두려움', '최종 결과'],
    isPremium: true,
    difficulty: 'expert'
  },
  {
    id: 'love',
    name: 'Cup of Relationship',
    nameKr: '사랑의 성배',
    description: 'Deep insights into your relationship dynamics',
    descriptionKr: '관계 역학의 깊은 통찰을 위한 사랑 스프레드',
    positions: [
      'Your Current State',
      'Partner\'s Current State', 
      'Our Current State',
      'Past',
      'Present',
      'Obstacles',
      'Your Heart',
      'Partner\'s Heart',
      'What You Want from Partner',
      'What Partner Wants from You',
      'Outcome'
    ],
    positionsKr: [
      '나의 현재 상태',
      '상대의 현재 상태',
      '우리의 현재 상태', 
      '과거',
      '현재',
      '방해물',
      '나의 마음',
      '상대의 마음',
      '내가 상대에게 바라는 점',
      '상대가 나에게 바라는 점',
      '결과'
    ],
    isPremium: true,
    difficulty: 'advanced'
  },
  {
    id: 'career',
    name: 'AB Choice Spread',
    nameKr: 'AB 선택 스프레드',
    description: 'Choose between two important options',
    descriptionKr: '두 가지 중요한 선택지 분석',
    positions: [
      'Choice A - Option 1',
      'Choice A - Option 2', 
      'Choice A - Option 3',
      'Current Situation',
      'Choice B - Option 1',
      'Choice B - Option 2',
      'Choice B - Option 3'
    ],
    positionsKr: [
      'A 선택지 1',
      'A 선택지 2',
      'A 선택지 3',
      '현재 상황',
      'B 선택지 1',
      'B 선택지 2',
      'B 선택지 3'
    ],
    isPremium: true,
    difficulty: 'intermediate'
  }
];

// Utility functions
export const generateDailyCards = (date?: Date): TarotCard[] => {
  const targetDate = date || new Date();
  const seed = targetDate.toDateString();
  
  // Simple pseudo-random based on date
  const random = (seed: string, index: number) => {
    let hash = 0;
    const str = seed + index.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % FULL_TAROT_DECK.length;
  };
  
  const cards: TarotCard[] = [];
  const usedIndices = new Set<number>();
  
  for (let hour = 0; hour < 24; hour++) {
    let cardIndex;
    do {
      cardIndex = random(seed, hour + usedIndices.size);
    } while (usedIndices.has(cardIndex));
    
    usedIndices.add(cardIndex);
    cards.push(FULL_TAROT_DECK[cardIndex]);
  }
  
  return cards;
};

export const getCurrentHour = (): number => {
  return new Date().getHours();
};

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? '오후' : '오전';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}시`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export const getRandomCard = (): TarotCard => {
  const randomIndex = Math.floor(Math.random() * FULL_TAROT_DECK.length);
  return FULL_TAROT_DECK[randomIndex];
};

// Shuffle array utility function - avoiding generic syntax that may be parsed as JSX
export function shuffleArray(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 데일리 타로 저장 관련 유틸리티 함수들
export const saveDailyTarot = (dailyReading: DailyTarotSave): void => {
  const saved = localStorage.getItem('dailyTarotSaves');
  const savedReadings: DailyTarotSave[] = saved ? JSON.parse(saved) : [];
  
  // 같은 날짜의 기존 저장을 찾아서 덮어쓰기 또는 새로 추가
  const existingIndex = savedReadings.findIndex(reading => reading.date === dailyReading.date);
  
  if (existingIndex >= 0) {
    // 기존 데이터 덮어쓰기
    savedReadings[existingIndex] = dailyReading;
  } else {
    // 새 데이터 추가
    savedReadings.unshift(dailyReading);
  }
  
  localStorage.setItem('dailyTarotSaves', JSON.stringify(savedReadings));
};

export const loadDailyTarotSaves = (): DailyTarotSave[] => {
  const saved = localStorage.getItem('dailyTarotSaves');
  return saved ? JSON.parse(saved) : [];
};

export const getTodaysSave = (): DailyTarotSave | null => {
  const today = new Date().toDateString();
  const saves = loadDailyTarotSaves();
  return saves.find(save => save.date === today) || null;
};