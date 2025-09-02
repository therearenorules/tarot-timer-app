/**
 * 🎴 Tarot Cards Database
 * 
 * Complete tarot card database with Korean translations
 * and mystical imagery for the timer app.
 */

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

// Major Arcana (22 cards)
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    nameKr: '바보',
    suit: 'major',
    number: 0,
    description: 'New beginnings, innocence, spontaneity',
    descriptionKr: '새로운 시작, 순수함, 자발성',
    keywords: ['new start', 'innocence', 'adventure'],
    keywordsKr: ['새 시작', '순수', '모험'],
    imageUrl: 'https://images.unsplash.com/photo-1615829332206-22479388eecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJvdCUyMGNhcmRzJTIwbXlzdGljYWx8ZW58MXx8fHwxNzU2NDM2NTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'magician',
    name: 'The Magician',
    nameKr: '마법사',
    suit: 'major',
    number: 1,
    description: 'Willpower, desire, manifestation',
    descriptionKr: '의지력, 욕망, 현실화',
    keywords: ['willpower', 'manifestation', 'skill'],
    keywordsKr: ['의지력', '현실화', '기술'],
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80',
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    nameKr: '여교황',
    suit: 'major',
    number: 2,
    description: 'Intuition, sacred knowledge, divine feminine',
    descriptionKr: '직감, 신성한 지식, 신성한 여성성',
    keywords: ['intuition', 'mystery', 'unconscious'],
    keywordsKr: ['직감', '신비', '무의식'],
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80',
  },
  {
    id: 'empress',
    name: 'The Empress',
    nameKr: '여황제',
    suit: 'major',
    number: 3,
    description: 'Femininity, beauty, nature, abundance',
    descriptionKr: '여성성, 아름다움, 자연, 풍요',
    keywords: ['abundance', 'creativity', 'fertility'],
    keywordsKr: ['풍요', '창조성', '다산'],
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80',
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    nameKr: '황제',
    suit: 'major',
    number: 4,
    description: 'Authority, establishment, structure',
    descriptionKr: '권위, 확립, 구조',
    keywords: ['authority', 'control', 'leadership'],
    keywordsKr: ['권위', '통제', '리더십'],
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80',
  },
];

// Full 78-card deck (simplified for demo)
export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  // Minor Arcana would be added here in a full implementation
  // For now, we'll generate cards dynamically
];

/**
 * Get a random tarot card
 */
export function getRandomTarotCard(): TarotCard {
  const cards = ALL_TAROT_CARDS.length > 0 ? ALL_TAROT_CARDS : MAJOR_ARCANA;
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex]!;
}

/**
 * Generate 24 unique cards for the day
 */
export function generate24HourCards(): TarotCard[] {
  const cards: TarotCard[] = [];
  
  for (let i = 0; i < 24; i++) {
    // Create unique card for each hour
    cards.push({
      id: `hour-${i}-${Date.now()}`,
      name: `Hour ${i} Card`,
      nameKr: `${i}시 카드`,
      description: 'Your guidance for this hour',
      descriptionKr: '이 시간의 안내',
      keywords: ['time', 'guidance', 'insight'],
      keywordsKr: ['시간', '안내', '통찰'],
      imageUrl: `https://images.unsplash.com/photo-1615829332206-22479388eecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJvdCUyMGNhcmRzJTIwbXlzdGljYWx8ZW58MXx8fHwxNzU2NDM2NTcyfDA&ixlib=rb-4.1.0&q=80&w=300&h=400`,
    });
  }
  
  return cards;
}

/**
 * Get card for specific hour
 */
export function getCardForHour(hour: number): TarotCard {
  // In a real app, this would be deterministic based on date + hour
  const seed = new Date().toDateString() + hour;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const cardIndex = Math.abs(hash) % MAJOR_ARCANA.length;
  return MAJOR_ARCANA[cardIndex]!;
}

/**
 * Tarot spread configurations
 */
export interface SpreadConfig {
  id: string;
  name: string;
  nameKr: string;
  cardCount: number;
  positions: Array<{
    id: string;
    name: string;
    nameKr: string;
    x: number; // 0-100 (percentage)
    y: number; // 0-100 (percentage)
    rotation?: number; // degrees
  }>;
  description: string;
  descriptionKr: string;
}

export const SPREAD_CONFIGS: SpreadConfig[] = [
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKr: '3카드 스프레드',
    cardCount: 3,
    positions: [
      { id: 'past', name: 'Past', nameKr: '과거', x: 20, y: 50 },
      { id: 'present', name: 'Present', nameKr: '현재', x: 50, y: 50 },
      { id: 'future', name: 'Future', nameKr: '미래', x: 80, y: 50 },
    ],
    description: 'Past, Present, Future guidance',
    descriptionKr: '과거, 현재, 미래의 안내',
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameKr: '켈틱 크로스',
    cardCount: 10,
    positions: [
      { id: 'present', name: 'Present Situation', nameKr: '현재 상황', x: 50, y: 50 },
      { id: 'challenge', name: 'Challenge', nameKr: '도전', x: 50, y: 50, rotation: 90 },
      { id: 'past', name: 'Distant Past', nameKr: '먼 과거', x: 50, y: 30 },
      { id: 'future', name: 'Possible Future', nameKr: '가능한 미래', x: 50, y: 70 },
      { id: 'crown', name: 'Crown', nameKr: '왕관', x: 50, y: 10 },
      { id: 'foundation', name: 'Foundation', nameKr: '기반', x: 50, y: 90 },
      { id: 'recent-past', name: 'Recent Past', nameKr: '최근 과거', x: 30, y: 50 },
      { id: 'approach', name: 'Your Approach', nameKr: '당신의 접근법', x: 70, y: 50 },
      { id: 'external', name: 'External Influences', nameKr: '외부 영향', x: 85, y: 30 },
      { id: 'outcome', name: 'Outcome', nameKr: '결과', x: 85, y: 10 },
    ],
    description: 'Comprehensive life guidance',
    descriptionKr: '종합적인 인생 안내',
  },
  {
    id: 'relationship',
    name: 'Relationship Spread',
    nameKr: '관계 스프레드',
    cardCount: 6,
    positions: [
      { id: 'you', name: 'You', nameKr: '당신', x: 25, y: 30 },
      { id: 'partner', name: 'Partner', nameKr: '상대방', x: 75, y: 30 },
      { id: 'relationship', name: 'Relationship', nameKr: '관계', x: 50, y: 50 },
      { id: 'challenge', name: 'Challenge', nameKr: '도전', x: 25, y: 70 },
      { id: 'action', name: 'Action', nameKr: '행동', x: 75, y: 70 },
      { id: 'outcome', name: 'Outcome', nameKr: '결과', x: 50, y: 85 },
    ],
    description: 'Relationship guidance and insight',
    descriptionKr: '관계의 안내와 통찰',
  },
];

export function getSpreadConfig(spreadId: string): SpreadConfig | null {
  return SPREAD_CONFIGS.find(config => config.id === spreadId) || null;
}