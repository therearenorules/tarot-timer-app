/**
 * 타로 도메인 타입 정의
 * 타로 카드, 스프레드, 리딩 관련 핵심 타입들
 */

// ===== 기본 타로 카드 타입 =====
export interface TarotCard {
  readonly id: string;
  readonly name: string;
  readonly nameKr: string;
  readonly suit: TarotSuit;
  readonly number?: number;
  readonly imageUrl: string;
  readonly keywords: readonly string[];
  readonly keywordsKr: readonly string[];
  readonly meaning: string;
  readonly meaningKr: string;
  readonly reversed: string;
  readonly reversedKr: string;
  readonly category: 'major' | 'minor';
}

// ===== 타로 수트 =====
export type TarotSuit = 
  | 'major'      // 메이저 아르카나
  | 'cups'       // 컵 (성배)
  | 'pentacles'  // 펜타클 (동전)
  | 'swords'     // 소드 (검)
  | 'wands';     // 완드 (막대)

// ===== 스프레드 타입 =====
export interface SpreadType {
  readonly id: string;
  readonly name: string;
  readonly nameKr: string;
  readonly description: string;
  readonly descriptionKr: string;
  readonly positions: readonly string[];
  readonly positionsKr: readonly string[];
  readonly cardCount: number;
  readonly isPremium?: boolean;
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';
  readonly category: 'general' | 'love' | 'career' | 'spiritual';
}

// ===== 스프레드 인스턴스 (실제 뽑힌 카드들) =====
export interface SpreadReading {
  readonly id: string;
  readonly spreadType: SpreadType;
  readonly cards: readonly (TarotCard | null)[];
  readonly isComplete: boolean;
  readonly completedAt?: Date;
  readonly title: string;
  readonly notes?: string;
  readonly interpretation?: string;
}

// ===== 일일 타로 =====
export interface DailyTarotReading {
  readonly id: string;
  readonly date: string; // YYYY-MM-DD 형식
  readonly hourlyCards: readonly TarotCard[];
  readonly currentHour: number;
  readonly memos: Readonly<Record<number, string>>; // 시간별 메모
  readonly insights: string;
  readonly savedAt: Date;
}

// ===== 타로 카드 위치 정보 =====
export interface CardPosition {
  readonly index: number;
  readonly name: string;
  readonly nameKr: string;
  readonly description: string;
  readonly descriptionKr: string;
  readonly isRevealed: boolean;
  readonly card?: TarotCard;
}

// ===== 타로 덱 설정 =====
export interface TarotDeck {
  readonly id: string;
  readonly name: string;
  readonly nameKr: string;
  readonly description: string;
  readonly descriptionKr: string;
  readonly cards: readonly TarotCard[];
  readonly imageBackUrl: string;
  readonly isDefault: boolean;
}

// ===== 카드 생성 옵션 =====
export interface CardGenerationOptions {
  readonly seed?: string;
  readonly excludeCards?: readonly string[];
  readonly includeReversed?: boolean;
  readonly deckId?: string;
  readonly shuffleCount?: number;
}

// ===== 스프레드 레이아웃 설정 =====
export interface SpreadLayoutConfig {
  readonly columns: number;
  readonly rows: number;
  readonly positions: readonly {
    readonly x: number;
    readonly y: number;
    readonly rotation?: number;
    readonly scale?: number;
  }[];
  readonly centerOffset?: {
    readonly x: number;
    readonly y: number;
  };
}

// ===== 타로 통계 =====
export interface TarotStatistics {
  readonly totalReadings: number;
  readonly completedSpreads: number;
  readonly favoriteCards: readonly {
    readonly card: TarotCard;
    readonly frequency: number;
  }[];
  readonly mostUsedSpreads: readonly {
    readonly spread: SpreadType;
    readonly count: number;
  }[];
  readonly readingStreak: number; // 연속 리딩 일수
  readonly lastReadingDate: Date;
}

// ===== 유틸리티 타입들 =====
export type TarotCardId = TarotCard['id'];
export type SpreadId = SpreadType['id'];
export type DailyReadingId = DailyTarotReading['id'];

// 카드 필터링 옵션
export interface CardFilter {
  readonly suit?: TarotSuit;
  readonly category?: 'major' | 'minor';
  readonly keywords?: readonly string[];
  readonly searchText?: string;
}

// 스프레드 필터링 옵션
export interface SpreadFilter {
  readonly category?: SpreadType['category'];
  readonly difficulty?: SpreadType['difficulty'];
  readonly isPremium?: boolean;
  readonly cardCountMin?: number;
  readonly cardCountMax?: number;
}