import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TarotCard {
  id: number;
  name: string;
  nameKo: string;
  suit: string;
  type: 'major' | 'minor';
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  imageUrl: string;
}

export interface DailyCard {
  id: number;
  date: string;
  cardId: number;
  isReversed: boolean;
  createdAt: string;
}

export interface SpreadResult {
  id: number;
  spreadType: string;
  cards: {
    position: string;
    cardId: number;
    isReversed: boolean;
  }[];
  interpretation: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: number;
  date: string;
  content: string;
  mood: number;
  tags: string[];
  cardId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  dailyCardTime: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  adsRemoved: boolean;
  lastBackup: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('tarot_timer.db');
      await this.createTables();
      await this.seedTarotCards();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      `CREATE TABLE IF NOT EXISTS tarot_cards (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        name_ko TEXT NOT NULL,
        suit TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('major', 'minor')),
        upright_meaning TEXT NOT NULL,
        reversed_meaning TEXT NOT NULL,
        keywords TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS daily_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        card_id INTEGER NOT NULL,
        is_reversed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES tarot_cards (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS spread_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spread_type TEXT NOT NULL,
        cards TEXT NOT NULL,
        interpretation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS diary_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        mood INTEGER CHECK (mood >= 1 AND mood <= 5),
        tags TEXT DEFAULT '[]',
        card_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES tarot_cards (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS user_stats (
        id INTEGER PRIMARY KEY,
        total_readings INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_reading_date TEXT,
        favorite_cards TEXT DEFAULT '[]',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }

    // Create indexes for better performance
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_daily_cards_date ON daily_cards(date)`,
      `CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date)`,
      `CREATE INDEX IF NOT EXISTS idx_spread_results_date ON spread_results(created_at)`
    ];

    for (const index of indexes) {
      await this.db.execAsync(index);
    }
  }

  async getTarotCard(id: number): Promise<TarotCard | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM tarot_cards WHERE id = ?',
      [id]
    ) as any;
    
    if (!result) return null;
    
    return {
      id: result.id,
      name: result.name,
      nameKo: result.name_ko,
      suit: result.suit,
      type: result.type,
      uprightMeaning: result.upright_meaning,
      reversedMeaning: result.reversed_meaning,
      keywords: JSON.parse(result.keywords),
      imageUrl: result.image_url
    };
  }

  async getAllTarotCards(): Promise<TarotCard[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync('SELECT * FROM tarot_cards ORDER BY id') as any[];
    
    return results.map(result => ({
      id: result.id,
      name: result.name,
      nameKo: result.name_ko,
      suit: result.suit,
      type: result.type,
      uprightMeaning: result.upright_meaning,
      reversedMeaning: result.reversed_meaning,
      keywords: JSON.parse(result.keywords),
      imageUrl: result.image_url
    }));
  }

  async getDailyCard(date: string): Promise<DailyCard | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM daily_cards WHERE date = ?',
      [date]
    ) as any;
    
    if (!result) return null;
    
    return {
      id: result.id,
      date: result.date,
      cardId: result.card_id,
      isReversed: result.is_reversed,
      createdAt: result.created_at
    };
  }

  async createDailyCard(date: string, cardId: number, isReversed: boolean): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'INSERT OR REPLACE INTO daily_cards (date, card_id, is_reversed) VALUES (?, ?, ?)',
      [date, cardId, isReversed]
    );
  }

  async saveSpreadResult(spreadResult: Omit<SpreadResult, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO spread_results (spread_type, cards, interpretation) VALUES (?, ?, ?)',
      [spreadResult.spreadType, JSON.stringify(spreadResult.cards), spreadResult.interpretation]
    );
    
    return result.lastInsertRowId;
  }

  async getSpreadResults(limit: number = 10): Promise<SpreadResult[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync(
      'SELECT * FROM spread_results ORDER BY created_at DESC LIMIT ?',
      [limit]
    ) as any[];
    
    return results.map(result => ({
      id: result.id,
      spreadType: result.spread_type,
      cards: JSON.parse(result.cards),
      interpretation: result.interpretation,
      createdAt: result.created_at
    }));
  }

  async saveDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO diary_entries (date, content, mood, tags, card_id) VALUES (?, ?, ?, ?, ?)',
      [entry.date, entry.content, entry.mood, JSON.stringify(entry.tags), entry.cardId]
    );
    
    return result.lastInsertRowId;
  }

  async getDiaryEntries(limit: number = 30): Promise<DiaryEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const results = await this.db.getAllAsync(
      'SELECT * FROM diary_entries ORDER BY date DESC LIMIT ?',
      [limit]
    ) as any[];
    
    return results.map(result => ({
      id: result.id,
      date: result.date,
      content: result.content,
      mood: result.mood,
      tags: JSON.parse(result.tags),
      cardId: result.card_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  async updateDiaryEntry(id: number, updates: Partial<DiaryEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const fields = [];
    const values = [];
    
    if (updates.content) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.mood) {
      fields.push('mood = ?');
      values.push(updates.mood);
    }
    if (updates.tags) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await this.db.runAsync(
      `UPDATE diary_entries SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteDiaryEntry(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync('DELETE FROM diary_entries WHERE id = ?', [id]);
  }

  async getSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem('user_settings');
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    // Default settings
    return {
      notificationsEnabled: true,
      dailyCardTime: '09:00',
      theme: 'auto',
      language: 'ko',
      adsRemoved: false,
      lastBackup: ''
    };
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  private async seedTarotCards(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Check if cards already exist
    const existingCards = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM tarot_cards') as any;
    if (existingCards.count > 0) return;
    
    // Major Arcana (22 cards)
    const majorArcana = [
      {
        id: 0,
        name: 'The Fool',
        nameKo: '바보',
        suit: 'Major',
        type: 'major',
        uprightMeaning: '새로운 시작, 순수함, 자발성, 자유로운 정신',
        reversedMeaning: '경솔함, 무모함, 어리석은 행동, 위험을 감수',
        keywords: ['새출발', '모험', '순수', '자발성'],
        imageUrl: '/images/tarot/major/00-fool.jpg'
      },
      {
        id: 1,
        name: 'The Magician',
        nameKo: '마법사',
        suit: 'Major',
        type: 'major',
        uprightMeaning: '의지력, 창조력, 집중력, 실행력',
        reversedMeaning: '조작, 속임수, 능력 부족, 방향성 상실',
        keywords: ['창조', '의지', '실행', '집중'],
        imageUrl: '/images/tarot/major/01-magician.jpg'
      }
      // ... 나머지 20장의 메이저 아르카나 카드들을 여기에 추가
    ];

    // Minor Arcana suits
    const suits = ['Cups', 'Wands', 'Swords', 'Pentacles'];
    const suitKorean = ['컵', '완드', '소드', '펜타클'];
    const minorArcana = [];

    suits.forEach((suit, suitIndex) => {
      for (let i = 1; i <= 14; i++) {
        let name, nameKo;
        if (i === 1) {
          name = `Ace of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 에이스`;
        } else if (i === 11) {
          name = `Page of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 페이지`;
        } else if (i === 12) {
          name = `Knight of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 기사`;
        } else if (i === 13) {
          name = `Queen of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 여왕`;
        } else if (i === 14) {
          name = `King of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 왕`;
        } else {
          name = `${i} of ${suit}`;
          nameKo = `${suitKorean[suitIndex]}의 ${i}`;
        }

        minorArcana.push({
          id: 22 + suitIndex * 14 + (i - 1),
          name,
          nameKo,
          suit,
          type: 'minor',
          uprightMeaning: `${suit} ${i} 정방향 의미`,
          reversedMeaning: `${suit} ${i} 역방향 의미`,
          keywords: [suit.toLowerCase(), i.toString()],
          imageUrl: `/images/tarot/minor/${suit.toLowerCase()}/${i.toString().padStart(2, '0')}.jpg`
        });
      }
    });

    const allCards = [...majorArcana, ...minorArcana];

    for (const card of allCards) {
      await this.db.runAsync(
        'INSERT INTO tarot_cards (id, name, name_ko, suit, type, upright_meaning, reversed_meaning, keywords, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          card.id,
          card.name,
          card.nameKo,
          card.suit,
          card.type,
          card.uprightMeaning,
          card.reversedMeaning,
          JSON.stringify(card.keywords),
          card.imageUrl
        ]
      );
    }
  }
}

export default DatabaseService;