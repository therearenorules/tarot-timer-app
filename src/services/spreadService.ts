import DatabaseService, { TarotCard, SpreadResult } from './databaseService';
import { ALL_TAROT_CARDS } from '../data/tarotCards';

export interface SpreadPosition {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
}

export interface SpreadType {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  positions: SpreadPosition[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'love' | 'career' | 'general' | 'spiritual';
}

export interface SpreadCard {
  position: SpreadPosition;
  card: TarotCard;
  isReversed: boolean;
}

export interface DetailedSpreadResult extends SpreadResult {
  spreadType: SpreadType;
  spreadCards: SpreadCard[];
  detailedInterpretation: {
    overall: string;
    positions: { [positionId: string]: string };
    advice: string;
    timeframe: string;
  };
}

class SpreadService {
  private static instance: SpreadService;
  private dbService: DatabaseService;
  private spreadTypes: SpreadType[];

  static getInstance(): SpreadService {
    if (!SpreadService.instance) {
      SpreadService.instance = new SpreadService();
    }
    return SpreadService.instance;
  }

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.spreadTypes = this.initializeSpreadTypes();
  }

  private initializeSpreadTypes(): SpreadType[] {
    return [
      // 1. 간단한 원 카드 스프레드
      {
        id: 'one_card',
        name: 'One Card Reading',
        nameKo: '원 카드 리딩',
        description: '하나의 카드로 현재 상황이나 질문에 대한 간단한 답을 얻습니다.',
        difficulty: 'beginner',
        category: 'general',
        positions: [
          {
            id: 'main',
            name: 'Main Card',
            nameKo: '메인 카드',
            description: '현재 상황에 대한 핵심 메시지',
            x: 50,
            y: 50
          }
        ]
      },

      // 2. 과거-현재-미래 스프레드
      {
        id: 'past_present_future',
        name: 'Past Present Future',
        nameKo: '과거-현재-미래',
        description: '시간의 흐름에 따른 상황의 변화를 살펴봅니다.',
        difficulty: 'beginner',
        category: 'general',
        positions: [
          {
            id: 'past',
            name: 'Past',
            nameKo: '과거',
            description: '과거의 영향이나 원인',
            x: 25,
            y: 50
          },
          {
            id: 'present',
            name: 'Present',
            nameKo: '현재',
            description: '현재 상황',
            x: 50,
            y: 50
          },
          {
            id: 'future',
            name: 'Future',
            nameKo: '미래',
            description: '미래의 가능성',
            x: 75,
            y: 50
          }
        ]
      },

      // 3. 연애 관계 스프레드
      {
        id: 'love_relationship',
        name: 'Love & Relationship',
        nameKo: '연애 관계',
        description: '연애나 관계에 대한 깊이 있는 통찰을 제공합니다.',
        difficulty: 'intermediate',
        category: 'love',
        positions: [
          {
            id: 'you',
            name: 'You',
            nameKo: '나',
            description: '당신의 현재 상태',
            x: 30,
            y: 30
          },
          {
            id: 'partner',
            name: 'Partner',
            nameKo: '상대방',
            description: '상대방의 현재 상태',
            x: 70,
            y: 30
          },
          {
            id: 'relationship',
            name: 'Relationship',
            nameKo: '관계',
            description: '두 사람 사이의 관계',
            x: 50,
            y: 50
          },
          {
            id: 'challenge',
            name: 'Challenge',
            nameKo: '도전과제',
            description: '극복해야 할 문제',
            x: 30,
            y: 70
          },
          {
            id: 'outcome',
            name: 'Outcome',
            nameKo: '결과',
            description: '관계의 미래',
            x: 70,
            y: 70
          }
        ]
      },

      // 4. 직업/진로 스프레드
      {
        id: 'career',
        name: 'Career Path',
        nameKo: '직업/진로',
        description: '직업이나 진로에 대한 조언을 얻습니다.',
        difficulty: 'intermediate',
        category: 'career',
        positions: [
          {
            id: 'current_job',
            name: 'Current Situation',
            nameKo: '현재 상황',
            description: '현재 직업 상황',
            x: 50,
            y: 20
          },
          {
            id: 'strengths',
            name: 'Strengths',
            nameKo: '강점',
            description: '당신의 강점',
            x: 25,
            y: 40
          },
          {
            id: 'weaknesses',
            name: 'Challenges',
            nameKo: '약점/도전',
            description: '개선이 필요한 부분',
            x: 75,
            y: 40
          },
          {
            id: 'opportunities',
            name: 'Opportunities',
            nameKo: '기회',
            description: '다가오는 기회',
            x: 25,
            y: 60
          },
          {
            id: 'advice',
            name: 'Advice',
            nameKo: '조언',
            description: '진로에 대한 조언',
            x: 75,
            y: 60
          },
          {
            id: 'outcome',
            name: 'Future Path',
            nameKo: '미래 방향',
            description: '미래 진로의 방향',
            x: 50,
            y: 80
          }
        ]
      },

      // 5. 켈트 십자 스프레드 (고급)
      {
        id: 'celtic_cross',
        name: 'Celtic Cross',
        nameKo: '켈트 십자',
        description: '가장 전통적이고 포괄적인 스프레드로 복잡한 상황을 분석합니다.',
        difficulty: 'advanced',
        category: 'general',
        positions: [
          {
            id: 'present',
            name: 'Present Situation',
            nameKo: '현재 상황',
            description: '현재의 상황과 에너지',
            x: 40,
            y: 50
          },
          {
            id: 'challenge',
            name: 'Challenge/Cross',
            nameKo: '도전/십자가',
            description: '현재 직면한 도전이나 갈등',
            x: 40,
            y: 35
          },
          {
            id: 'distant_past',
            name: 'Distant Past',
            nameKo: '과거',
            description: '과거의 영향',
            x: 25,
            y: 50
          },
          {
            id: 'recent_past',
            name: 'Recent Past',
            nameKo: '최근 과거',
            description: '최근 과거의 사건',
            x: 40,
            y: 65
          },
          {
            id: 'possible_outcome',
            name: 'Possible Outcome',
            nameKo: '가능한 결과',
            description: '가능한 미래의 결과',
            x: 55,
            y: 50
          },
          {
            id: 'near_future',
            name: 'Near Future',
            nameKo: '가까운 미래',
            description: '가까운 미래의 상황',
            x: 40,
            y: 20
          },
          {
            id: 'your_approach',
            name: 'Your Approach',
            nameKo: '당신의 접근',
            description: '상황에 대한 당신의 접근 방식',
            x: 75,
            y: 80
          },
          {
            id: 'external_influences',
            name: 'External Influences',
            nameKo: '외부 영향',
            description: '외부 환경의 영향',
            x: 75,
            y: 65
          },
          {
            id: 'hopes_fears',
            name: 'Hopes & Fears',
            nameKo: '희망과 두려움',
            description: '내면의 희망과 두려움',
            x: 75,
            y: 50
          },
          {
            id: 'final_outcome',
            name: 'Final Outcome',
            nameKo: '최종 결과',
            description: '최종적인 결과',
            x: 75,
            y: 35
          }
        ]
      },

      // 6. 영적 성장 스프레드
      {
        id: 'spiritual_growth',
        name: 'Spiritual Growth',
        nameKo: '영적 성장',
        description: '영적 성장과 깨달음에 대한 통찰을 제공합니다.',
        difficulty: 'intermediate',
        category: 'spiritual',
        positions: [
          {
            id: 'current_spiritual_state',
            name: 'Current Spiritual State',
            nameKo: '현재 영적 상태',
            description: '현재의 영적 발달 수준',
            x: 50,
            y: 25
          },
          {
            id: 'spiritual_challenge',
            name: 'Spiritual Challenge',
            nameKo: '영적 도전',
            description: '극복해야 할 영적 장애물',
            x: 25,
            y: 50
          },
          {
            id: 'spiritual_strength',
            name: 'Spiritual Strength',
            nameKo: '영적 강점',
            description: '영적인 강점과 재능',
            x: 75,
            y: 50
          },
          {
            id: 'lesson_to_learn',
            name: 'Lesson to Learn',
            nameKo: '배워야 할 교훈',
            description: '현재 배워야 할 영적 교훈',
            x: 50,
            y: 75
          }
        ]
      }
    ];
  }

  // 사용 가능한 스프레드 타입 목록 반환
  getAvailableSpreadTypes(): SpreadType[] {
    return this.spreadTypes;
  }

  // 난이도별 스프레드 필터링
  getSpreadsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): SpreadType[] {
    return this.spreadTypes.filter(spread => spread.difficulty === difficulty);
  }

  // 카테고리별 스프레드 필터링
  getSpreadsByCategory(category: 'love' | 'career' | 'general' | 'spiritual'): SpreadType[] {
    return this.spreadTypes.filter(spread => spread.category === category);
  }

  // 특정 스프레드 타입 가져오기
  getSpreadType(id: string): SpreadType | null {
    return this.spreadTypes.find(spread => spread.id === id) || null;
  }

  // 카드 셔플 (Fisher-Yates 알고리즘)
  private shuffleCards(): TarotCard[] {
    const cards = [...ALL_TAROT_CARDS];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  // 스프레드 실행
  async performSpread(spreadId: string): Promise<DetailedSpreadResult | null> {
    try {
      const spreadType = this.getSpreadType(spreadId);
      if (!spreadType) return null;

      const shuffledCards = this.shuffleCards();
      const spreadCards: SpreadCard[] = [];
      const cards: { position: string; cardId: number; isReversed: boolean }[] = [];

      // 각 포지션에 카드 배치
      for (let i = 0; i < spreadType.positions.length; i++) {
        const position = spreadType.positions[i];
        const card = shuffledCards[i];
        const isReversed = Math.random() > 0.7; // 30% 확률로 역방향

        spreadCards.push({
          position,
          card,
          isReversed
        });

        cards.push({
          position: position.id,
          cardId: card.id,
          isReversed
        });
      }

      // 해석 생성
      const interpretation = this.generateSpreadInterpretation(spreadType, spreadCards);

      // 데이터베이스에 저장
      const resultId = await this.dbService.saveSpreadResult({
        spreadType: spreadId,
        cards,
        interpretation: interpretation.overall
      });

      // 상세 결과 반환
      const result: DetailedSpreadResult = {
        id: resultId,
        spreadType: spreadId,
        cards,
        interpretation: interpretation.overall,
        createdAt: new Date().toISOString(),
        spreadType: spreadType,
        spreadCards,
        detailedInterpretation: interpretation
      };

      return result;
    } catch (error) {
      console.error('Error performing spread:', error);
      return null;
    }
  }

  // 스프레드 해석 생성
  private generateSpreadInterpretation(
    spreadType: SpreadType,
    spreadCards: SpreadCard[]
  ): {
    overall: string;
    positions: { [positionId: string]: string };
    advice: string;
    timeframe: string;
  } {
    const positions: { [positionId: string]: string } = {};
    let overallThemes: string[] = [];

    // 각 포지션별 해석
    for (const spreadCard of spreadCards) {
      const { position, card, isReversed } = spreadCard;
      const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
      const orientation = isReversed ? '역방향' : '정방향';

      positions[position.id] = `${position.nameKo}에서 ${card.nameKo}(${orientation})이 나타났습니다. ${meaning}을 의미하며, ${position.description}과 관련하여 ${card.keywords.slice(0, 2).join(', ')}의 에너지가 강조됩니다.`;
      
      overallThemes.push(...card.keywords);
    }

    // 전체적인 해석
    const mainThemes = [...new Set(overallThemes)].slice(0, 5);
    const overall = `이번 ${spreadType.nameKo} 스프레드에서는 ${mainThemes.join(', ')}의 테마가 두드러집니다. ${spreadType.description} 전체적으로 균형과 조화를 찾아가는 과정에서 새로운 깨달음을 얻을 수 있는 시기입니다.`;

    // 조언 생성
    const advice = this.generateAdviceFromCards(spreadCards, spreadType);

    // 시간대 설정
    const timeframe = this.getTimeframeForSpread(spreadType);

    return {
      overall,
      positions,
      advice,
      timeframe
    };
  }

  // 카드들을 바탕으로 조언 생성
  private generateAdviceFromCards(spreadCards: SpreadCard[], spreadType: SpreadType): string {
    const majorArcanaCount = spreadCards.filter(sc => sc.card.type === 'major').length;
    const reversedCount = spreadCards.filter(sc => sc.isReversed).length;
    
    let advice = '';

    if (majorArcanaCount >= spreadCards.length / 2) {
      advice += '메이저 아르카나 카드가 많이 나왔습니다. 이는 운명적이고 중요한 변화의 시기임을 의미합니다. ';
    }

    if (reversedCount >= spreadCards.length / 2) {
      advice += '역방향 카드가 많이 나타났습니다. 내적 성찰과 기다림이 필요한 시기입니다. ';
    }

    // 스프레드 타입별 맞춤 조언
    switch (spreadType.category) {
      case 'love':
        advice += '사랑에 있어서는 진정성과 소통이 가장 중요합니다. 상대방을 이해하려는 마음을 가지세요.';
        break;
      case 'career':
        advice += '직업적으로는 현재의 기회를 놓치지 말고, 지속적인 성장을 위해 노력하세요.';
        break;
      case 'spiritual':
        advice += '영적인 성장을 위해서는 명상과 성찰의 시간을 가지며, 내면의 목소리에 귀 기울이세요.';
        break;
      default:
        advice += '현재 상황을 긍정적으로 받아들이고, 변화에 열린 마음을 가지세요.';
    }

    return advice;
  }

  // 스프레드별 시간대 설정
  private getTimeframeForSpread(spreadType: SpreadType): string {
    switch (spreadType.id) {
      case 'one_card':
        return '현재 ~ 1주일';
      case 'past_present_future':
        return '과거 ~ 3개월 후';
      case 'love_relationship':
        return '현재 ~ 6개월';
      case 'career':
        return '현재 ~ 1년';
      case 'celtic_cross':
        return '1년간의 전체적인 흐름';
      case 'spiritual_growth':
        return '현재 영적 여정의 단계';
      default:
        return '현재 ~ 3개월';
    }
  }

  // 저장된 스프레드 결과들 가져오기
  async getSavedSpreads(limit: number = 10): Promise<SpreadResult[]> {
    try {
      return await this.dbService.getSpreadResults(limit);
    } catch (error) {
      console.error('Error getting saved spreads:', error);
      return [];
    }
  }

  // 저장된 스프레드의 상세 정보 복원
  async getDetailedSpreadResult(spreadResult: SpreadResult): Promise<DetailedSpreadResult | null> {
    try {
      const spreadType = this.getSpreadType(spreadResult.spreadType);
      if (!spreadType) return null;

      const spreadCards: SpreadCard[] = [];

      for (const cardInfo of spreadResult.cards) {
        const position = spreadType.positions.find(p => p.id === cardInfo.position);
        const card = await this.dbService.getTarotCard(cardInfo.cardId);
        
        if (position && card) {
          spreadCards.push({
            position,
            card,
            isReversed: cardInfo.isReversed
          });
        }
      }

      const detailedInterpretation = this.generateSpreadInterpretation(spreadType, spreadCards);

      return {
        ...spreadResult,
        spreadType: spreadType,
        spreadCards,
        detailedInterpretation
      };
    } catch (error) {
      console.error('Error getting detailed spread result:', error);
      return null;
    }
  }

  // 스프레드 통계
  async getSpreadStats(): Promise<{
    totalSpreads: number;
    favoriteSpread: string;
    spreadCounts: { [spreadId: string]: number };
    lastSpreadDate: string;
  }> {
    try {
      const spreads = await this.dbService.getSpreadResults(1000); // 최대 1000개
      
      const stats = {
        totalSpreads: spreads.length,
        favoriteSpread: '',
        spreadCounts: {} as { [spreadId: string]: number },
        lastSpreadDate: spreads.length > 0 ? spreads[0].createdAt : ''
      };

      // 스프레드 타입별 카운트
      for (const spread of spreads) {
        stats.spreadCounts[spread.spreadType] = (stats.spreadCounts[spread.spreadType] || 0) + 1;
      }

      // 가장 많이 사용한 스프레드 찾기
      let maxCount = 0;
      for (const [spreadId, count] of Object.entries(stats.spreadCounts)) {
        if (count > maxCount) {
          maxCount = count;
          stats.favoriteSpread = spreadId;
        }
      }

      return stats;
    } catch (error) {
      console.error('Error getting spread stats:', error);
      return {
        totalSpreads: 0,
        favoriteSpread: '',
        spreadCounts: {},
        lastSpreadDate: ''
      };
    }
  }
}

export default SpreadService;