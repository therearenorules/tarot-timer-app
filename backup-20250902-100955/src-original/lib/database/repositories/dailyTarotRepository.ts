import { 
  DailySession, 
  CreateDailySession, 
  DailyCard, 
  CreateDailyCard, 
  UpdateDailyCard,
  DatabaseError 
} from '../types';
import { dbConnection } from '../connection';

/**
 * Repository for managing daily tarot sessions and cards
 */
export class DailyTarotRepository {
  
  // === DAILY SESSIONS ===

  /**
   * Create a new daily session
   */
  async createSession(data: CreateDailySession): Promise<DailySession> {
    try {
      const result = await dbConnection.query(
        `INSERT INTO daily_sessions (date, seed, deck_id) 
         VALUES (?, ?, ?)`,
        [data.date, data.seed, data.deckId || 'classic']
      );

      if (!result.insertId) {
        throw new DatabaseError('Failed to create daily session');
      }

      return this.getSessionById(result.insertId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to create daily session: ${message}`);
    }
  }

  /**
   * Get session by ID
   */
  async getSessionById(id: number): Promise<DailySession> {
    const session = await dbConnection.queryFirst<DailySession>(
      'SELECT * FROM daily_sessions WHERE id = ?',
      [id]
    );

    if (!session) {
      throw new DatabaseError(`Daily session with ID ${id} not found`);
    }

    return session;
  }

  /**
   * Get session by date
   */
  async getSessionByDate(date: string): Promise<DailySession | null> {
    return await dbConnection.queryFirst<DailySession>(
      'SELECT * FROM daily_sessions WHERE date = ?',
      [date]
    );
  }

  /**
   * Get or create today's session
   */
  async getTodaySession(deckId = 'classic'): Promise<DailySession> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Try to get existing session
    let session = await this.getSessionByDate(today);
    
    if (!session) {
      // Create new session with random seed
      const seed = Math.random().toString(36).substring(2);
      session = await this.createSession({
        date: today,
        seed,
        deckId
      });
    }

    return session;
  }

  /**
   * Get recent sessions
   */
  async getRecentSessions(limit = 10): Promise<DailySession[]> {
    const result = await dbConnection.query<DailySession>(
      'SELECT * FROM daily_sessions ORDER BY date DESC LIMIT ?',
      [limit]
    );

    return result.rows;
  }

  /**
   * Delete session and all its cards
   */
  async deleteSession(id: number): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM daily_sessions WHERE id = ?',
      [id]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Daily session with ID ${id} not found`);
    }
  }

  // === DAILY CARDS ===

  /**
   * Create a new daily card
   */
  async createCard(data: CreateDailyCard): Promise<DailyCard> {
    try {
      const result = await dbConnection.query(
        `INSERT INTO daily_cards (session_id, hour, card_key, memo) 
         VALUES (?, ?, ?, ?)`,
        [data.sessionId, data.hour, data.cardKey, data.memo || null]
      );

      if (!result.insertId) {
        throw new DatabaseError('Failed to create daily card');
      }

      return this.getCardById(result.insertId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to create daily card: ${message}`);
    }
  }

  /**
   * Get card by ID
   */
  async getCardById(id: number): Promise<DailyCard> {
    const card = await dbConnection.queryFirst<DailyCard>(
      'SELECT * FROM daily_cards WHERE id = ?',
      [id]
    );

    if (!card) {
      throw new DatabaseError(`Daily card with ID ${id} not found`);
    }

    return card;
  }

  /**
   * Get all cards for a session
   */
  async getCardsBySession(sessionId: number): Promise<DailyCard[]> {
    const result = await dbConnection.query<DailyCard>(
      'SELECT * FROM daily_cards WHERE session_id = ? ORDER BY hour',
      [sessionId]
    );

    return result.rows;
  }

  /**
   * Get card for specific session and hour
   */
  async getCardBySessionHour(sessionId: number, hour: number): Promise<DailyCard | null> {
    return await dbConnection.queryFirst<DailyCard>(
      'SELECT * FROM daily_cards WHERE session_id = ? AND hour = ?',
      [sessionId, hour]
    );
  }

  /**
   * Update daily card memo
   */
  async updateCard(data: UpdateDailyCard): Promise<DailyCard> {
    try {
      const result = await dbConnection.query(
        `UPDATE daily_cards 
         SET memo = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [data.memo || null, data.id]
      );

      if (result.rowsAffected === 0) {
        throw new DatabaseError(`Daily card with ID ${data.id} not found`);
      }

      return this.getCardById(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to update daily card: ${message}`);
    }
  }

  /**
   * Update or create card memo for session/hour
   */
  async upsertCardMemo(sessionId: number, hour: number, memo: string): Promise<DailyCard> {
    // Try to update existing card
    const existingCard = await this.getCardBySessionHour(sessionId, hour);
    
    if (existingCard) {
      return this.updateCard({ id: existingCard.id, memo });
    } else {
      throw new DatabaseError('Cannot update memo for non-existent card. Create card first.');
    }
  }

  /**
   * Delete daily card
   */
  async deleteCard(id: number): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM daily_cards WHERE id = ?',
      [id]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Daily card with ID ${id} not found`);
    }
  }

  /**
   * Get cards with memos for a date range
   */
  async getCardsWithMemos(startDate: string, endDate?: string): Promise<(DailyCard & { sessionDate: string })[]> {
    const endDateParam = endDate || startDate;
    
    const result = await dbConnection.query<DailyCard & { sessionDate: string }>(
      `SELECT dc.*, ds.date as sessionDate 
       FROM daily_cards dc 
       JOIN daily_sessions ds ON dc.session_id = ds.id 
       WHERE ds.date >= ? AND ds.date <= ? AND dc.memo IS NOT NULL
       ORDER BY ds.date DESC, dc.hour`,
      [startDate, endDateParam]
    );

    return result.rows;
  }

  /**
   * Generate 24 cards for a session (utility method)
   */
  async generateSessionCards(sessionId: number, cards: string[]): Promise<DailyCard[]> {
    if (cards.length !== 24) {
      throw new DatabaseError('Must provide exactly 24 cards for daily session');
    }

    try {
      const cardData: CreateDailyCard[] = cards.map((cardKey, hour) => ({
        sessionId,
        hour,
        cardKey
      }));

      // Insert all cards in a transaction
      const queries = cardData.map(card => ({
        sql: 'INSERT INTO daily_cards (session_id, hour, card_key) VALUES (?, ?, ?)',
        params: [card.sessionId, card.hour, card.cardKey]
      }));

      await dbConnection.transaction(queries);

      // Return all cards for the session
      return this.getCardsBySession(sessionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to generate session cards: ${message}`);
    }
  }

  /**
   * Get session completion status
   */
  async getSessionStats(sessionId: number): Promise<{
    totalCards: number;
    cardsWithMemos: number;
    completionPercentage: number;
  }> {
    const result = await dbConnection.query<{
      totalCards: number;
      cardsWithMemos: number;
    }>(
      `SELECT 
        COUNT(*) as totalCards,
        COUNT(memo) as cardsWithMemos 
       FROM daily_cards 
       WHERE session_id = ?`,
      [sessionId]
    );

    const stats = result.rows[0];
    return {
      totalCards: stats.totalCards,
      cardsWithMemos: stats.cardsWithMemos,
      completionPercentage: stats.totalCards > 0 
        ? Math.round((stats.cardsWithMemos / stats.totalCards) * 100)
        : 0
    };
  }
}