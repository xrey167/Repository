/**
 * Portfolio state store
 * Stores portfolio, positions, and balances in memory
 */

import type { Portfolio, Position, Balance } from '@/core/types';
import { MemoryStore } from './memory-store';
import { createLogger } from '@/utils';

/**
 * Portfolio store
 * Manages portfolio state in memory
 */
export class PortfolioStore {
  private static instance: PortfolioStore;
  private store: MemoryStore;
  private logger = createLogger('PortfolioStore');

  private readonly PORTFOLIO_KEY = 'portfolio:current';
  private readonly POSITIONS_PREFIX = 'positions:';
  private readonly BALANCES_PREFIX = 'balances:';

  private constructor() {
    this.store = MemoryStore.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): PortfolioStore {
    if (!PortfolioStore.instance) {
      PortfolioStore.instance = new PortfolioStore();
    }
    return PortfolioStore.instance;
  }

  /**
   * Get portfolio
   */
  getPortfolio(): Portfolio | undefined {
    return this.store.get<Portfolio>(this.PORTFOLIO_KEY);
  }

  /**
   * Set portfolio
   */
  setPortfolio(portfolio: Portfolio): void {
    this.store.set(this.PORTFOLIO_KEY, portfolio);
    this.logger.debug('Portfolio updated');
  }

  /**
   * Get position by symbol
   */
  getPosition(symbol: string): Position | undefined {
    return this.store.get<Position>(`${this.POSITIONS_PREFIX}${symbol}`);
  }

  /**
   * Set position
   */
  setPosition(position: Position): void {
    this.store.set(`${this.POSITIONS_PREFIX}${position.symbol}`, position);
    this.logger.debug(`Position updated: ${position.symbol}`);
  }

  /**
   * Get all positions
   */
  getAllPositions(): Position[] {
    const positions = this.store.getByPrefix<Position>(this.POSITIONS_PREFIX);
    return Object.values(positions);
  }

  /**
   * Delete position
   */
  deletePosition(symbol: string): void {
    this.store.delete(`${this.POSITIONS_PREFIX}${symbol}`);
    this.logger.debug(`Position deleted: ${symbol}`);
  }

  /**
   * Clear all positions
   */
  clearPositions(): void {
    this.store.deleteByPrefix(this.POSITIONS_PREFIX);
    this.logger.debug('All positions cleared');
  }

  /**
   * Get balance by asset
   */
  getBalance(asset: string): Balance | undefined {
    return this.store.get<Balance>(`${this.BALANCES_PREFIX}${asset}`);
  }

  /**
   * Set balance
   */
  setBalance(balance: Balance): void {
    this.store.set(`${this.BALANCES_PREFIX}${balance.asset}`, balance);
    this.logger.debug(`Balance updated: ${balance.asset}`);
  }

  /**
   * Get all balances
   */
  getAllBalances(): Balance[] {
    const balances = this.store.getByPrefix<Balance>(this.BALANCES_PREFIX);
    return Object.values(balances);
  }

  /**
   * Delete balance
   */
  deleteBalance(asset: string): void {
    this.store.delete(`${this.BALANCES_PREFIX}${asset}`);
    this.logger.debug(`Balance deleted: ${asset}`);
  }

  /**
   * Clear all balances
   */
  clearBalances(): void {
    this.store.deleteByPrefix(this.BALANCES_PREFIX);
    this.logger.debug('All balances cleared');
  }

  /**
   * Clear all portfolio data
   */
  clear(): void {
    this.store.delete(this.PORTFOLIO_KEY);
    this.clearPositions();
    this.clearBalances();
    this.logger.info('Portfolio store cleared');
  }

  /**
   * Get portfolio snapshot
   */
  getSnapshot(): {
    portfolio: Portfolio | undefined;
    positions: Position[];
    balances: Balance[];
  } {
    return {
      portfolio: this.getPortfolio(),
      positions: this.getAllPositions(),
      balances: this.getAllBalances(),
    };
  }
}

/**
 * Get portfolio store instance
 */
export function getPortfolioStore(): PortfolioStore {
  return PortfolioStore.getInstance();
}
