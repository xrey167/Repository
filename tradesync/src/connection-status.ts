/**
 * Connection Status Manager
 *
 * Tracks the health and status of the TradeSync API connection.
 * Records successful/failed requests and provides connection status.
 */

import type { ConnectionStatus } from './types.js';

/**
 * Default timeout for considering a connection "stale" (5 minutes)
 */
const DEFAULT_STALE_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Connection status event types
 */
export type ConnectionStatusEvent = 'connected' | 'disconnected' | 'degraded';

/**
 * Event listener for connection status changes
 */
export type ConnectionStatusListener = (event: ConnectionStatusEvent, status: ConnectionStatus) => void;

/**
 * Connection Status Manager
 *
 * Tracks API connection health and provides status information.
 */
export class ConnectionStatusManager {
  private lastSuccessfulRequest: Date | null = null;
  private lastFailedRequest: Date | null = null;
  private consecutiveFailures = 0;
  private consecutiveTimeouts = 0;
  private lastError: string | null = null;
  private wasConnected = false;
  private listeners: ConnectionStatusListener[] = [];
  private readonly staleTimeoutMs: number;

  /**
   * Create a new ConnectionStatusManager
   *
   * @param staleTimeoutMs - Time in ms after which a connection is considered stale
   */
  constructor(staleTimeoutMs: number = DEFAULT_STALE_TIMEOUT_MS) {
    this.staleTimeoutMs = staleTimeoutMs;
  }

  /**
   * Record a successful request
   */
  recordSuccess(): void {
    const wasDisconnected = !this.isConnected();

    this.lastSuccessfulRequest = new Date();
    this.consecutiveFailures = 0;
    this.consecutiveTimeouts = 0;
    this.lastError = null;

    // Emit connected event if we were previously disconnected
    if (wasDisconnected) {
      this.wasConnected = true;
      this.emitEvent('connected');
    }
  }

  /**
   * Record a failed request
   *
   * @param error - The error that occurred
   */
  recordFailure(error: Error): void {
    this.lastFailedRequest = new Date();
    this.consecutiveFailures++;
    this.lastError = error.message;

    // Check if we've become disconnected
    if (this.consecutiveFailures >= 3 && this.wasConnected) {
      this.wasConnected = false;
      this.emitEvent('disconnected');
    } else if (this.consecutiveFailures >= 2) {
      this.emitEvent('degraded');
    }
  }

  /**
   * Record a timeout
   */
  recordTimeout(): void {
    this.lastFailedRequest = new Date();
    this.consecutiveFailures++;
    this.consecutiveTimeouts++;
    this.lastError = 'Request timed out';

    // Check if we've become disconnected
    if (this.consecutiveTimeouts >= 2 && this.wasConnected) {
      this.wasConnected = false;
      this.emitEvent('disconnected');
    } else if (this.consecutiveTimeouts >= 1) {
      this.emitEvent('degraded');
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return {
      isConnected: this.isConnected(),
      lastSuccessfulRequest: this.lastSuccessfulRequest,
      lastFailedRequest: this.lastFailedRequest,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveTimeouts: this.consecutiveTimeouts,
      lastError: this.lastError,
    };
  }

  /**
   * Check if currently connected (had recent successful request)
   */
  isConnected(): boolean {
    if (!this.lastSuccessfulRequest) {
      return false;
    }

    // Check if connection is stale
    const timeSinceLastSuccess = Date.now() - this.lastSuccessfulRequest.getTime();
    if (timeSinceLastSuccess > this.staleTimeoutMs) {
      return false;
    }

    // Check for too many consecutive failures
    if (this.consecutiveFailures >= 3) {
      return false;
    }

    return true;
  }

  /**
   * Check if connection is healthy (connected with no recent errors)
   */
  isHealthy(): boolean {
    return this.isConnected() && this.consecutiveFailures === 0;
  }

  /**
   * Get time since last successful request in milliseconds
   */
  getTimeSinceLastSuccess(): number | null {
    if (!this.lastSuccessfulRequest) {
      return null;
    }
    return Date.now() - this.lastSuccessfulRequest.getTime();
  }

  /**
   * Reset all counters and status
   */
  reset(): void {
    this.lastSuccessfulRequest = null;
    this.lastFailedRequest = null;
    this.consecutiveFailures = 0;
    this.consecutiveTimeouts = 0;
    this.lastError = null;
    this.wasConnected = false;
  }

  /**
   * Add a listener for connection status changes
   */
  addListener(listener: ConnectionStatusListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: ConnectionStatusListener): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Emit a status change event to all listeners
   */
  private emitEvent(event: ConnectionStatusEvent): void {
    const status = this.getStatus();
    for (const listener of this.listeners) {
      try {
        listener(event, status);
      } catch {
        // Ignore listener errors
      }
    }
  }
}
