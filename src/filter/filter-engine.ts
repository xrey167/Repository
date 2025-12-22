/**
 * Filter engine
 * Composable filter pipeline with AND/OR logic
 */

import type { IFilter, FilterContext, FilterResult, FilterLogic } from './filters/filter.interface';
import { createLogger } from '@/utils';

/**
 * Filter engine
 * Manages filter pipeline and execution
 */
export class FilterEngine {
  private filters: IFilter[] = [];
  private logic: FilterLogic;
  private logger = createLogger('FilterEngine');

  constructor(logic: FilterLogic = 'AND') {
    this.logic = logic;
  }

  /**
   * Add filter to pipeline
   */
  addFilter(filter: IFilter): void {
    this.filters.push(filter);
    this.logger.debug(`Added filter: ${filter.name}`);
  }

  /**
   * Remove filter from pipeline
   */
  removeFilter(name: string): void {
    const index = this.filters.findIndex((f) => f.name === name);
    if (index !== -1) {
      this.filters.splice(index, 1);
      this.logger.debug(`Removed filter: ${name}`);
    }
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filters = [];
    this.logger.debug('Cleared all filters');
  }

  /**
   * Apply filters to single symbol
   */
  async filter(context: FilterContext): Promise<FilterResult> {
    if (this.filters.length === 0) {
      return { passed: true, score: 1 };
    }

    const results: FilterResult[] = [];

    // Execute all filters
    for (const filter of this.filters) {
      const result = await Promise.resolve(filter.apply(context));
      results.push(result);

      // Short-circuit for AND logic
      if (this.logic === 'AND' && !result.passed) {
        this.logger.debug(
          `Symbol ${context.symbol.symbol} rejected by ${filter.name}: ${result.reason}`
        );

        return {
          passed: false,
          reason: `Failed ${filter.name}: ${result.reason}`,
          score: result.score,
        };
      }

      // Short-circuit for OR logic
      if (this.logic === 'OR' && result.passed) {
        this.logger.debug(`Symbol ${context.symbol.symbol} passed ${filter.name}`);

        return {
          passed: true,
          reason: `Passed ${filter.name}`,
          score: result.score,
        };
      }
    }

    // Final decision
    if (this.logic === 'AND') {
      // All filters passed
      const avgScore = results.reduce((sum, r) => sum + (r.score ?? 1), 0) / results.length;

      return {
        passed: true,
        score: avgScore,
      };
    } else {
      // OR logic - all filters failed
      return {
        passed: false,
        reason: 'No filters passed',
        score: 0,
      };
    }
  }

  /**
   * Apply filters to multiple symbols (parallel)
   */
  async filterMany(contexts: FilterContext[]): Promise<Map<string, FilterResult>> {
    const results = new Map<string, FilterResult>();

    // Process in parallel
    const promises = contexts.map(async (context) => {
      const result = await this.filter(context);
      return { symbol: context.symbol.symbol, result };
    });

    const completed = await Promise.all(promises);

    for (const { symbol, result } of completed) {
      results.set(symbol, result);
    }

    this.logger.info(
      `Filtered ${contexts.length} symbols: ${Array.from(results.values()).filter((r) => r.passed).length} passed`
    );

    return results;
  }

  /**
   * Get symbols that passed filters
   */
  async getPassedSymbols(contexts: FilterContext[]): Promise<FilterContext[]> {
    const results = await this.filterMany(contexts);

    return contexts.filter((ctx) => {
      const result = results.get(ctx.symbol.symbol);
      return result?.passed === true;
    });
  }

  /**
   * Get filter pipeline configuration
   */
  getConfig(): {
    logic: FilterLogic;
    filters: Array<{ name: string; config: Record<string, unknown> }>;
  } {
    return {
      logic: this.logic,
      filters: this.filters.map((f) => ({
        name: f.name,
        config: f.getConfig(),
      })),
    };
  }

  /**
   * Get number of filters in pipeline
   */
  getFilterCount(): number {
    return this.filters.length;
  }

  /**
   * Set filter logic (AND/OR)
   */
  setLogic(logic: FilterLogic): void {
    this.logic = logic;
    this.logger.debug(`Filter logic set to: ${logic}`);
  }

  /**
   * Get filter logic
   */
  getLogic(): FilterLogic {
    return this.logic;
  }
}
