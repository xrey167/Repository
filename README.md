# AlgoTrading System 🤖

A comprehensive TypeScript-based algorithmic trading framework supporting backtesting, paper trading, and live trading with advanced risk management and multiple data sources.

## Features

✅ **Datafeed Adapters**
- Factory pattern for swappable data sources
- Mock adapter for testing
- CSV adapter for historical backtesting
- Exchange adapters (Binance, Coinbase stubs)
- In-memory caching for performance

✅ **Technical Indicators** (11 indicators)
- Moving Averages: SMA, EMA, WMA
- Oscillators: RSI, MACD, Stochastic
- Volatility: Bollinger Bands, ATR
- Volume: OBV, Volume Profile

✅ **Risk Management**
- Position sizing (5 methods: Fixed, Percent, Kelly, Volatility, Risk-based)
- Stop losses (4 types: Fixed, Trailing, ATR, Time-based)
- Risk metrics (Sharpe, Sortino, Calmar, VaR, CVaR)
- Portfolio risk limits

✅ **Market Screening & Filtering**
- Multi-symbol parallel scanning
- Composable filter pipeline with AND/OR logic
- Price, liquidity, and technical filters
- Score-based ranking

✅ **Strategy Framework**
- Event-driven backtester
- Performance metrics calculator
- Paper trading executor
- Example strategies (SMA Crossover, RSI Mean Reversion)

✅ **Portfolio Management**
- Position tracking with MFE/MAE analysis
- P&L calculation (realized & unrealized)
- Trade logging with daily rotation
- JSON/CSV persistence

## Quick Start

```bash
# Install dependencies
bun install

# Run backtest example
bun run examples/backtest-sma-crossover.ts

# Run market screener
bun run examples/screen-market.ts

# Run asset filter
bun run examples/filter-assets.ts
```

## Installation

```bash
# Clone repository
git clone <repo-url>
cd algotrading

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Edit configuration (optional)
nano .env
```

## Usage Examples

### 1. Backtesting a Strategy

```typescript
import {
  DatafeedFactory,
  SMACrossoverStrategy,
  Backtester,
  PerformanceMetricsCalculator,
} from './src';

// Create datafeed
const adapter = DatafeedFactory.create({ type: 'mock' });
await adapter.connect();

// Create strategy
const strategy = new SMACrossoverStrategy({
  name: 'SMA-20/50',
  symbols: ['BTCUSD'],
  timeframe: '1h',
  parameters: { fastPeriod: 20, slowPeriod: 50 },
});

// Run backtest
const backtester = new Backtester(strategy, adapter, {
  initialCapital: 10000,
  commission: 0.001,
  slippage: 0.0005,
});

await backtester.run();
const results = backtester.getResults();

// Calculate metrics
const calculator = new PerformanceMetricsCalculator();
const metrics = calculator.calculate(
  results.trades,
  results.initialCapital,
  results.finalEquity,
  365 * 24 * 60 * 60 * 1000
);

console.log(calculator.format(metrics));
```

### 2. Market Screening

```typescript
import {
  DatafeedFactory,
  ScreenerEngine,
  Scanner,
  RSIOversoldOverboughtCriteria,
  VolumeSpikeCriteria,
} from './src';

// Create screener
const screener = new ScreenerEngine();
screener.addCriteria(new RSIOversoldOverboughtCriteria(14, 'oversold'));
screener.addCriteria(new VolumeSpikeCriteria(20, 2.0));

// Create scanner
const adapter = DatafeedFactory.create({ type: 'mock' });
const scanner = new Scanner({ adapter, timeframe: '1h' }, screener);

// Scan market
const results = await scanner.scan(['BTCUSD', 'ETHUSD'], {
  maxResults: 10,
  minScore: 0.5,
});

console.log(`Found ${results.length} opportunities`);
```

### 3. Asset Filtering

```typescript
import {
  FilterEngine,
  PriceFilter,
  LiquidityFilter,
  TechnicalFilter,
} from './src';

// Create filter engine
const engine = new FilterEngine('AND');

// Add filters
engine.addFilter(new PriceFilter({ minPrice: 100, maxPrice: 50000 }));
engine.addFilter(new LiquidityFilter({ minVolume: 1000000 }));
engine.addFilter(new TechnicalFilter({ criteria: 'price_above_sma' }));

// Apply filters
const results = await engine.filterMany(contexts);
const passed = await engine.getPassedSymbols(contexts);
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   AlgoTrading System                 │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Datafeed │  │Indicators│  │  Filter  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │              │                 │
│       └─────────────┴──────────────┘                │
│                     │                                │
│              ┌──────▼──────┐                        │
│              │  Screener   │                        │
│              └──────┬──────┘                        │
│                     │                                │
│              ┌──────▼──────┐                        │
│              │  Strategy   │                        │
│              └──────┬──────┘                        │
│                     │                                │
│       ┌─────────────┴─────────────┐                │
│       │                           │                 │
│  ┌────▼────┐              ┌───────▼──────┐        │
│  │   Risk  │              │  Portfolio   │        │
│  └────┬────┘              └───────┬──────┘        │
│       │                           │                 │
│       └─────────┬─────────────────┘                │
│                 │                                    │
│          ┌──────▼─────────┐                        │
│          │   Execution    │                        │
│          └────────────────┘                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Project Structure

```
algotrading/
├── src/
│   ├── config/          # Configuration
│   ├── core/            # Types, events, errors
│   ├── datafeed/        # Data adapters
│   ├── indicators/      # Technical indicators
│   ├── filter/          # Asset filtering
│   ├── screener/        # Market screening
│   ├── strategy/        # Trading strategies
│   ├── portfolio/       # Portfolio management
│   ├── risk/            # Risk management
│   ├── execution/       # Order execution
│   ├── storage/         # Data persistence
│   └── utils/           # Utilities
├── examples/            # Usage examples
├── data/                # Data files
│   ├── historical/      # Historical CSV data
│   ├── backtests/       # Backtest results
│   └── logs/            # Trade logs
└── tests/               # Test files
```

## Creating Custom Strategies

```typescript
import { StrategyBase, type StrategyConfig, type StrategyContext } from './src';
import { SMAIndicator } from './src/indicators';

export class MyCustomStrategy extends StrategyBase {
  readonly name = 'MyStrategy';
  readonly description = 'My custom trading strategy';

  private sma!: SMAIndicator;

  async initialize(context: StrategyContext): Promise<void> {
    // Create and register indicators
    this.sma = new SMAIndicator(20);
    context.registerIndicator('sma', this.sma);
  }

  async onCandle(candle: Candle, context: StrategyContext): Promise<Signal[]> {
    const signals: Signal[] = [];

    // Your trading logic here
    const smaValue = this.sma.getValue();
    if (smaValue && candle.close > smaValue && !context.hasPosition()) {
      signals.push(this.createBuySignal(candle.close, 1, 'Price above SMA'));
    }

    return signals;
  }
}
```

## Environment Variables

```bash
# Trading mode
TRADING_MODE=paper          # backtest | paper | live

# Data
CSV_DATA_PATH=./data/historical

# Exchange API keys (optional)
BINANCE_API_KEY=your-key
BINANCE_API_SECRET=your-secret

# Logging
LOG_LEVEL=info              # debug | info | warn | error
LOG_DIRECTORY=./data/logs
```

## Trading Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Backtest** | Test on historical data | Strategy development & optimization |
| **Paper** | Simulate with fake capital | Strategy validation in real-time |
| **Live** | Execute real orders | Production trading (implement exchange APIs) |
| **Screen** | Generate signals only | Market analysis without execution |

## Performance Metrics

The backtester calculates comprehensive metrics:

**Returns:**
- Total return, CAGR, annualized return

**Risk Metrics:**
- Sharpe ratio, Sortino ratio, Calmar ratio
- Maximum drawdown, volatility
- Value at Risk (VaR), Conditional VaR

**Trade Statistics:**
- Win rate, profit factor, expectancy
- Average win/loss, consecutive wins/losses
- Total trades, average hold time

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Roadmap

- [ ] Implement live exchange adapters (Binance, Coinbase)
- [ ] Add more technical indicators (Ichimoku, Fibonacci, etc.)
- [ ] Multi-timeframe strategy support
- [ ] Portfolio optimization (Markowitz, Black-Litterman)
- [ ] Machine learning integration
- [ ] Real-time dashboard with charts
- [ ] Telegram notifications
- [ ] Advanced order types (OCO, trailing, etc.)

## License

MIT

## Acknowledgments

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- Event-driven architecture for scalability
- Factory and Strategy patterns for extensibility

---

**⚠️ Disclaimer:** This software is for educational purposes only. Use at your own risk. Trading involves substantial risk of loss. The authors are not responsible for any financial losses incurred using this software.
