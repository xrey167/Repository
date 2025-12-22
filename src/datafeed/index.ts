/**
 * Datafeed module
 * Provides data adapters for multiple sources with factory pattern
 */

export { DatafeedFactory } from './factory';
export { AdapterRegistry, getAdapterRegistry } from './factory';
export { InMemoryCache } from './cache';
export type { IDatafeedCache, CacheEntry } from './cache';

export {
  BaseAdapter,
  MockAdapter,
  CSVAdapter,
  BinanceAdapter,
  CoinbaseAdapter,
} from './adapters';
