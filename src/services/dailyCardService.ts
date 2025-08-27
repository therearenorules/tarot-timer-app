import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseService, { TarotCard, DailyCard } from './databaseService';
import { ALL_TAROT_CARDS } from '../data/tarotCards';
import * as Notifications from 'expo-notifications';

export interface DailyCardWithDetails extends DailyCard {
  card: TarotCard;
}

class DailyCardService {
  private static instance: DailyCardService;
  private dbService: DatabaseService;

  static getInstance(): DailyCardService {
    if (!DailyCardService.instance) {
      DailyCardService.instance = new DailyCardService();
    }
    return DailyCardService.instance;
  }

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  // 오늘의 날짜를 YYYY-MM-DD 형식으로 반환
  private getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // 시드 값으로 랜덤 생성기 (일관된 결과를 위해)
  private seededRandom(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32비트 정수로 변환
    }
    
    // 선형 합동 생성기 (Linear Congruential Generator)
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    hash = Math.abs(hash);
    const random = ((a * hash + c) % m) / m;
    return random;
  }

  // 날짜 기반으로 카드 선택 (같은 날에는 항상 같은 카드)
  private selectCardForDate(date: string): { cardId: number; isReversed: boolean } {
    const seed = `${date}_card`;
    const reversedSeed = `${date}_reversed`;
    
    const cardRandom = this.seededRandom(seed);
    const reversedRandom = this.seededRandom(reversedSeed);
    
    const cardId = Math.floor(cardRandom * ALL_TAROT_CARDS.length);
    const isReversed = reversedRandom > 0.5;
    
    return { cardId, isReversed };
  }

  // 오늘의 카드 가져오기
  async getTodayCard(): Promise<DailyCardWithDetails | null> {
    const today = this.getTodayString();
    
    try {
      // 데이터베이스에서 기존 카드 확인
      let dailyCard = await this.dbService.getDailyCard(today);
      
      // 없으면 새로 생성
      if (!dailyCard) {
        const { cardId, isReversed } = this.selectCardForDate(today);
        await this.dbService.createDailyCard(today, cardId, isReversed);
        dailyCard = await this.dbService.getDailyCard(today);
      }
      
      if (!dailyCard) return null;
      
      // 카드 세부 정보 가져오기
      const card = await this.dbService.getTarotCard(dailyCard.cardId);
      if (!card) return null;
      
      return {
        ...dailyCard,
        card
      };
    } catch (error) {
      console.error('Error getting today card:', error);
      return null;
    }
  }

  // 특정 날짜의 카드 가져오기
  async getCardForDate(date: string): Promise<DailyCardWithDetails | null> {
    try {
      let dailyCard = await this.dbService.getDailyCard(date);
      
      // 없으면 생성
      if (!dailyCard) {
        const { cardId, isReversed } = this.selectCardForDate(date);
        await this.dbService.createDailyCard(date, cardId, isReversed);
        dailyCard = await this.dbService.getDailyCard(date);
      }
      
      if (!dailyCard) return null;
      
      const card = await this.dbService.getTarotCard(dailyCard.cardId);
      if (!card) return null;
      
      return {
        ...dailyCard,
        card
      };
    } catch (error) {
      console.error('Error getting card for date:', error);
      return null;
    }
  }

  // 과거 카드들 가져오기 (최근 30일)
  async getRecentCards(days: number = 30): Promise<DailyCardWithDetails[]> {
    const cards: DailyCardWithDetails[] = [];
    const today = new Date();
    
    try {
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dailyCard = await this.getCardForDate(dateString);
        if (dailyCard) {
          cards.push(dailyCard);
        }
      }
      
      return cards;
    } catch (error) {
      console.error('Error getting recent cards:', error);
      return [];
    }
  }

  // 카드 뽑기 애니메이션용 랜덤 카드들 생성
  generateShuffleCards(count: number = 10): TarotCard[] {
    const shuffled = [...ALL_TAROT_CARDS];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }

  // 연속 일수 계산
  async getStreak(): Promise<number> {
    try {
      const today = new Date();
      let streak = 0;
      
      for (let i = 0; i < 365; i++) { // 최대 1년
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dailyCard = await this.dbService.getDailyCard(dateString);
        if (dailyCard) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  // 다음 카드까지 남은 시간 계산
  getTimeUntilNextCard(): {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds, totalSeconds };
  }

  // 카드 읽기 완료 처리
  async markCardAsRead(date: string): Promise<void> {
    try {
      const key = `card_read_${date}`;
      await AsyncStorage.setItem(key, 'true');
      
      // 통계 업데이트
      await this.updateReadingStats();
    } catch (error) {
      console.error('Error marking card as read:', error);
    }
  }

  // 카드 읽기 상태 확인
  async isCardRead(date: string): Promise<boolean> {
    try {
      const key = `card_read_${date}`;
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      console.error('Error checking card read status:', error);
      return false;
    }
  }

  // 읽기 통계 업데이트
  private async updateReadingStats(): Promise<void> {
    try {
      const stats = await this.getReadingStats();
      const today = this.getTodayString();
      
      // 오늘 읽었으면 통계 업데이트
      if (await this.isCardRead(today)) {
        stats.totalReadings++;
        stats.lastReadingDate = today;
        
        // 연속 일수 계산
        stats.streakDays = await this.getStreak();
        
        await AsyncStorage.setItem('reading_stats', JSON.stringify(stats));
      }
    } catch (error) {
      console.error('Error updating reading stats:', error);
    }
  }

  // 읽기 통계 가져오기
  async getReadingStats(): Promise<{
    totalReadings: number;
    streakDays: number;
    lastReadingDate: string;
    favoriteCards: number[];
  }> {
    try {
      const statsJson = await AsyncStorage.getItem('reading_stats');
      if (statsJson) {
        return JSON.parse(statsJson);
      }
    } catch (error) {
      console.error('Error getting reading stats:', error);
    }
    
    return {
      totalReadings: 0,
      streakDays: 0,
      lastReadingDate: '',
      favoriteCards: []
    };
  }

  // 즐겨찾기 카드에 추가
  async addToFavorites(cardId: number): Promise<void> {
    try {
      const stats = await this.getReadingStats();
      if (!stats.favoriteCards.includes(cardId)) {
        stats.favoriteCards.push(cardId);
        await AsyncStorage.setItem('reading_stats', JSON.stringify(stats));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  // 즐겨찾기에서 제거
  async removeFromFavorites(cardId: number): Promise<void> {
    try {
      const stats = await this.getReadingStats();
      stats.favoriteCards = stats.favoriteCards.filter(id => id !== cardId);
      await AsyncStorage.setItem('reading_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  // 일일 알림 설정
  async scheduleDailyNotification(time: string): Promise<void> {
    try {
      // 기존 알림 취소
      await Notifications.cancelScheduledNotificationAsync('daily-card');
      
      const [hours, minutes] = time.split(':').map(Number);
      
      // 새 알림 스케줄
      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-card',
        content: {
          title: '🔮 오늘의 타로 카드',
          body: '새로운 하루, 새로운 메시지가 기다리고 있어요!',
          sound: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
    }
  }

  // 알림 취소
  async cancelDailyNotification(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync('daily-card');
    } catch (error) {
      console.error('Error cancelling daily notification:', error);
    }
  }

  // 카드 해석 생성 (AI 스타일 해석)
  generateCardInterpretation(card: TarotCard, isReversed: boolean): {
    todayMessage: string;
    advice: string;
    focus: string;
  } {
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
    const position = isReversed ? '역방향' : '정방향';
    
    // 다양한 해석 템플릿
    const templates = [
      {
        todayMessage: `${card.nameKo}(${position})이 오늘 당신에게 전하는 메시지입니다. ${meaning}의 에너지가 하루를 가득 채울 것입니다.`,
        advice: `${card.keywords[0]}을 마음에 새기며 하루를 시작해보세요. 작은 변화가 큰 기적을 만들 수 있습니다.`,
        focus: `오늘은 ${card.keywords[1]}에 특별히 주의를 기울여보세요.`
      },
      {
        todayMessage: `오늘의 카드 ${card.nameKo}는 ${meaning}을 상징합니다. 이는 당신의 현재 상황과 깊이 연결되어 있습니다.`,
        advice: `${card.keywords[2] || card.keywords[0]}의 힘을 믿고 앞으로 나아가세요. 우주가 당신을 지지하고 있습니다.`,
        focus: `${card.keywords[0]}와 ${card.keywords[1] || card.keywords[0]}의 균형을 찾는 것이 중요합니다.`
      }
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template;
  }

  // 월별 카드 통계
  async getMonthlyStats(year: number, month: number): Promise<{
    totalDays: number;
    readDays: number;
    majorArcana: number;
    minorArcana: number;
    suitCounts: { [suit: string]: number };
  }> {
    const stats = {
      totalDays: 0,
      readDays: 0,
      majorArcana: 0,
      minorArcana: 0,
      suitCounts: {
        Major: 0,
        Cups: 0,
        Wands: 0,
        Swords: 0,
        Pentacles: 0
      }
    };

    try {
      const daysInMonth = new Date(year, month, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        stats.totalDays++;
        
        const dailyCard = await this.dbService.getDailyCard(date);
        if (dailyCard) {
          const card = await this.dbService.getTarotCard(dailyCard.cardId);
          if (card) {
            if (await this.isCardRead(date)) {
              stats.readDays++;
            }
            
            if (card.type === 'major') {
              stats.majorArcana++;
            } else {
              stats.minorArcana++;
            }
            
            stats.suitCounts[card.suit]++;
          }
        }
      }
    } catch (error) {
      console.error('Error getting monthly stats:', error);
    }

    return stats;
  }
}

export default DailyCardService;