/**
 * Portfolio manager
 * Manages portfolio state, balances, and positions
 */

import type { Portfolio, Position, Balance, Trade, Order } from '@/core/types';
import { PortfolioStore } from '@/storage';
import { EventBus } from '@/core/events';
import { createLogger } from '@/utils';
import { InsufficientBalanceError } from '@/core/errors';

/**
 * Portfolio manager
 * Central manager for portfolio state
 */
export class PortfolioManager {
  private store: PortfolioStore;
  private eventBus: EventBus;
  private logger = createLogger('PortfolioManager');

  constructor() {
    this.store = PortfolioStore.getInstance();
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Initialize portfolio with starting capital
   */
  initialize(initialCapital: number, currency: string = 'USD'): void {
    const portfolio: Portfolio = {
      equity: initialCapital,
      cash: initialCapital,
      marginUsed: 0,
      marginAvailable: initialCapital,
      unrealizedPnl: 0,
      realizedPnl: 0,
      totalPnl: 0,
      currency,
    };

    // Set initial balance
    const balance: Balance = {
      asset: currency,
      free: initialCapital,
      locked: 0,
      total: initialCapital,
    };

    this.store.setPortfolio(portfolio);
    this.store.setBalance(balance);

    this.logger.info(`Portfolio initialized with ${initialCapital} ${currency}`);

    this.eventBus.publish({
      type: 'portfolio:updated',
      timestamp: Date.now(),
      data: { portfolio },
    });
  }

  /**
   * Get current portfolio
   */
  getPortfolio(): Portfolio {
    const portfolio = this.store.getPortfolio();
    if (!portfolio) {
      throw new Error('Portfolio not initialized');
    }
    return portfolio;
  }

  /**
   * Get position by symbol
   */
  getPosition(symbol: string): Position | undefined {
    return this.store.getPosition(symbol);
  }

  /**
   * Get all positions
   */
  getAllPositions(): Position[] {
    return this.store.getAllPositions();
  }

  /**
   * Get balance for asset
   */
  getBalance(asset: string): Balance | undefined {
    return this.store.getBalance(asset);
  }

  /**
   * Get all balances
   */
  getAllBalances(): Balance[] {
    return this.store.getAllBalances();
  }

  /**
   * Update portfolio from trade
   */
  updateFromTrade(trade: Trade): void {
    const portfolio = this.getPortfolio();
    const position = this.getPosition(trade.symbol);

    // Update realized P&L
    if (trade.realizedPnl) {
      portfolio.realizedPnl += trade.realizedPnl;
      portfolio.totalPnl = portfolio.realizedPnl + portfolio.unrealizedPnl;
    }

    // Update cash (subtract trade cost + commission)
    const tradeCost = trade.quantity * trade.price;
    const totalCost = tradeCost + trade.commission;

    if (trade.side === 'buy') {
      portfolio.cash -= totalCost;
    } else {
      portfolio.cash += tradeCost - trade.commission;
    }

    // Update position
    if (position) {
      this.updatePosition(position, trade);
    } else {
      this.createPosition(trade);
    }

    // Recalculate equity
    this.recalculateEquity();

    this.store.setPortfolio(portfolio);

    this.logger.debug(`Portfolio updated from trade: ${trade.id}`);

    this.eventBus.publish({
      type: 'portfolio:updated',
      timestamp: Date.now(),
      data: { portfolio, trade },
    });
  }

  /**
   * Create new position from trade
   */
  private createPosition(trade: Trade): void {
    const position: Position = {
      symbol: trade.symbol,
      side: trade.side === 'buy' ? 'long' : 'short',
      quantity: trade.quantity,
      entryPrice: trade.price,
      currentPrice: trade.price,
      unrealizedPnl: 0,
      realizedPnl: trade.realizedPnl ?? 0,
      margin: trade.quantity * trade.price,
      openedAt: trade.timestamp,
    };

    this.store.setPosition(position);

    this.eventBus.publish({
      type: 'position:opened',
      timestamp: Date.now(),
      data: { position },
    });
  }

  /**
   * Update existing position from trade
   */
  private updatePosition(position: Position, trade: Trade): void {
    if (trade.side === 'buy') {
      // Increase position
      const totalCost = position.quantity * position.entryPrice + trade.quantity * trade.price;
      position.quantity += trade.quantity;
      position.entryPrice = totalCost / position.quantity;
    } else {
      // Decrease position
      position.quantity -= trade.quantity;

      if (trade.realizedPnl) {
        position.realizedPnl += trade.realizedPnl;
      }
    }

    if (position.quantity <= 0) {
      // Position closed
      this.store.deletePosition(position.symbol);

      this.eventBus.publish({
        type: 'position:closed',
        timestamp: Date.now(),
        data: { position },
      });
    } else {
      this.store.setPosition(position);

      this.eventBus.publish({
        type: 'position:updated',
        timestamp: Date.now(),
        data: { position },
      });
    }
  }

  /**
   * Update position prices (for unrealized P&L calculation)
   */
  updatePositionPrice(symbol: string, currentPrice: number): void {
    const position = this.getPosition(symbol);
    if (!position) {
      return;
    }

    position.currentPrice = currentPrice;

    // Calculate unrealized P&L
    if (position.side === 'long') {
      position.unrealizedPnl = (currentPrice - position.entryPrice) * position.quantity;
    } else {
      position.unrealizedPnl = (position.entryPrice - currentPrice) * position.quantity;
    }

    this.store.setPosition(position);

    // Recalculate portfolio unrealized P&L
    this.recalculateUnrealizedPnl();
  }

  /**
   * Recalculate total unrealized P&L from all positions
   */
  private recalculateUnrealizedPnl(): void {
    const portfolio = this.getPortfolio();
    const positions = this.getAllPositions();

    portfolio.unrealizedPnl = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
    portfolio.totalPnl = portfolio.realizedPnl + portfolio.unrealizedPnl;

    this.store.setPortfolio(portfolio);
  }

  /**
   * Recalculate equity from cash and positions
   */
  private recalculateEquity(): void {
    const portfolio = this.getPortfolio();
    const positions = this.getAllPositions();

    const positionValue = positions.reduce(
      (sum, pos) => sum + pos.quantity * pos.currentPrice,
      0
    );

    portfolio.equity = portfolio.cash + positionValue;
    portfolio.marginUsed = positions.reduce((sum, pos) => sum + pos.margin, 0);
    portfolio.marginAvailable = portfolio.equity - portfolio.marginUsed;

    this.store.setPortfolio(portfolio);
  }

  /**
   * Check if order can be placed (sufficient balance)
   */
  canPlaceOrder(order: Partial<Order>): boolean {
    const portfolio = this.getPortfolio();

    if (order.side === 'buy') {
      const requiredAmount = (order.quantity ?? 0) * (order.price ?? 0);
      return portfolio.cash >= requiredAmount;
    }

    // For sell orders, check if position exists
    const position = this.getPosition(order.symbol ?? '');
    if (!position) {
      return false;
    }

    return position.quantity >= (order.quantity ?? 0);
  }

  /**
   * Validate and reserve funds for order
   */
  reserveFunds(order: Order): void {
    if (order.side === 'buy') {
      const portfolio = this.getPortfolio();
      const requiredAmount = order.quantity * (order.price ?? 0);

      if (portfolio.cash < requiredAmount) {
        throw new InsufficientBalanceError(
          requiredAmount,
          portfolio.cash,
          'cash'
        );
      }

      // Lock funds (simplified, in real system would use balance.locked)
      portfolio.cash -= requiredAmount;
      this.store.setPortfolio(portfolio);
    }
  }

  /**
   * Get portfolio summary
   */
  getSummary(): {
    equity: number;
    cash: number;
    positionCount: number;
    totalPnl: number;
    realizedPnl: number;
    unrealizedPnl: number;
  } {
    const portfolio = this.getPortfolio();
    const positions = this.getAllPositions();

    return {
      equity: portfolio.equity,
      cash: portfolio.cash,
      positionCount: positions.length,
      totalPnl: portfolio.totalPnl,
      realizedPnl: portfolio.realizedPnl,
      unrealizedPnl: portfolio.unrealizedPnl,
    };
  }

  /**
   * Reset portfolio
   */
  reset(): void {
    this.store.clear();
    this.logger.info('Portfolio reset');
  }
}
