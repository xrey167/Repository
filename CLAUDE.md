# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Project: AlgoTrading System

A comprehensive TypeScript-based algorithmic trading framework supporting backtesting, paper trading, and live trading with multiple data sources and advanced risk management.

## Build Commands

```bash
# Install dependencies
bun install

# Type check
bun run typecheck

# Build project
bun run build

# Run examples
bun run examples/backtest-sma-crossover.ts
bun run examples/screen-market.ts
bun run examples/filter-assets.ts
```

## Architecture

### Core Modules

1. **Datafeed** (`src/datafeed/`)
   - Factory pattern for swappable data sources
   - Adapters: Mock, CSV, Binance, Coinbase
   - In-memory caching for performance
   - Adapter registry for custom sources

2. **Indicators** (`src/indicators/`)
   - 11 technical indicators
   - Moving Averages: SMA, EMA, WMA
   - Oscillators: RSI, MACD, Stochastic
   - Volatility: Bollinger Bands, ATR
   - Volume: OBV, Volume Profile
   - Composable indicator framework

3. **Portfolio** (`src/portfolio/`)
   - Portfolio state management
   - Position tracking with MFE/MAE
   - P&L calculation (realized & unrealized)
   - Balance management

4. **Risk** (`src/risk/`)
   - Position sizing: Fixed, Percent, Kelly, Volatility, Risk-based
   - Stop losses: Fixed, Trailing, ATR-based, Time-based
   - Risk metrics: Sharpe, Sortino, Calmar, VaR, CVaR
   - Portfolio risk limits

5. **Filter** (`src/filter/`)
   - Composable filter pipeline
   - Price, liquidity, and technical filters
   - AND/OR logic support
   - Score-based ranking

6. **Screener** (`src/screener/`)
   - Multi-symbol market scanning
   - Parallel processing
   - Price, volume, and technical criteria
   - Batch processing with Scanner

7. **Strategy** (`src/strategy/`)
   - Base strategy framework
   - Event-driven backtester
   - Performance metrics calculator
   - Example strategies (SMA Crossover, RSI Mean Reversion)

8. **Execution** (`src/execution/`)
   - Order lifecycle management
   - Paper trading executor
   - Order validation
   - Event-driven order updates

9. **Storage** (`src/storage/`)
   - In-memory store (fast access)
   - JSON persistence
   - CSV export/import
   - Trade logging with daily rotation

## Design Patterns

- **Factory Pattern**: Datafeed adapters, strategy creation
- **Strategy Pattern**: All strategies follow IStrategy interface
- **Singleton Pattern**: EventBus, PortfolioManager, RiskManager
- **Observer Pattern**: Event-driven architecture
- **Adapter Pattern**: Multiple data source integration

## Event System

Event-driven architecture using pub/sub EventBus:
- `candle:received` - New candle data
- `order:submitted` - Order submitted
- `order:filled` - Order executed
- `order:rejected` - Order validation failed
- `order:cancelled` - Order cancelled
- `position:opened` - New position
- `position:updated` - Position modified
- `position:closed` - Position closed
- `portfolio:updated` - Portfolio state changed

## Development Notes

### Code Conventions

- **TypeScript**: Strict mode, ES2022 target
- **Path Aliases**: Use `@/` for imports (e.g., `@/core/types`)
- **Exports**: Barrel exports via index.ts files
- **Logging**: Use createLogger for structured logging
- **Errors**: Custom error classes for specific scenarios

### Adding New Features

**New Datafeed Adapter:**
1. Extend BaseAdapter
2. Implement IDatafeedAdapter methods
3. Register with DatafeedFactory
4. Add to adapters/index.ts

**New Indicator:**
1. Extend IndicatorBase
2. Implement calculate method
3. Add to appropriate category folder
4. Export from indicators/index.ts

**New Strategy:**
1. Extend StrategyBase
2. Implement onCandle method
3. Register indicators in initialize
4. Add to examples folder

**New Filter/Criteria:**
1. Implement IFilter or ICriteria
2. Add to filters/criteria folder
3. Export from module index

### Testing Strategies

1. Use MockAdapter for quick testing
2. Use CSVAdapter for historical backtesting
3. Use PaperExecutor for paper trading
4. Monitor logs for debugging

### Performance Considerations

- Indicators cache calculated values
- Datafeed uses in-memory cache with TTL
- Scanner processes symbols in batches
- Parallel filtering for multiple symbols
- Event bus for loose coupling

## File Structure

```
src/
├── config/          # Configuration files
├── core/            # Core types, events, errors
├── datafeed/        # Data adapters & factory
├── indicators/      # Technical indicators
├── filter/          # Asset filtering
├── screener/        # Market screening
├── strategy/        # Trading strategies & backtester
├── portfolio/       # Portfolio management
├── risk/            # Risk management
├── execution/       # Order execution
├── storage/         # Data persistence
└── utils/           # Utilities

examples/            # Usage examples
data/                # Data files (historical, logs)
```

## Trading Modes

- **Backtesting**: Test strategies on historical data
- **Paper Trading**: Simulate real-time with fake capital
- **Live Trading**: Execute real orders (stub implementation)
- **Screening**: Generate signals without execution

## Environment Variables

```bash
# Trading Mode
TRADING_MODE=paper  # backtest | paper | live

# Datafeed
CSV_DATA_PATH=./data/historical

# Exchange API Keys (optional)
BINANCE_API_KEY=your-key
BINANCE_API_SECRET=your-secret
COINBASE_API_KEY=your-key
COINBASE_API_SECRET=your-secret

# Logging
LOG_LEVEL=info      # debug | info | warn | error
LOG_DIRECTORY=./data/logs
```

## Next Steps

1. Run examples to understand workflow
2. Create custom strategies by extending StrategyBase
3. Add real exchange adapters (implement API calls)
4. Implement live executor for real trading
5. Add more indicators and filters as needed
6. Set up CI/CD for automated testing
