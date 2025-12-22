/**
 * Screener engine
 * Main screening logic for market opportunities
 */

import type { ICriteria, ScreeningContext, ScreeningResult } from './criteria/criteria.interface';
import { createLogger } from '@/utils';

/**
 * Screener options
 */
export interface ScreenerOptions {
  /**
   * Maximum results to return
   */
  maxResults?: number;

  /**
   * Minimum score threshold (0-1)
   */
  minScore?: number;

  /**
   * Sort by score (descending)
   */
  sortByScore?: boolean;
}

/**
 * Screener engine
 * Scans markets for opportunities matching criteria
 */
export class ScreenerEngine {
  private criteria: ICriteria[] = [];
  private logger = createLogger('ScreenerEngine');

  /**
   * Add screening criteria
   */
  addCriteria(criteria: ICriteria): void {
    this.criteria.push(criteria);
    this.logger.debug(`Added criteria: ${criteria.name}`);
  }

  /**
   * Remove criteria
   */
  removeCriteria(name: string): void {
    const index = this.criteria.findIndex((c) => c.name === name);
    if (index !== -1) {
      this.criteria.splice(index, 1);
      this.logger.debug(`Removed criteria: ${name}`);
    }
  }

  /**
   * Clear all criteria
   */
  clearCriteria(): void {
    this.criteria = [];
    this.logger.debug('Cleared all criteria');
  }

  /**
   * Screen single symbol against all criteria
   */
  async screenSymbol(context: ScreeningContext): Promise<ScreeningResult[]> {
    const results: ScreeningResult[] = [];

    for (const criterion of this.criteria) {
      try {
        const result = await Promise.resolve(criterion.check(context));

        if (result) {
          results.push(result);
          this.logger.debug(
            `${context.symbol.symbol} matched ${criterion.name}: ${result.reason}`
          );
        }
      } catch (error) {
        this.logger.error(`Error checking ${criterion.name} for ${context.symbol.symbol}`, error);
      }
    }

    return results;
  }

  /**
   * Screen multiple symbols in parallel
   */
  async screenMany(
    contexts: ScreeningContext[],
    options: ScreenerOptions = {}
  ): Promise<ScreeningResult[]> {
    const {
      maxResults = 50,
      minScore = 0,
      sortByScore = true,
    } = options;

    this.logger.info(`Screening ${contexts.length} symbols with ${this.criteria.length} criteria`);

    // Process all symbols in parallel
    const promises = contexts.map((context) => this.screenSymbol(context));
    const allResults = await Promise.all(promises);

    // Flatten results
    let results = allResults.flat();

    // Filter by minimum score
    if (minScore > 0) {
      results = results.filter((r) => r.score >= minScore);
    }

    // Sort by score
    if (sortByScore) {
      results.sort((a, b) => b.score - a.score);
    }

    // Limit results
    if (maxResults > 0) {
      results = results.slice(0, maxResults);
    }

    this.logger.info(`Screening complete: ${results.length} matches found`);

    return results;
  }

  /**
   * Get top matches from screening
   */
  async getTopMatches(
    contexts: ScreeningContext[],
    count: number = 10
  ): Promise<ScreeningResult[]> {
    return this.screenMany(contexts, {
      maxResults: count,
      sortByScore: true,
    });
  }

  /**
   * Group results by symbol
   */
  groupBySymbol(results: ScreeningResult[]): Map<string, ScreeningResult[]> {
    const grouped = new Map<string, ScreeningResult[]>();

    for (const result of results) {
      const existing = grouped.get(result.symbol) || [];
      existing.push(result);
      grouped.set(result.symbol, existing);
    }

    return grouped;
  }

  /**
   * Get aggregate score for each symbol
   * Combines scores from multiple criteria
   */
  getAggregateScores(results: ScreeningResult[]): Map<string, number> {
    const grouped = this.groupBySymbol(results);
    const scores = new Map<string, number>();

    for (const [symbol, symbolResults] of grouped.entries()) {
      const avgScore =
        symbolResults.reduce((sum, r) => sum + r.score, 0) / symbolResults.length;
      scores.set(symbol, avgScore);
    }

    return scores;
  }

  /**
   * Get screener statistics
   */
  getStats(results: ScreeningResult[]): {
    totalMatches: number;
    uniqueSymbols: number;
    avgScore: number;
    topScore: number;
    criteriaCounts: Record<string, number>;
  } {
    const uniqueSymbols = new Set(results.map((r) => r.symbol)).size;
    const avgScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length
      : 0;
    const topScore = results.length > 0
      ? Math.max(...results.map((r) => r.score))
      : 0;

    const criteriaCounts: Record<string, number> = {};
    for (const criterion of this.criteria) {
      const count = results.filter((r) => r.reason.includes(criterion.name)).length;
      criteriaCounts[criterion.name] = count;
    }

    return {
      totalMatches: results.length,
      uniqueSymbols,
      avgScore,
      topScore,
      criteriaCounts,
    };
  }

  /**
   * Get screener configuration
   */
  getConfig(): {
    criteriaCount: number;
    criteria: Array<{ name: string; config: Record<string, unknown> }>;
  } {
    return {
      criteriaCount: this.criteria.length,
      criteria: this.criteria.map((c) => ({
        name: c.name,
        config: c.getConfig(),
      })),
    };
  }
}
