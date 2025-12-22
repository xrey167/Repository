/**
 * Date and time utility functions
 */

import type { Timeframe } from '@/core/types';

/**
 * Convert timeframe to milliseconds
 * @param timeframe - Timeframe string
 * @returns Milliseconds
 */
export function timeframeToMs(timeframe: Timeframe): number {
  const units: Record<string, number> = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
  };

  const match = timeframe.match(/^(\d+)([mhdwM])$/);
  if (!match) {
    throw new Error(`Invalid timeframe: ${timeframe}`);
  }

  const [, amount, unit] = match;
  return parseInt(amount) * units[unit];
}

/**
 * Round timestamp to timeframe
 * @param timestamp - Timestamp in milliseconds
 * @param timeframe - Timeframe to round to
 * @returns Rounded timestamp
 */
export function roundToTimeframe(timestamp: number, timeframe: Timeframe): number {
  const ms = timeframeToMs(timeframe);
  return Math.floor(timestamp / ms) * ms;
}

/**
 * Get start of day timestamp
 * @param timestamp - Timestamp in milliseconds
 * @returns Start of day timestamp
 */
export function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Get end of day timestamp
 * @param timestamp - Timestamp in milliseconds
 * @returns End of day timestamp
 */
export function endOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/**
 * Format timestamp to ISO string
 * @param timestamp - Timestamp in milliseconds
 * @returns ISO string
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Format timestamp to readable string
 * @param timestamp - Timestamp in milliseconds
 * @returns Readable date string
 */
export function formatReadable(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Calculate time difference in milliseconds
 * @param start - Start timestamp
 * @param end - End timestamp
 * @returns Difference in milliseconds
 */
export function timeDiff(start: number, end: number): number {
  return end - start;
}

/**
 * Convert milliseconds to human-readable duration
 * @param ms - Milliseconds
 * @returns Human-readable duration
 */
export function msToReadable(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Check if timestamp is within trading hours (optional utility)
 * @param timestamp - Timestamp to check
 * @param openHour - Market open hour (0-23)
 * @param closeHour - Market close hour (0-23)
 * @returns True if within trading hours
 */
export function isWithinTradingHours(
  timestamp: number,
  openHour: number = 9,
  closeHour: number = 16
): boolean {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour >= openHour && hour < closeHour;
}

/**
 * Add time to timestamp
 * @param timestamp - Base timestamp
 * @param amount - Amount to add
 * @param unit - Time unit
 * @returns New timestamp
 */
export function addTime(
  timestamp: number,
  amount: number,
  unit: 'ms' | 's' | 'm' | 'h' | 'd'
): number {
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return timestamp + amount * multipliers[unit];
}

/**
 * Get timestamp range for a period
 * @param period - Period in days
 * @param endTimestamp - End timestamp (default: now)
 * @returns Start and end timestamps
 */
export function getTimeRange(
  period: number,
  endTimestamp: number = Date.now()
): [number, number] {
  const start = endTimestamp - period * 24 * 60 * 60 * 1000;
  return [start, endTimestamp];
}
