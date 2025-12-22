/**
 * Trade logger
 * Logs all trades to CSV files for analysis
 */

import type { Trade } from '@/core/types';
import { CSVStore } from './csv-store';
import { env } from '@/config/env';
import { createLogger } from '@/utils';

/**
 * Trade logger
 * Logs trades to CSV files with daily rotation
 */
export class TradeLogger {
  private static instance: TradeLogger;
  private csvStore: CSVStore | null = null;
  private currentDate: string = '';
  private logDirectory: string;
  private logger = createLogger('TradeLogger');

  private readonly HEADERS = [
    'timestamp',
    'id',
    'orderId',
    'symbol',
    'side',
    'quantity',
    'price',
    'commission',
    'realizedPnl',
    'positionSide',
  ];

  private constructor() {
    this.logDirectory = env.LOG_DIRECTORY || './data/logs';
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TradeLogger {
    if (!TradeLogger.instance) {
      TradeLogger.instance = new TradeLogger();
    }
    return TradeLogger.instance;
  }

  /**
   * Get current date string (YYYY-MM-DD)
   */
  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get or create CSV store for current date
   */
  private getStore(): CSVStore {
    const currentDate = this.getCurrentDate();

    // Create new store if date changed or store doesn't exist
    if (this.currentDate !== currentDate || !this.csvStore) {
      this.currentDate = currentDate;
      const filePath = `${this.logDirectory}/trades-${currentDate}.csv`;

      this.csvStore = new CSVStore({
        filePath,
        headers: this.HEADERS,
        append: true,
      });

      this.logger.info(`Trade logger initialized for ${currentDate}`);
    }

    return this.csvStore;
  }

  /**
   * Log a trade
   */
  log(trade: Trade): void {
    try {
      const store = this.getStore();

      const row = {
        timestamp: trade.timestamp,
        id: trade.id,
        orderId: trade.orderId,
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.quantity,
        price: trade.price,
        commission: trade.commission,
        realizedPnl: trade.realizedPnl ?? 0,
        positionSide: trade.positionSide ?? '',
      };

      store.writeRow(row);
      this.logger.debug(`Logged trade: ${trade.id}`);
    } catch (error) {
      this.logger.error('Failed to log trade', error);
    }
  }

  /**
   * Log multiple trades
   */
  logMany(trades: Trade[]): void {
    for (const trade of trades) {
      this.log(trade);
    }
    this.logger.info(`Logged ${trades.length} trades`);
  }

  /**
   * Read trades for a specific date
   */
  readTrades(date?: string): Trade[] {
    try {
      const targetDate = date || this.getCurrentDate();
      const filePath = `${this.logDirectory}/trades-${targetDate}.csv`;

      const store = new CSVStore({
        filePath,
        headers: this.HEADERS,
      });

      const rows = store.readRows();

      return rows.map((row) => ({
        id: String(row.id),
        orderId: String(row.orderId),
        symbol: String(row.symbol),
        side: row.side as 'buy' | 'sell',
        quantity: Number(row.quantity),
        price: Number(row.price),
        commission: Number(row.commission),
        realizedPnl: row.realizedPnl ? Number(row.realizedPnl) : undefined,
        positionSide: row.positionSide ? (row.positionSide as 'long' | 'short') : undefined,
        timestamp: Number(row.timestamp),
      }));
    } catch (error) {
      this.logger.error(`Failed to read trades for date ${date}`, error);
      return [];
    }
  }

  /**
   * Set custom log directory
   */
  setLogDirectory(directory: string): void {
    this.logDirectory = directory;
    this.csvStore = null; // Force recreation of store
    this.logger.info(`Log directory set to: ${directory}`);
  }

  /**
   * Get log directory
   */
  getLogDirectory(): string {
    return this.logDirectory;
  }
}

/**
 * Get trade logger instance
 */
export function getTradeLogger(): TradeLogger {
  return TradeLogger.getInstance();
}
