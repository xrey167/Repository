/**
 * Structured logging utility
 * Provides consistent logging across the application
 */

import { env } from '@/config/env';

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: string;
  data?: unknown;
}

/**
 * Logger class with structured logging
 */
export class Logger {
  private readonly context: string;
  private readonly minLevel: LogLevel;

  constructor(context: string, minLevel?: LogLevel) {
    this.context = context;
    this.minLevel = minLevel || (env.LOG_LEVEL as LogLevel) || 'info';
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const minIndex = levels.indexOf(this.minLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex >= minIndex;
  }

  /**
   * Format log entry
   */
  private formatEntry(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const context = entry.context ? `[${entry.context}]` : '';
    const data = entry.data ? `\n${JSON.stringify(entry.data, null, 2)}` : '';
    return `${timestamp} ${level} ${context} ${entry.message}${data}`;
  }

  /**
   * Log at a specific level
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: this.context,
      data,
    };

    const formatted = this.formatEntry(entry);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  /**
   * Info level logging
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown): void {
    if (error instanceof Error) {
      this.log('error', message, {
        error: error.message,
        stack: error.stack,
      });
    } else {
      this.log('error', message, error);
    }
  }
}

/**
 * Create a logger instance
 * @param context - Logger context (module name, class name, etc.)
 * @returns Logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
