# AlgoTrading Examples

This directory contains example scripts demonstrating various features of the AlgoTrading system.

## Running Examples

```bash
# Backtest SMA Crossover Strategy
bun run examples/backtest-sma-crossover.ts

# Screen Market for Opportunities
bun run examples/screen-market.ts

# Filter Assets
bun run examples/filter-assets.ts
```

## Examples

### 1. Backtest SMA Crossover (`backtest-sma-crossover.ts`)

Demonstrates:
- Creating a datafeed adapter
- Defining a trading strategy
- Running a backtest
- Calculating performance metrics
- Analyzing results

**Strategy:** 20/50 period SMA crossover
- Buy when 20-period SMA crosses above 50-period SMA
- Sell when 20-period SMA crosses below 50-period SMA

### 2. Market Screening (`screen-market.ts`)

Demonstrates:
- Setting up screening criteria
- Scanning multiple symbols
- Finding trading opportunities
- Ranking results by score

**Criteria:**
- RSI oversold (< 30)
- Volume spike (> 2x average)
- MACD bullish crossover

### 3. Asset Filtering (`filter-assets.ts`)

Demonstrates:
- Creating filter pipeline
- Combining multiple filters with AND/OR logic
- Filtering by price, liquidity, and technical criteria
- Analyzing filter results

**Filters:**
- Price range ($100 - $50,000)
- Price change (-10% to +20%)
- Minimum volume (> 1M)
- Price above 50-period SMA

## Next Steps

1. Modify parameters in examples to see different results
2. Create your own custom strategies
3. Add new screening criteria
4. Implement additional filters
5. Run backtests with real historical data (CSV adapter)

## Documentation

See the main README.md and CLAUDE.md for comprehensive documentation.
