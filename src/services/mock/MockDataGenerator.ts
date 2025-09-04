/**
 * Mock 데이터 생성기
 * 일관되고 현실적인 테스트 데이터를 생성하는 유틸리티
 */

import {
  TarotCard,
  SpreadType,
  DailyTarotReading,
  SpreadReading,
  User,
  JournalEntry,
  AppSettings,
} from '../../types';

// Seedable 랜덤 생성기
class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? this.hashCode(seed) : seed;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  pick<T>(array: readonly T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Mock 데이터 생성기 메인 클래스
 */
export class MockDataGenerator {
  private static instance: MockDataGenerator;
  private tarotDeck: TarotCard[] = [];
  private spreadTypes: SpreadType[] = [];

  private constructor() {
    this.initializeTarotDeck();
    this.initializeSpreadTypes();
  }

  static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  // ===== 타로 카드 데이터 =====

  /**
   * 타로 덱 초기화
   */
  private initializeTarotDeck(): void {
    // 메이저 아르카나 (22장)
    const majorArcana: Omit<TarotCard, 'id'>[] = [
      {
        name: 'The Fool', nameKr: '바보',
        suit: 'major', number: 0,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
        keywords: ['new beginnings', 'innocence', 'spontaneity'],
        keywordsKr: ['새로운 시작', '순수함', '자발성'],
        meaning: 'New beginnings, having faith in the future, being inexperienced, not knowing what to expect.',
        meaningKr: '새로운 시작, 미래에 대한 믿음, 경험 부족, 무엇을 기대해야 할지 모름.',
        reversed: 'Recklessness, taken advantage of, inconsideration, stupidity.',
        reversedKr: '무모함, 이용당함, 배려 부족, 어리석음.',
        category: 'major',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'The Magician', nameKr: '마법사',
        suit: 'major', number: 1,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop',
        keywords: ['manifestation', 'resourcefulness', 'power'],
        keywordsKr: ['현실화', '수완', '힘'],
        meaning: 'Having the tools and resources you need to accomplish your goals.',
        meaningKr: '목표를 달성하는 데 필요한 도구와 자원을 갖고 있음.',
        reversed: 'Manipulation, poor planning, untapped talents.',
        reversedKr: '조작, 열악한 계획, 개발되지 않은 재능.',
        category: 'major',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // ... 추가 메이저 카드들 (간략화를 위해 생략, 실제로는 22장 모두 포함)
    ];

    // 마이너 아르카나 (56장) - 각 수트당 14장
    const suits = ['cups', 'pentacles', 'swords', 'wands'] as const;
    const minorArcana: Omit<TarotCard, 'id'>[] = [];

    suits.forEach(suit => {
      // 숫자 카드 (Ace-10)
      for (let num = 1; num <= 10; num++) {
        const displayNum = num === 1 ? 'Ace' : num.toString();
        minorArcana.push({
          name: `${displayNum} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          nameKr: this.getSuitNameKr(suit) + ' ' + this.getNumberNameKr(num),
          suit,
          number: num,
          imageUrl: `https://images.unsplash.com/photo-${1500000000 + num}?w=300&h=500&fit=crop`,
          keywords: this.getMinorCardKeywords(suit, num),
          keywordsKr: this.getMinorCardKeywordsKr(suit, num),
          meaning: `The ${displayNum} of ${suit} represents...`,
          meaningKr: `${this.getSuitNameKr(suit)} ${this.getNumberNameKr(num)}는... 를 의미합니다.`,
          reversed: 'Reversed meaning...',
          reversedKr: '역방향 의미...',
          category: 'minor',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 코트 카드 (Page, Knight, Queen, King)
      const courts = ['Page', 'Knight', 'Queen', 'King'];
      const courtsKr = ['시종', '기사', '여왕', '왕'];
      
      courts.forEach((court, index) => {
        minorArcana.push({
          name: `${court} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          nameKr: this.getSuitNameKr(suit) + ' ' + courtsKr[index],
          suit,
          imageUrl: `https://images.unsplash.com/photo-${1600000000 + index}?w=300&h=500&fit=crop`,
          keywords: this.getCourtCardKeywords(court),
          keywordsKr: this.getCourtCardKeywordsKr(courtsKr[index]),
          meaning: `The ${court} of ${suit} represents...`,
          meaningKr: `${this.getSuitNameKr(suit)} ${courtsKr[index]}는... 를 의미합니다.`,
          reversed: 'Reversed meaning...',
          reversedKr: '역방향 의미...',
          category: 'minor',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // ID 생성 및 최종 덱 구성
    const allCards = [...majorArcana, ...minorArcana];
    this.tarotDeck = allCards.map((card, index) => ({
      ...card,
      id: this.generateCardId(card.name),
    }));
  }

  /**
   * 스프레드 타입 초기화
   */
  private initializeSpreadTypes(): void {
    this.spreadTypes = [
      {
        id: 'three-card',
        name: 'Three Card Spread',
        nameKr: '3카드 스프레드',
        description: 'A simple three-card spread for past, present, and future insights.',
        descriptionKr: '과거, 현재, 미래에 대한 통찰을 위한 간단한 3카드 스프레드입니다.',
        positions: [
          { index: 0, name: 'Past', nameKr: '과거', description: 'Events that led to the current situation', descriptionKr: '현재 상황을 만든 과거의 사건들', x: 0, y: 0 },
          { index: 1, name: 'Present', nameKr: '현재', description: 'The current situation', descriptionKr: '현재의 상황', x: 1, y: 0 },
          { index: 2, name: 'Future', nameKr: '미래', description: 'Likely outcome if current path continues', descriptionKr: '현재 길을 계속 갈 때의 가능한 결과', x: 2, y: 0 },
        ],
        cardCount: 3,
        difficulty: 'beginner',
        category: 'general',
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'celtic-cross',
        name: 'Celtic Cross',
        nameKr: '켈틱 크로스',
        description: 'The most comprehensive tarot spread for detailed life guidance.',
        descriptionKr: '상세한 인생 안내를 위한 가장 포괄적인 타로 스프레드입니다.',
        positions: [
          { index: 0, name: 'Present Situation', nameKr: '현재 상황', description: 'Your current state', descriptionKr: '당신의 현재 상태', x: 1, y: 1 },
          { index: 1, name: 'Challenge', nameKr: '도전', description: 'What challenges you', descriptionKr: '당신에게 도전하는 것', x: 1, y: 1 },
          // ... 추가 위치들
        ],
        cardCount: 10,
        difficulty: 'advanced',
        category: 'general',
        isPremium: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // ... 추가 스프레드들
    ];
  }

  // ===== 헬퍼 메서드들 =====

  private generateCardId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private getSuitNameKr(suit: string): string {
    const suitNames = {
      cups: '컵',
      pentacles: '펜타클',
      swords: '검',
      wands: '완드',
    };
    return suitNames[suit as keyof typeof suitNames] || suit;
  }

  private getNumberNameKr(num: number): string {
    const numbers = ['', '에이스', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    return numbers[num] || num.toString();
  }

  private getMinorCardKeywords(suit: string, num: number): string[] {
    // 수트와 숫자에 따른 키워드 생성 로직
    const baseKeywords = {
      cups: ['emotions', 'relationships', 'spirituality'],
      pentacles: ['material', 'career', 'resources'],
      swords: ['thoughts', 'communication', 'conflict'],
      wands: ['passion', 'creativity', 'action'],
    };
    
    return baseKeywords[suit as keyof typeof baseKeywords] || [];
  }

  private getMinorCardKeywordsKr(suit: string, num: number): string[] {
    const baseKeywordsKr = {
      cups: ['감정', '관계', '영성'],
      pentacles: ['물질', '경력', '자원'],
      swords: ['사고', '소통', '갈등'],
      wands: ['열정', '창의성', '행동'],
    };
    
    return baseKeywordsKr[suit as keyof typeof baseKeywordsKr] || [];
  }

  private getCourtCardKeywords(court: string): string[] {
    const courtKeywords = {
      Page: ['learning', 'messages', 'new energy'],
      Knight: ['action', 'movement', 'adventure'],
      Queen: ['nurturing', 'intuition', 'emotional maturity'],
      King: ['mastery', 'leadership', 'authority'],
    };
    
    return courtKeywords[court as keyof typeof courtKeywords] || [];
  }

  private getCourtCardKeywordsKr(court: string): string[] {
    const courtKeywordsKr = {
      시종: ['학습', '메시지', '새로운 에너지'],
      기사: ['행동', '움직임', '모험'],
      여왕: ['양육', '직관', '감정적 성숙'],
      왕: ['숙련', '리더십', '권위'],
    };
    
    return courtKeywordsKr[court as keyof typeof courtKeywordsKr] || [];
  }

  // ===== 공개 메서드들 =====

  /**
   * 전체 타로 덱 반환
   */
  getAllCards(): TarotCard[] {
    return [...this.tarotDeck];
  }

  /**
   * 특정 카드 조회
   */
  getCardById(id: string): TarotCard | null {
    return this.tarotDeck.find(card => card.id === id) || null;
  }

  /**
   * 랜덤 카드 선택
   */
  getRandomCards(count: number, seed?: string): TarotCard[] {
    const rng = new SeededRandom(seed || Date.now());
    const shuffled = rng.shuffle([...this.tarotDeck]);
    return shuffled.slice(0, count);
  }

  /**
   * 24시간 일일 카드 생성 (일관된 시드 기반)
   */
  generateDailyCards(date: string): TarotCard[] {
    const rng = new SeededRandom(date);
    const shuffled = rng.shuffle([...this.tarotDeck]);
    return shuffled.slice(0, 24);
  }

  /**
   * 일일 타로 리딩 생성
   */
  generateDailyTarotReading(date: string): DailyTarotReading {
    const hourlyCards = this.generateDailyCards(date);
    const currentHour = new Date().getHours();

    return {
      id: `daily-${date}`,
      date,
      hourlyCards,
      currentHour,
      memos: {},
      insights: '',
      streak: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 스프레드 타입 목록 반환
   */
  getAllSpreadTypes(): SpreadType[] {
    return [...this.spreadTypes];
  }

  /**
   * 특정 스프레드 타입 조회
   */
  getSpreadTypeById(id: string): SpreadType | null {
    return this.spreadTypes.find(spread => spread.id === id) || null;
  }

  /**
   * 스프레드 리딩 생성
   */
  generateSpreadReading(spreadTypeId: string, title?: string): SpreadReading {
    const spreadType = this.getSpreadTypeById(spreadTypeId);
    if (!spreadType) {
      throw new Error(`Spread type ${spreadTypeId} not found`);
    }

    const cards = new Array(spreadType.cardCount).fill(null);
    const revealedPositions = new Array(spreadType.cardCount).fill(false);

    return {
      id: `spread-${Date.now()}`,
      spreadType,
      title: title || `${spreadType.nameKr} 리딩`,
      cards,
      revealedPositions,
      isComplete: false,
      notes: '',
      interpretation: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 샘플 사용자 생성
   */
  generateSampleUser(): User {
    return {
      id: 'user-sample-001',
      email: 'tarot@example.com',
      profile: {
        displayName: '타로 마스터',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b386?w=150&h=150&fit=crop&crop=face',
        timezone: 'Asia/Seoul',
        language: 'ko',
        interests: ['타로', '명상', '영성', '심리학'],
      },
      premiumStatus: {
        isActive: true,
        planId: 'premium-monthly',
        subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        features: ['premium-spreads', 'unlimited-readings', 'advanced-analytics'],
      },
      statistics: {
        totalReadings: 45,
        completedSpreads: 12,
        currentStreak: 7,
        longestStreak: 15,
        favoriteCards: [],
        mostUsedSpreads: [],
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastActivityAt: new Date(),
      },
      preferences: {
        theme: 'dark',
        notifications: {
          dailyReminder: true,
          spreadCompletion: true,
          weeklyInsights: false,
          promotions: false,
        },
        privacy: {
          shareStatistics: false,
          allowAnalytics: true,
        },
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  }

  /**
   * 샘플 저널 엔트리 생성
   */
  generateSampleJournalEntries(count: number = 10): JournalEntry[] {
    const entries: JournalEntry[] = [];
    const rng = new SeededRandom('journal-sample');

    for (let i = 0; i < count; i++) {
      const daysAgo = i * 2 + rng.nextInt(0, 3);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      entries.push({
        id: `journal-${i + 1}`,
        title: this.generateJournalTitle(rng),
        content: this.generateJournalContent(rng),
        type: rng.pick(['daily', 'spread', 'insight', 'dream']),
        tags: this.generateJournalTags(rng),
        mood: rng.nextInt(1, 10),
        isPrivate: rng.nextBoolean(0.2),
        attachments: [],
        relatedReadingId: rng.nextBoolean(0.3) ? `reading-${rng.nextInt(1, 20)}` : undefined,
        createdAt: date,
        updatedAt: date,
      });
    }

    return entries;
  }

  /**
   * 기본 앱 설정 생성
   */
  generateDefaultSettings(): AppSettings {
    return {
      language: 'ko',
      theme: 'dark',
      notifications: {
        dailyReminder: true,
        reminderTime: '09:00',
        spreadCompletion: true,
        weeklyInsights: true,
        promotions: false,
        sound: true,
        vibration: true,
      },
      display: {
        cardAnimations: true,
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        cardBackDesign: 'classic',
      },
      privacy: {
        shareStatistics: false,
        allowAnalytics: true,
        dataCollection: 'essential',
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        includeJournal: true,
        includeReadings: true,
      },
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // ===== 프라이빗 헬퍼 메서드들 =====

  private generateJournalTitle(rng: SeededRandom): string {
    const titles = [
      '오늘의 타로 인사이트',
      '새로운 깨달음',
      '내면의 목소리',
      '카드가 주는 메시지',
      '삶의 전환점',
      '직감적 느낌',
      '마음의 정리',
      '영적 성장',
      '감정의 파도',
      '우주의 신호',
    ];
    
    return rng.pick(titles);
  }

  private generateJournalContent(rng: SeededRandom): string {
    const contents = [
      '오늘 뽑은 카드에서 새로운 관점을 얻었다. 변화를 두려워하지 말고 받아들여야겠다.',
      '스프레드 결과가 예상과 달랐지만, 그 안에서 더 깊은 의미를 찾을 수 있었다.',
      '최근의 고민이 카드를 통해 명확해졌다. 때로는 직관을 믿는 것이 중요하다.',
      '타로가 알려준 길을 따라가보니 예상치 못한 기회가 찾아왔다.',
      '내 마음의 상태가 카드에 그대로 반영되어 신기했다.',
    ];
    
    return rng.pick(contents);
  }

  private generateJournalTags(rng: SeededRandom): string[] {
    const allTags = [
      '인사이트', '성장', '변화', '관계', '직업', '사랑', '건강', '영성',
      '명상', '꿈', '직감', '결정', '도전', '기회', '감정', '치유'
    ];
    
    const tagCount = rng.nextInt(1, 4);
    const tags: string[] = [];
    
    for (let i = 0; i < tagCount; i++) {
      const tag = rng.pick(allTags);
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return tags;
  }
}

// ===== 편의 함수들 =====

/**
 * Mock 데이터 생성기 인스턴스 가져오기
 */
export function getMockDataGenerator(): MockDataGenerator {
  return MockDataGenerator.getInstance();
}

/**
 * 빠른 카드 생성
 */
export function generateMockCards(count: number, seed?: string): TarotCard[] {
  return getMockDataGenerator().getRandomCards(count, seed);
}

/**
 * 빠른 일일 리딩 생성
 */
export function generateMockDailyReading(date: string): DailyTarotReading {
  return getMockDataGenerator().generateDailyTarotReading(date);
}

/**
 * 빠른 스프레드 생성
 */
export function generateMockSpread(spreadTypeId: string, title?: string): SpreadReading {
  return getMockDataGenerator().generateSpreadReading(spreadTypeId, title);
}