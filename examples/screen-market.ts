/**
 * Market Screening Example
 * Demonstrates scanning markets for trading opportunities
 */

import {
  DatafeedFactory,
  ScreenerEngine,
  Scanner,
  RSIOversoldOverboughtCriteria,
  VolumeSpikeCriteria,
  MACDCrossoverCriteria,
  printWelcome,
} from '../src';

async function main() {
  printWelcome();

  console.log('=== Market Screening Example ===\n');

  // Create datafeed adapter
  const adapter = DatafeedFactory.create({ type: 'mock' });
  await adapter.connect();

  // Create screener engine
  const screener = new ScreenerEngine();

  // Add screening criteria
  screener.addCriteria(new RSIOversoldOverboughtCriteria(14, 'oversold'));
  screener.addCriteria(new VolumeSpikeCriteria(20, 2.0));
  screener.addCriteria(new MACDCrossoverCriteria('bullish'));

  console.log('Screening criteria:');
  console.log('  - RSI Oversold (< 30)');
  console.log('  - Volume Spike (> 2x average)');
  console.log('  - MACD Bullish Crossover\n');

  // Create scanner
  const scanner = new Scanner(
    {
      adapter,
      timeframe: '1h',
      candleLimit: 100,
      batchSize: 5,
    },
    screener
  );

  // Symbols to scan
  const symbols = ['BTCUSD', 'ETHUSD', 'ADAUSD', 'SOLUSD', 'DOTUSD'];

  console.log(`Scanning ${symbols.length} symbols...\n`);

  // Run scan
  const results = await scanner.scan(symbols, {
    maxResults: 10,
    minScore: 0.5,
    sortByScore: true,
  });

  // Display results
  console.log(`Found ${results.length} matches:\n`);

  for (const result of results) {
    console.log(`${result.symbol} (Score: ${result.score.toFixed(2)})`);
    console.log(`  ${result.reason}`);
    console.log('');
  }

  // Get statistics
  const stats = screener.getStats(results);
  console.log('\n=== Screening Statistics ===');
  console.log(`Total Matches: ${stats.totalMatches}`);
  console.log(`Unique Symbols: ${stats.uniqueSymbols}`);
  console.log(`Average Score: ${stats.avgScore.toFixed(2)}`);
  console.log(`Top Score: ${stats.topScore.toFixed(2)}`);

  await adapter.disconnect();
}

main().catch(console.error);
