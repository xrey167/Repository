/**
 * Screener module
 * Market scanning for opportunities
 */

export { ScreenerEngine } from './screener-engine';
export type { ScreenerOptions } from './screener-engine';

export { Scanner } from './scanner';
export type { ScannerConfig } from './scanner';

export type { ICriteria, ScreeningContext, ScreeningResult } from './criteria';

export {
  PriceBreakoutCriteria,
  MATouchCriteria,
  VolumeSpikeCriteria,
  VolumeTrendCriteria,
  RSIOversoldOverboughtCriteria,
  MACDCrossoverCriteria,
  GoldenDeathCrossCriteria,
} from './criteria';
