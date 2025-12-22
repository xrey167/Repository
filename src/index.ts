/**
 * AlgoTrading System
 * TypeScript-based algorithmic trading framework
 *
 * @packageDocumentation
 */

import "./config/env";

// Core
export * from './core/types';
export * from './core/events';
export * from './core/errors';

// Configuration
export * from './config/trading.config';
export * from './config/datafeed.config';

// Datafeed
export * from './datafeed';

// Indicators
export * from './indicators';

// Storage
export * from './storage';

// Portfolio
export * from './portfolio';

// Risk
export * from './risk';

// Filter
export * from './filter';

// Screener
export * from './screener';

// Strategy
export * from './strategy';

// Execution
export * from './execution';

// Utilities
export * from './utils';

/**
 * AlgoTrading version
 */
export const VERSION = '1.0.0';

/**
 * Welcome message
 */
export function printWelcome(): void {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║            AlgoTrading System v${VERSION}               ║
║                                                       ║
║     TypeScript Algorithmic Trading Framework          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Features:
  ✓ Datafeed adapters (Mock, CSV, Binance, Coinbase)
  ✓ 11 technical indicators (SMA, EMA, RSI, MACD, etc.)
  ✓ Risk management & position sizing
  ✓ Market screening & filtering
  ✓ Strategy framework with backtesting
  ✓ Paper & live trading execution

Get started:
  - Run examples: bun run examples/<example>.ts
  - Read docs: See CLAUDE.md and README.md
  `);
}
