/**
 * Price filter
 * Filters symbols by price range
 */

import type { IFilter, FilterContext, FilterResult } from './filter.interface';
import { createLogger } from '@/utils';

/**
 * Price filter options
 */
export interface PriceFilterOptions {
  /**
   * Minimum price
   */
  minPrice?: number;

  /**
   * Maximum price
   */
  maxPrice?: number;

  /**
   * Minimum price change percentage (24h)
   */
  minPriceChange?: number;

  /**
   * Maximum price change percentage (24h)
   */
  maxPriceChange?: number;
}

/**
 * Price filter
 * Filters assets by price and price change criteria
 */
export class PriceFilter implements IFilter {
  readonly name = 'PriceFilter';
  readonly description = 'Filter by price range and price change';

  private options: PriceFilterOptions;
  private logger = createLogger('PriceFilter');

  constructor(options: PriceFilterOptions) {
    this.options = options;
  }

  /**
   * Apply price filter
   */
  apply(context: FilterContext): FilterResult {
    const { ticker } = context;

    if (!ticker) {
      return {
        passed: false,
        reason: 'No ticker data available',
        score: 0,
      };
    }

    const price = ticker.last;

    // Check minimum price
    if (this.options.minPrice !== undefined && price < this.options.minPrice) {
      return {
        passed: false,
        reason: `Price ${price} below minimum ${this.options.minPrice}`,
        score: 0,
      };
    }

    // Check maximum price
    if (this.options.maxPrice !== undefined && price > this.options.maxPrice) {
      return {
        passed: false,
        reason: `Price ${price} above maximum ${this.options.maxPrice}`,
        score: 0,
      };
    }

    // Check price change
    if (ticker.priceChange !== undefined) {
      const priceChange = ticker.priceChangePercent ?? 0;

      if (this.options.minPriceChange !== undefined && priceChange < this.options.minPriceChange) {
        return {
          passed: false,
          reason: `Price change ${priceChange.toFixed(2)}% below minimum ${this.options.minPriceChange}%`,
          score: 0,
        };
      }

      if (this.options.maxPriceChange !== undefined && priceChange > this.options.maxPriceChange) {
        return {
          passed: false,
          reason: `Price change ${priceChange.toFixed(2)}% above maximum ${this.options.maxPriceChange}%`,
          score: 0,
        };
      }
    }

    // Calculate score based on price position in range
    let score = 1;

    if (this.options.minPrice !== undefined && this.options.maxPrice !== undefined) {
      const range = this.options.maxPrice - this.options.minPrice;
      const position = (price - this.options.minPrice) / range;
      score = Math.max(0, Math.min(1, position));
    }

    this.logger.debug(`${context.symbol.symbol} passed price filter (score: ${score.toFixed(2)})`);

    return {
      passed: true,
      score,
    };
  }

  /**
   * Get filter configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      ...this.options,
    };
  }
}
