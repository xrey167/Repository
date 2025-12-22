/**
 * Backtest SMA Crossover Strategy Example
 * Demonstrates backtesting a simple moving average crossover strategy
 */

import {
  DatafeedFactory,
  SMACrossoverStrategy,
  Backtester,
  PerformanceMetricsCalculator,
  printWelcome,
} from '../src';

async function main() {
  printWelcome();

  console.log('=== Backtesting SMA Crossover Strategy ===\n');

  // Create datafeed adapter (using mock data)
  const adapter = DatafeedFactory.create({ type: 'mock' });
  await adapter.connect();

  // Create strategy
  const strategy = new SMACrossoverStrategy({
    name: 'SMA-20/50-Crossover',
    description: '20/50 period SMA crossover strategy',
    symbols: ['BTCUSD'],
    timeframe: '1h',
    parameters: {
      fastPeriod: 20,
      slowPeriod: 50,
    },
  });

  // Create backtester
  const backtester = new Backtester(strategy, adapter, {
    initialCapital: 10000,
    commission: 0.001, // 0.1%
    slippage: 0.0005, // 0.05%
  });

  // Run backtest
  console.log('Running backtest...\n');
  await backtester.run();

  // Get results
  const results = backtester.getResults();

  console.log('\n=== Backtest Results ===\n');
  console.log(`Initial Capital: $${results.initialCapital.toFixed(2)}`);
  console.log(`Final Equity: $${results.finalEquity.toFixed(2)}`);
  console.log(`Total Return: ${results.totalReturn.toFixed(2)}%`);
  console.log(`Total Trades: ${results.totalTrades}`);
  console.log(`Realized P&L: $${results.portfolio.realizedPnl.toFixed(2)}`);

  // Calculate performance metrics
  const metricsCalc = new PerformanceMetricsCalculator();
  const metrics = metricsCalc.calculate(
    results.trades,
    results.initialCapital,
    results.finalEquity,
    365 * 24 * 60 * 60 * 1000 // 1 year backtest
  );

  console.log('\n' + metricsCalc.format(metrics));

  await adapter.disconnect();
}

main().catch(console.error);
