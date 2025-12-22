/**
 * Backtesting engine
 * Event-driven backtester for strategy testing
 */

import type { Candle, Signal, Order, Trade } from '@/core/types';
import type { IStrategy } from '../base';
import type { IDatafeedAdapter } from '@/core/types';
import { StrategyContext } from '../base';
import { PortfolioManager } from '@/portfolio';
import { RiskManager } from '@/risk';
import { tradingConfig } from '@/config/trading.config';
import { TradeLogger } from '@/storage';
import { createLogger } from '@/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Backtest configuration
 */
export interface BacktestConfig {
  /**
   * Initial capital
   */
  initialCapital: number;

  /**
   * Trading commission (as decimal, e.g., 0.001 = 0.1%)
   */
  commission: number;

  /**
   * Slippage (as decimal)
   */
  slippage: number;

  /**
   * Start date (timestamp)
   */
  startDate?: number;

  /**
   * End date (timestamp)
   */
  endDate?: number;
}

/**
 * Backtester
 * Runs strategies against historical data
 */
export class Backtester {
  private strategy: IStrategy;
  private adapter: IDatafeedAdapter;
  private config: BacktestConfig;
  private portfolioManager: PortfolioManager;
  private riskManager: RiskManager;
  private tradeLogger: TradeLogger;
  private context!: StrategyContext;
  private logger = createLogger('Backtester');

  private orders: Order[] = [];
  private trades: Trade[] = [];

  constructor(
    strategy: IStrategy,
    adapter: IDatafeedAdapter,
    config: BacktestConfig
  ) {
    this.strategy = strategy;
    this.adapter = adapter;
    this.config = {
      ...config,
      commission: config.commission ?? 0.001,
      slippage: config.slippage ?? 0.0005,
    };

    this.portfolioManager = new PortfolioManager();
    this.riskManager = new RiskManager({
      ...tradingConfig.risk,
      ...tradingConfig.positions,
    });
    this.tradeLogger = TradeLogger.getInstance();
  }

  /**
   * Run backtest
   */
  async run(): Promise<void> {
    this.logger.info(`Starting backtest for ${this.strategy.name}`);

    // Initialize portfolio
    this.portfolioManager.initialize(this.config.initialCapital);

    // Fetch historical data
    const symbol = this.strategy.config.symbols[0];
    const symbolInfo = await this.adapter.getSymbol(symbol);

    this.logger.info(`Fetching historical data for ${symbol}`);

    let candles: Candle[];
    if (this.config.startDate && this.config.endDate) {
      candles = await this.adapter.getCandlesRange(
        symbol,
        this.strategy.config.timeframe as any,
        this.config.startDate,
        this.config.endDate
      );
    } else {
      candles = await this.adapter.getCandles(
        symbol,
        this.strategy.config.timeframe as any,
        1000
      );
    }

    this.logger.info(`Loaded ${candles.length} candles`);

    // Create strategy context
    this.context = new StrategyContext(
      symbolInfo,
      this.portfolioManager,
      this.riskManager
    );

    // Initialize strategy
    await this.strategy.initialize(this.context);

    // Process each candle
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      await this.processCandle(candle);

      if ((i + 1) % 100 === 0) {
        this.logger.debug(`Processed ${i + 1}/${candles.length} candles`);
      }
    }

    // Close any open positions at end
    await this.closeAllPositions(candles[candles.length - 1]);

    this.logger.info('Backtest complete');
  }

  /**
   * Process single candle
   */
  private async processCandle(candle: Candle): Promise<void> {
    // Add candle to context
    this.context.addCandle(candle);
    this.context.updateAllIndicators(candle);

    // Update position prices
    this.portfolioManager.updatePositionPrice(candle.symbol, candle.close);

    // Get signals from strategy
    const signals = await this.strategy.onCandle(candle, this.context);

    // Process signals
    for (const signal of signals) {
      await this.processSignal(signal, candle);
    }
  }

  /**
   * Process trading signal
   */
  private async processSignal(signal: Signal, candle: Candle): Promise<void> {
    // Create order from signal
    const order: Order = {
      id: uuidv4(),
      symbol: signal.symbol,
      side: signal.side,
      type: signal.orderType || 'market',
      quantity: signal.quantity,
      price: signal.price,
      status: 'pending',
      filledQuantity: 0,
      averagePrice: 0,
      timestamp: signal.timestamp,
    };

    // Validate order
    try {
      this.riskManager.validateOrder(
        order,
        this.portfolioManager.getPortfolio(),
        this.portfolioManager.getAllPositions()
      );
    } catch (error) {
      this.logger.warn(`Order rejected: ${error}`);
      return;
    }

    // Execute order (instant fill for backtesting)
    await this.executeOrder(order, candle);
  }

  /**
   * Execute order (simulated)
   */
  private async executeOrder(order: Order, candle: Candle): Promise<void> {
    // Calculate fill price with slippage
    let fillPrice = order.price || candle.close;

    if (order.side === 'buy') {
      fillPrice *= 1 + this.config.slippage;
    } else {
      fillPrice *= 1 - this.config.slippage;
    }

    // Calculate commission
    const commission = order.quantity * fillPrice * this.config.commission;

    // Create trade
    const trade: Trade = {
      id: uuidv4(),
      orderId: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      price: fillPrice,
      commission,
      timestamp: candle.timestamp,
    };

    // Calculate P&L for closing trades
    if (order.side === 'sell') {
      const position = this.portfolioManager.getPosition(order.symbol);
      if (position) {
        const pnl =
          (fillPrice - position.entryPrice) * order.quantity - commission;
        trade.realizedPnl = pnl;
      }
    }

    // Update portfolio
    this.portfolioManager.updateFromTrade(trade);

    // Log trade
    this.tradeLogger.log(trade);
    this.trades.push(trade);

    // Update order
    order.status = 'filled';
    order.filledQuantity = order.quantity;
    order.averagePrice = fillPrice;
    this.orders.push(order);

    this.logger.debug(
      `Order filled: ${order.side} ${order.quantity} ${order.symbol} @ ${fillPrice.toFixed(2)}`
    );

    // Notify strategy
    if (this.strategy.onOrderFilled) {
      await this.strategy.onOrderFilled(order.id, this.context);
    }
  }

  /**
   * Close all open positions
   */
  private async closeAllPositions(lastCandle: Candle): Promise<void> {
    const positions = this.portfolioManager.getAllPositions();

    for (const position of positions) {
      const signal: Signal = {
        type: 'exit',
        side: 'sell',
        symbol: position.symbol,
        price: lastCandle.close,
        quantity: position.quantity,
        timestamp: lastCandle.timestamp,
        reason: 'End of backtest',
        strategy: this.strategy.name,
      };

      await this.processSignal(signal, lastCandle);
    }
  }

  /**
   * Get backtest results
   */
  getResults() {
    const portfolio = this.portfolioManager.getPortfolio();
    const summary = this.portfolioManager.getSummary();

    return {
      portfolio,
      summary,
      orders: this.orders,
      trades: this.trades,
      initialCapital: this.config.initialCapital,
      finalEquity: portfolio.equity,
      totalReturn: ((portfolio.equity - this.config.initialCapital) / this.config.initialCapital) * 100,
      totalTrades: this.trades.length,
    };
  }

  /**
   * Reset backtester for new run
   */
  reset(): void {
    this.orders = [];
    this.trades = [];
    this.portfolioManager.reset();
    if (this.context) {
      this.context.reset();
    }
    this.logger.debug('Backtester reset');
  }
}
