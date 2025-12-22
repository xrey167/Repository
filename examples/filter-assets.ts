/**
 * Asset Filtering Example
 * Demonstrates filtering assets by price, liquidity, and technical criteria
 */

import {
  DatafeedFactory,
  FilterEngine,
  PriceFilter,
  LiquidityFilter,
  TechnicalFilter,
  printWelcome,
} from '../src';

async function main() {
  printWelcome();

  console.log('=== Asset Filtering Example ===\n');

  // Create datafeed adapter
  const adapter = DatafeedFactory.create({ type: 'mock' });
  await adapter.connect();

  // Create filter engine with AND logic
  const filterEngine = new FilterEngine('AND');

  // Add filters
  filterEngine.addFilter(
    new PriceFilter({
      minPrice: 100,
      maxPrice: 50000,
      minPriceChange: -10,
      maxPriceChange: 20,
    })
  );

  filterEngine.addFilter(
    new LiquidityFilter({
      minVolume: 1000000,
      minAvgVolume: 500000,
    })
  );

  filterEngine.addFilter(
    new TechnicalFilter({
      criteria: 'price_above_sma',
      slowSMA: 50,
    })
  );

  console.log('Filter criteria (AND logic):');
  console.log('  - Price: $100 - $50,000');
  console.log('  - Price change: -10% to +20%');
  console.log('  - Volume: > 1,000,000');
  console.log('  - Price above 50-period SMA\n');

  // Get symbols
  const symbols = await adapter.getSymbols();
  console.log(`Filtering ${symbols.length} symbols...\n`);

  // Create filter contexts
  const contexts = await Promise.all(
    symbols.slice(0, 10).map(async (symbol) => {
      const ticker = await adapter.getTicker(symbol.symbol);
      const candles = await adapter.getCandles(symbol.symbol, '1h', 100);

      return {
        symbol,
        ticker,
        candles,
      };
    })
  );

  // Apply filters
  const results = await filterEngine.filterMany(contexts);

  // Show results
  console.log('=== Filter Results ===\n');

  const passed = Array.from(results.entries()).filter(([_, result]) => result.passed);
  const failed = Array.from(results.entries()).filter(([_, result]) => !result.passed);

  console.log(`Passed: ${passed.length}`);
  for (const [symbol, result] of passed) {
    console.log(`  ✓ ${symbol} (score: ${result.score?.toFixed(2)})`);
  }

  console.log(`\nFailed: ${failed.length}`);
  for (const [symbol, result] of failed.slice(0, 5)) {
    console.log(`  ✗ ${symbol}: ${result.reason}`);
  }

  await adapter.disconnect();
}

main().catch(console.error);
