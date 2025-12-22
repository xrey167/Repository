/**
 * Math utility functions for trading calculations
 */

/**
 * Round a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentage change
 * @param from - Starting value
 * @param to - Ending value
 * @returns Percentage change
 */
export function percentageChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / Math.abs(from)) * 100;
}

/**
 * Calculate percentage of a value
 * @param value - Base value
 * @param percentage - Percentage (e.g., 2 for 2%)
 * @returns Calculated amount
 */
export function percentOf(value: number, percentage: number): number {
  return (value * percentage) / 100;
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate simple moving average
 * @param values - Array of numbers
 * @returns Moving average
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate standard deviation
 * @param values - Array of numbers
 * @returns Standard deviation
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = average(values);
  const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
  const variance = average(squaredDiffs);
  return Math.sqrt(variance);
}

/**
 * Calculate sum of an array
 * @param values - Array of numbers
 * @returns Sum
 */
export function sum(values: number[]): number {
  return values.reduce((total, val) => total + val, 0);
}

/**
 * Find minimum value in array
 * @param values - Array of numbers
 * @returns Minimum value
 */
export function min(values: number[]): number {
  return Math.min(...values);
}

/**
 * Find maximum value in array
 * @param values - Array of numbers
 * @returns Maximum value
 */
export function max(values: number[]): number {
  return Math.max(...values);
}

/**
 * Check if number is within a range (inclusive)
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Convert basis points to decimal (e.g., 100 bp = 0.01)
 * @param basisPoints - Basis points
 * @returns Decimal value
 */
export function basisPointsToDecimal(basisPoints: number): number {
  return basisPoints / 10000;
}

/**
 * Convert decimal to basis points (e.g., 0.01 = 100 bp)
 * @param decimal - Decimal value
 * @returns Basis points
 */
export function decimalToBasisPoints(decimal: number): number {
  return decimal * 10000;
}

/**
 * Round to tick size (price precision)
 * @param value - Value to round
 * @param tickSize - Minimum price movement
 * @returns Rounded value
 */
export function roundToTickSize(value: number, tickSize: number): number {
  return Math.round(value / tickSize) * tickSize;
}

/**
 * Round to lot size (quantity precision)
 * @param value - Value to round
 * @param lotSize - Minimum quantity movement
 * @returns Rounded value
 */
export function roundToLotSize(value: number, lotSize: number): number {
  return Math.floor(value / lotSize) * lotSize;
}

/**
 * Calculate compound annual growth rate (CAGR)
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param years - Number of years
 * @returns CAGR as percentage
 */
export function cagr(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}
