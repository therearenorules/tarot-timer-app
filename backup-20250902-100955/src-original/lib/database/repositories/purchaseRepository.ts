import { 
  Purchase, 
  CreatePurchase,
  DatabaseError 
} from '../types';
import { dbConnection } from '../connection';

/**
 * Repository for managing in-app purchases and subscriptions
 */
export class PurchaseRepository {

  /**
   * Create a new purchase record
   */
  async createPurchase(data: CreatePurchase): Promise<Purchase> {
    try {
      const result = await dbConnection.query(
        `INSERT INTO purchases (product_id, platform, is_active) 
         VALUES (?, ?, ?)`,
        [data.productId, data.platform, data.isActive !== false]
      );

      if (!result.insertId) {
        throw new DatabaseError('Failed to create purchase record');
      }

      return this.getPurchaseById(result.insertId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to create purchase: ${message}`);
    }
  }

  /**
   * Get purchase by ID
   */
  async getPurchaseById(id: number): Promise<Purchase> {
    const purchase = await dbConnection.queryFirst<Purchase>(
      'SELECT * FROM purchases WHERE id = ?',
      [id]
    );

    if (!purchase) {
      throw new DatabaseError(`Purchase with ID ${id} not found`);
    }

    return purchase;
  }

  /**
   * Get purchase by product ID
   */
  async getPurchaseByProductId(productId: string): Promise<Purchase | null> {
    return await dbConnection.queryFirst<Purchase>(
      'SELECT * FROM purchases WHERE product_id = ? ORDER BY purchase_date DESC',
      [productId]
    );
  }

  /**
   * Get all purchases for a platform
   */
  async getPurchasesByPlatform(platform: 'ios' | 'android'): Promise<Purchase[]> {
    const result = await dbConnection.query<Purchase>(
      'SELECT * FROM purchases WHERE platform = ? ORDER BY purchase_date DESC',
      [platform]
    );

    return result.rows;
  }

  /**
   * Get all active purchases
   */
  async getActivePurchases(): Promise<Purchase[]> {
    const result = await dbConnection.query<Purchase>(
      'SELECT * FROM purchases WHERE is_active = TRUE ORDER BY purchase_date DESC'
    );

    return result.rows;
  }

  /**
   * Get all purchases
   */
  async getAllPurchases(): Promise<Purchase[]> {
    const result = await dbConnection.query<Purchase>(
      'SELECT * FROM purchases ORDER BY purchase_date DESC'
    );

    return result.rows;
  }

  /**
   * Check if product is purchased and active
   */
  async isPurchaseActive(productId: string): Promise<boolean> {
    const result = await dbConnection.queryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM purchases WHERE product_id = ? AND is_active = TRUE',
      [productId]
    );

    return (result?.count || 0) > 0;
  }

  /**
   * Activate a purchase
   */
  async activatePurchase(productId: string): Promise<Purchase> {
    const result = await dbConnection.query(
      'UPDATE purchases SET is_active = TRUE WHERE product_id = ?',
      [productId]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Purchase with product ID '${productId}' not found`);
    }

    const purchase = await this.getPurchaseByProductId(productId);
    if (!purchase) {
      throw new DatabaseError(`Failed to retrieve purchase after activation`);
    }

    return purchase;
  }

  /**
   * Deactivate a purchase
   */
  async deactivatePurchase(productId: string): Promise<Purchase> {
    const result = await dbConnection.query(
      'UPDATE purchases SET is_active = FALSE WHERE product_id = ?',
      [productId]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Purchase with product ID '${productId}' not found`);
    }

    const purchase = await this.getPurchaseByProductId(productId);
    if (!purchase) {
      throw new DatabaseError(`Failed to retrieve purchase after deactivation`);
    }

    return purchase;
  }

  /**
   * Delete purchase record
   */
  async deletePurchase(id: number): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM purchases WHERE id = ?',
      [id]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Purchase with ID ${id} not found`);
    }
  }

  /**
   * Delete purchase by product ID
   */
  async deletePurchaseByProductId(productId: string): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM purchases WHERE product_id = ?',
      [productId]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Purchase with product ID '${productId}' not found`);
    }
  }

  // === UTILITY METHODS ===

  /**
   * Restore purchases (mark as active)
   */
  async restorePurchases(productIds: string[]): Promise<Purchase[]> {
    if (productIds.length === 0) {
      return [];
    }

    try {
      const queries = productIds.map(productId => ({
        sql: 'UPDATE purchases SET is_active = TRUE WHERE product_id = ?',
        params: [productId]
      }));

      await dbConnection.transaction(queries);

      // Return restored purchases
      const placeholders = productIds.map(() => '?').join(',');
      const result = await dbConnection.query<Purchase>(
        `SELECT * FROM purchases WHERE product_id IN (${placeholders}) AND is_active = TRUE`,
        productIds
      );

      return result.rows;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to restore purchases: ${message}`);
    }
  }

  /**
   * Get purchase statistics
   */
  async getPurchaseStats(): Promise<{
    totalPurchases: number;
    activePurchases: number;
    purchasesByPlatform: {
      ios: number;
      android: number;
    };
    recentPurchases: number;
  }> {
    // Get total purchases
    const totalResult = await dbConnection.queryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM purchases'
    );

    // Get active purchases
    const activeResult = await dbConnection.queryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM purchases WHERE is_active = TRUE'
    );

    // Get purchases by platform
    const platformResult = await dbConnection.query<{ platform: string; count: number }>(
      'SELECT platform, COUNT(*) as count FROM purchases GROUP BY platform'
    );

    // Get recent purchases (last 30 days)
    const recentResult = await dbConnection.queryFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM purchases 
       WHERE purchase_date >= datetime('now', '-30 days')`
    );

    const purchasesByPlatform = {
      ios: 0,
      android: 0
    };

    platformResult.rows.forEach(row => {
      if (row.platform === 'ios' || row.platform === 'android') {
        purchasesByPlatform[row.platform] = row.count;
      }
    });

    return {
      totalPurchases: totalResult?.count || 0,
      activePurchases: activeResult?.count || 0,
      purchasesByPlatform,
      recentPurchases: recentResult?.count || 0
    };
  }

  /**
   * Check multiple product purchases at once
   */
  async checkPurchases(productIds: string[]): Promise<Record<string, boolean>> {
    if (productIds.length === 0) {
      return {};
    }

    const placeholders = productIds.map(() => '?').join(',');
    const result = await dbConnection.query<{ product_id: string }>(
      `SELECT DISTINCT product_id FROM purchases 
       WHERE product_id IN (${placeholders}) AND is_active = TRUE`,
      productIds
    );

    const activePurchases = new Set(result.rows.map(row => row.product_id));
    const purchaseStatus: Record<string, boolean> = {};

    productIds.forEach(productId => {
      purchaseStatus[productId] = activePurchases.has(productId);
    });

    return purchaseStatus;
  }

  /**
   * Record purchase transaction (for future receipt validation)
   */
  async recordPurchaseTransaction(
    productId: string, 
    platform: 'ios' | 'android',
    transactionData?: any
  ): Promise<Purchase> {
    // First, deactivate any existing purchases for this product
    await dbConnection.query(
      'UPDATE purchases SET is_active = FALSE WHERE product_id = ?',
      [productId]
    );

    // Create new active purchase record
    return this.createPurchase({
      productId,
      platform,
      isActive: true
    });
  }

  /**
   * Clean up old inactive purchases
   */
  async cleanupOldPurchases(daysOld = 365): Promise<number> {
    const result = await dbConnection.query(
      `DELETE FROM purchases 
       WHERE is_active = FALSE 
       AND purchase_date < datetime('now', '-${daysOld} days')`
    );

    console.log(`Cleaned up ${result.rowsAffected} old purchase records`);
    return result.rowsAffected;
  }
}