/**
 * Technical indicators module
 * Comprehensive library of technical analysis indicators
 */

// Base exports
export type {
  IIndicator,
  IndicatorValue,
  IndicatorParams,
  PriceSource,
} from './base';
export { getPrice, IndicatorBase } from './base';

// Moving averages
export { SMAIndicator, EMAIndicator, WMAIndicator } from './moving-averages';

// Oscillators
export {
  RSIIndicator,
  MACDIndicator,
  StochasticIndicator,
} from './oscillators';
export type { MACDValue, StochasticValue } from './oscillators';

// Volatility
export { BollingerBandsIndicator, ATRIndicator } from './volatility';
export type { BollingerBandsValue } from './volatility';

// Volume
export { OBVIndicator, VolumeProfileIndicator } from './volume';
export type { VolumeProfileValue, PriceLevel } from './volume';
