import { 
  Spread, 
  CreateSpread, 
  SpreadCard, 
  CreateSpreadCard,
  DatabaseError 
} from '../types';
import { dbConnection } from '../connection';

/**
 * Repository for managing tarot spreads and their cards
 */
export class SpreadRepository {
  
  // === SPREADS ===

  /**
   * Create a new spread
   */
  async createSpread(data: CreateSpread): Promise<Spread> {
    try {
      const result = await dbConnection.query(
        `INSERT INTO spreads (spread_type, deck_id, title, image_uri) 
         VALUES (?, ?, ?, ?)`,
        [data.spreadType, data.deckId, data.title || null, data.imageUri || null]
      );

      if (!result.insertId) {
        throw new DatabaseError('Failed to create spread');
      }

      return this.getSpreadById(result.insertId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to create spread: ${message}`);
    }
  }

  /**
   * Get spread by ID
   */
  async getSpreadById(id: number): Promise<Spread> {
    const spread = await dbConnection.queryFirst<Spread>(
      'SELECT * FROM spreads WHERE id = ?',
      [id]
    );

    if (!spread) {
      throw new DatabaseError(`Spread with ID ${id} not found`);
    }

    return spread;
  }

  /**
   * Get all spreads with optional filters
   */
  async getSpreads(params?: {
    spreadType?: string;
    deckId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Spread[]> {
    let sql = 'SELECT * FROM spreads WHERE 1=1';
    const queryParams: any[] = [];

    if (params?.spreadType) {
      sql += ' AND spread_type = ?';
      queryParams.push(params.spreadType);
    }

    if (params?.deckId) {
      sql += ' AND deck_id = ?';
      queryParams.push(params.deckId);
    }

    sql += ' ORDER BY created_at DESC';

    if (params?.limit) {
      sql += ' LIMIT ?';
      queryParams.push(params.limit);
      
      if (params?.offset) {
        sql += ' OFFSET ?';
        queryParams.push(params.offset);
      }
    }

    const result = await dbConnection.query<Spread>(sql, queryParams);
    return result.rows;
  }

  /**
   * Get spreads by type
   */
  async getSpreadsByType(spreadType: string): Promise<Spread[]> {
    return this.getSpreads({ spreadType });
  }

  /**
   * Get recent spreads
   */
  async getRecentSpreads(limit = 10): Promise<Spread[]> {
    return this.getSpreads({ limit });
  }

  /**
   * Update spread
   */
  async updateSpread(id: number, updates: Partial<Pick<Spread, 'title' | 'imageUri'>>): Promise<Spread> {
    const updateFields: string[] = [];
    const queryParams: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      queryParams.push(updates.title);
    }

    if (updates.imageUri !== undefined) {
      updateFields.push('image_uri = ?');
      queryParams.push(updates.imageUri);
    }

    if (updateFields.length === 0) {
      throw new DatabaseError('No fields to update');
    }

    queryParams.push(id);

    try {
      const result = await dbConnection.query(
        `UPDATE spreads SET ${updateFields.join(', ')} WHERE id = ?`,
        queryParams
      );

      if (result.rowsAffected === 0) {
        throw new DatabaseError(`Spread with ID ${id} not found`);
      }

      return this.getSpreadById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to update spread: ${message}`);
    }
  }

  /**
   * Delete spread and all its cards
   */
  async deleteSpread(id: number): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM spreads WHERE id = ?',
      [id]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Spread with ID ${id} not found`);
    }
  }

  // === SPREAD CARDS ===

  /**
   * Add a card to a spread
   */
  async addCardToSpread(data: CreateSpreadCard): Promise<SpreadCard> {
    try {
      const result = await dbConnection.query(
        `INSERT INTO spread_cards (spread_id, position_index, card_key, reversed, x, y, width, height) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.spreadId, 
          data.positionIndex, 
          data.cardKey, 
          data.reversed || false, 
          data.x, 
          data.y, 
          data.width, 
          data.height
        ]
      );

      if (!result.insertId) {
        throw new DatabaseError('Failed to add card to spread');
      }

      return this.getSpreadCardById(result.insertId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to add card to spread: ${message}`);
    }
  }

  /**
   * Get spread card by ID
   */
  async getSpreadCardById(id: number): Promise<SpreadCard> {
    const card = await dbConnection.queryFirst<SpreadCard>(
      'SELECT * FROM spread_cards WHERE id = ?',
      [id]
    );

    if (!card) {
      throw new DatabaseError(`Spread card with ID ${id} not found`);
    }

    return card;
  }

  /**
   * Get all cards for a spread
   */
  async getSpreadCards(spreadId: number): Promise<SpreadCard[]> {
    const result = await dbConnection.query<SpreadCard>(
      'SELECT * FROM spread_cards WHERE spread_id = ? ORDER BY position_index',
      [spreadId]
    );

    return result.rows;
  }

  /**
   * Get card at specific position in spread
   */
  async getSpreadCardByPosition(spreadId: number, positionIndex: number): Promise<SpreadCard | null> {
    return await dbConnection.queryFirst<SpreadCard>(
      'SELECT * FROM spread_cards WHERE spread_id = ? AND position_index = ?',
      [spreadId, positionIndex]
    );
  }

  /**
   * Update spread card
   */
  async updateSpreadCard(
    id: number, 
    updates: Partial<Pick<SpreadCard, 'cardKey' | 'reversed' | 'x' | 'y' | 'width' | 'height'>>
  ): Promise<SpreadCard> {
    const updateFields: string[] = [];
    const queryParams: any[] = [];

    if (updates.cardKey !== undefined) {
      updateFields.push('card_key = ?');
      queryParams.push(updates.cardKey);
    }

    if (updates.reversed !== undefined) {
      updateFields.push('reversed = ?');
      queryParams.push(updates.reversed);
    }

    if (updates.x !== undefined) {
      updateFields.push('x = ?');
      queryParams.push(updates.x);
    }

    if (updates.y !== undefined) {
      updateFields.push('y = ?');
      queryParams.push(updates.y);
    }

    if (updates.width !== undefined) {
      updateFields.push('width = ?');
      queryParams.push(updates.width);
    }

    if (updates.height !== undefined) {
      updateFields.push('height = ?');
      queryParams.push(updates.height);
    }

    if (updateFields.length === 0) {
      throw new DatabaseError('No fields to update');
    }

    queryParams.push(id);

    try {
      const result = await dbConnection.query(
        `UPDATE spread_cards SET ${updateFields.join(', ')} WHERE id = ?`,
        queryParams
      );

      if (result.rowsAffected === 0) {
        throw new DatabaseError(`Spread card with ID ${id} not found`);
      }

      return this.getSpreadCardById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to update spread card: ${message}`);
    }
  }

  /**
   * Remove card from spread
   */
  async removeSpreadCard(id: number): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM spread_cards WHERE id = ?',
      [id]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Spread card with ID ${id} not found`);
    }
  }

  /**
   * Clear all cards from a spread
   */
  async clearSpreadCards(spreadId: number): Promise<void> {
    await dbConnection.query(
      'DELETE FROM spread_cards WHERE spread_id = ?',
      [spreadId]
    );
  }

  // === UTILITY METHODS ===

  /**
   * Get complete spread with all its cards
   */
  async getCompleteSpread(id: number): Promise<Spread & { cards: SpreadCard[] }> {
    const spread = await this.getSpreadById(id);
    const cards = await this.getSpreadCards(id);

    return {
      ...spread,
      cards
    };
  }

  /**
   * Create spread with multiple cards in one transaction
   */
  async createCompleteSpread(
    spreadData: CreateSpread, 
    cardsData: CreateSpreadCard[]
  ): Promise<Spread & { cards: SpreadCard[] }> {
    try {
      // Start transaction
      const spread = await this.createSpread(spreadData);
      
      if (cardsData.length > 0) {
        // Prepare card insertion queries
        const cardQueries = cardsData.map(card => ({
          sql: `INSERT INTO spread_cards (spread_id, position_index, card_key, reversed, x, y, width, height) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [
            spread.id, 
            card.positionIndex, 
            card.cardKey, 
            card.reversed || false, 
            card.x, 
            card.y, 
            card.width, 
            card.height
          ]
        }));

        await dbConnection.transaction(cardQueries);
      }

      return this.getCompleteSpread(spread.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to create complete spread: ${message}`);
    }
  }

  /**
   * Get spread statistics
   */
  async getSpreadStats(): Promise<{
    totalSpreads: number;
    spreadsByType: Record<string, number>;
    recentSpreadsCount: number;
  }> {
    // Get total spreads
    const totalResult = await dbConnection.queryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM spreads'
    );

    // Get spreads by type
    const typeResult = await dbConnection.query<{ spread_type: string; count: number }>(
      'SELECT spread_type, COUNT(*) as count FROM spreads GROUP BY spread_type'
    );

    // Get recent spreads (last 7 days)
    const recentResult = await dbConnection.queryFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM spreads 
       WHERE created_at >= datetime('now', '-7 days')`
    );

    const spreadsByType: Record<string, number> = {};
    typeResult.rows.forEach(row => {
      spreadsByType[row.spread_type] = row.count;
    });

    return {
      totalSpreads: totalResult?.count || 0,
      spreadsByType,
      recentSpreadsCount: recentResult?.count || 0
    };
  }
}