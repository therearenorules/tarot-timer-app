/**
 * 타로 서비스 인터페이스
 * Mock과 Real API 구현이 동일한 인터페이스를 공유
 */

import {
  TarotCard,
  SpreadType,
  DailyTarotReading,
  SpreadReading,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

// ===== 요청 타입들 =====
export interface GenerateDailyCardsRequest {
  readonly date: string; // YYYY-MM-DD 형식
  readonly timezone?: string;
  readonly seed?: string; // 일관된 생성을 위한 시드
}

export interface CreateSpreadReadingRequest {
  readonly spreadTypeId: string;
  readonly title?: string;
  readonly customPositions?: string[];
}

export interface UpdateSpreadReadingRequest {
  readonly title?: string;
  readonly cards?: readonly (string | null)[]; // 카드 ID들
  readonly revealedPositions?: readonly boolean[];
  readonly notes?: string;
  readonly interpretation?: string;
  readonly tags?: readonly string[];
}

export interface SaveDailyMemoRequest {
  readonly date: string;
  readonly hour: number;
  readonly memo: string;
}

export interface UpdateDailyInsightsRequest {
  readonly date: string;
  readonly insights: string;
}

export interface SearchCardsRequest {
  readonly query?: string;
  readonly suits?: readonly string[];
  readonly keywords?: readonly string[];
  readonly category?: 'major' | 'minor';
  readonly limit?: number;
  readonly offset?: number;
}

// ===== 메인 서비스 인터페이스 =====
export interface TarotService {
  // ===== 24시간 타로 시스템 =====
  
  /**
   * 특정 날짜의 24시간 타로 카드 생성
   * @param request 생성 요청 정보
   * @returns 생성된 일일 타로 리딩
   */
  generateDailyCards(
    request: GenerateDailyCardsRequest
  ): Promise<ApiResponse<DailyTarotReading>>;
  
  /**
   * 특정 날짜의 일일 타로 카드 조회
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 저장된 일일 타로 리딩 또는 null
   */
  getDailyCards(
    date: string
  ): Promise<ApiResponse<DailyTarotReading | null>>;
  
  /**
   * 특정 시간대의 메모 저장
   * @param request 메모 저장 요청
   */
  saveDailyMemo(
    request: SaveDailyMemoRequest
  ): Promise<ApiResponse<void>>;
  
  /**
   * 일일 인사이트 업데이트
   * @param request 인사이트 업데이트 요청
   */
  updateDailyInsights(
    request: UpdateDailyInsightsRequest
  ): Promise<ApiResponse<void>>;
  
  /**
   * 날짜 범위별 일일 리딩 목록 조회
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   */
  getDailyCardsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DailyTarotReading[]>>;

  // ===== 스프레드 관리 =====
  
  /**
   * 사용 가능한 스프레드 타입 목록 조회
   * @param includeLockedPremium 잠긴 프리미엄 스프레드 포함 여부
   */
  getSpreadTypes(
    includeLockedPremium?: boolean
  ): Promise<ApiResponse<SpreadType[]>>;
  
  /**
   * 특정 스프레드 타입 상세 정보 조회
   * @param spreadTypeId 스프레드 타입 ID
   */
  getSpreadType(
    spreadTypeId: string
  ): Promise<ApiResponse<SpreadType | null>>;
  
  /**
   * 새로운 스프레드 리딩 생성
   * @param request 스프레드 생성 요청
   */
  createSpreadReading(
    request: CreateSpreadReadingRequest
  ): Promise<ApiResponse<SpreadReading>>;
  
  /**
   * 스프레드 리딩 업데이트
   * @param readingId 리딩 ID
   * @param request 업데이트 요청
   */
  updateSpreadReading(
    readingId: string,
    request: UpdateSpreadReadingRequest
  ): Promise<ApiResponse<SpreadReading>>;
  
  /**
   * 스프레드 리딩 저장 (완료 처리)
   * @param readingId 리딩 ID
   */
  saveSpreadReading(
    readingId: string
  ): Promise<ApiResponse<SpreadReading>>;
  
  /**
   * 스프레드 리딩 조회
   * @param readingId 리딩 ID
   */
  getSpreadReading(
    readingId: string
  ): Promise<ApiResponse<SpreadReading | null>>;
  
  /**
   * 스프레드 리딩 삭제
   * @param readingId 리딩 ID
   */
  deleteSpreadReading(
    readingId: string
  ): Promise<ApiResponse<void>>;
  
  /**
   * 사용자의 스프레드 리딩 목록 조회 (페이지네이션)
   * @param page 페이지 번호 (1부터 시작)
   * @param limit 페이지당 항목 수
   * @param filter 필터 조건
   */
  getUserSpreadReadings(
    page?: number,
    limit?: number,
    filter?: {
      readonly completed?: boolean;
      readonly spreadTypeId?: string;
      readonly startDate?: string;
      readonly endDate?: string;
      readonly tags?: readonly string[];
    }
  ): Promise<ApiResponse<PaginatedResponse<SpreadReading>>>;

  // ===== 카드 관리 =====
  
  /**
   * 모든 타로 카드 목록 조회
   * @param includeDetails 상세 정보 포함 여부
   */
  getAllCards(
    includeDetails?: boolean
  ): Promise<ApiResponse<TarotCard[]>>;
  
  /**
   * ID로 특정 타로 카드 조회
   * @param cardId 카드 ID
   */
  getCardById(
    cardId: string
  ): Promise<ApiResponse<TarotCard | null>>;
  
  /**
   * 여러 카드 ID로 카드들 조회
   * @param cardIds 카드 ID 배열
   */
  getCardsByIds(
    cardIds: readonly string[]
  ): Promise<ApiResponse<TarotCard[]>>;
  
  /**
   * 카드 검색
   * @param request 검색 요청 조건
   */
  searchCards(
    request: SearchCardsRequest
  ): Promise<ApiResponse<PaginatedResponse<TarotCard>>>;
  
  /**
   * 랜덤 카드 뽑기
   * @param count 뽑을 카드 수
   * @param excludeIds 제외할 카드 ID들
   * @param seed 일관된 랜덤을 위한 시드
   */
  drawRandomCards(
    count: number,
    excludeIds?: readonly string[],
    seed?: string
  ): Promise<ApiResponse<TarotCard[]>>;

  // ===== 통계 및 분석 =====
  
  /**
   * 사용자 타로 통계 조회
   */
  getUserTarotStatistics(): Promise<ApiResponse<{
    readonly totalDailyReadings: number;
    readonly totalSpreadReadings: number;
    readonly currentStreak: number;
    readonly longestStreak: number;
    readonly favoriteCards: readonly {
      readonly card: TarotCard;
      readonly frequency: number;
    }[];
    readonly mostUsedSpreads: readonly {
      readonly spreadType: SpreadType;
      readonly count: number;
    }[];
    readonly readingHistory: readonly {
      readonly date: string;
      readonly dailyReading: boolean;
      readonly spreadCount: number;
    }[];
  }>>;
  
  /**
   * 카드 출현 빈도 분석
   * @param dateRange 분석 기간
   */
  getCardFrequencyAnalysis(
    dateRange?: {
      readonly startDate: string;
      readonly endDate: string;
    }
  ): Promise<ApiResponse<{
    readonly cardFrequencies: readonly {
      readonly card: TarotCard;
      readonly count: number;
      readonly percentage: number;
    }[];
    readonly suitDistribution: readonly {
      readonly suit: string;
      readonly count: number;
      readonly percentage: number;
    }[];
    readonly totalCards: number;
    readonly analysisDate: string;
  }>>;
}

// ===== 편의를 위한 타입 재export =====
export type {
  TarotCard,
  SpreadType,
  DailyTarotReading,
  SpreadReading,
} from '../../types';