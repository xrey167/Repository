/**
 * Event bus for publish-subscribe pattern
 * Singleton implementation for system-wide event communication
 */

import type { EventType, BaseEvent, EventHandler, EventSubscription } from './event.types';

/**
 * Central event bus for the algotrading system
 * Implements publish-subscribe pattern for loose coupling between modules
 *
 * @example
 * ```typescript
 * const eventBus = EventBus.getInstance();
 *
 * // Subscribe to events
 * const subscription = eventBus.subscribe('candle:new', (event) => {
 *   console.log('New candle:', event.data);
 * });
 *
 * // Publish events
 * eventBus.publish({
 *   type: 'candle:new',
 *   timestamp: Date.now(),
 *   data: candle
 * });
 *
 * // Unsubscribe
 * subscription.unsubscribe();
 * ```
 */
export class EventBus {
  private static instance: EventBus;
  private handlers: Map<EventType, Set<EventHandler>>;
  private subscriptionCounter: number;

  private constructor() {
    this.handlers = new Map();
    this.subscriptionCounter = 0;
  }

  /**
   * Get the singleton instance of EventBus
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event type
   * @param type - Event type to subscribe to
   * @param handler - Handler function to call when event is published
   * @returns Subscription object with unsubscribe method
   */
  public subscribe<T extends BaseEvent = BaseEvent>(
    type: EventType,
    handler: EventHandler<T>
  ): EventSubscription {
    // Get or create handler set for this event type
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    const handlerSet = this.handlers.get(type)!;
    handlerSet.add(handler as EventHandler);

    // Generate subscription ID
    const id = `sub_${++this.subscriptionCounter}`;

    // Return subscription object
    return {
      id,
      type,
      handler: handler as EventHandler,
      unsubscribe: () => this.unsubscribe(type, handler as EventHandler),
    };
  }

  /**
   * Unsubscribe from an event type
   * @param type - Event type to unsubscribe from
   * @param handler - Handler function to remove
   */
  public unsubscribe(type: EventType, handler: EventHandler): void {
    const handlerSet = this.handlers.get(type);
    if (handlerSet) {
      handlerSet.delete(handler);
      // Clean up empty sets
      if (handlerSet.size === 0) {
        this.handlers.delete(type);
      }
    }
  }

  /**
   * Unsubscribe all handlers for an event type
   * @param type - Event type to clear
   */
  public unsubscribeAll(type: EventType): void {
    this.handlers.delete(type);
  }

  /**
   * Clear all event subscriptions
   */
  public clear(): void {
    this.handlers.clear();
  }

  /**
   * Publish an event to all subscribers
   * @param event - Event to publish
   */
  public async publish<T extends BaseEvent = BaseEvent>(event: T): Promise<void> {
    const handlerSet = this.handlers.get(event.type);
    if (!handlerSet || handlerSet.size === 0) {
      return;
    }

    // Call all handlers (allow async handlers)
    const promises: Promise<void>[] = [];
    for (const handler of handlerSet) {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }

    // Wait for all async handlers to complete
    if (promises.length > 0) {
      await Promise.all(promises).catch((error) => {
        console.error(`Error in async event handlers for ${event.type}:`, error);
      });
    }
  }

  /**
   * Publish an event synchronously (does not wait for async handlers)
   * @param event - Event to publish
   */
  public publishSync<T extends BaseEvent = BaseEvent>(event: T): void {
    const handlerSet = this.handlers.get(event.type);
    if (!handlerSet || handlerSet.size === 0) {
      return;
    }

    // Call all handlers
    for (const handler of handlerSet) {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }
  }

  /**
   * Get the number of subscribers for an event type
   * @param type - Event type
   * @returns Number of subscribers
   */
  public getSubscriberCount(type: EventType): number {
    const handlerSet = this.handlers.get(type);
    return handlerSet ? handlerSet.size : 0;
  }

  /**
   * Check if an event type has any subscribers
   * @param type - Event type
   * @returns True if there are subscribers
   */
  public hasSubscribers(type: EventType): boolean {
    return this.getSubscriberCount(type) > 0;
  }

  /**
   * Get all event types that have subscribers
   * @returns Array of event types with subscribers
   */
  public getSubscribedTypes(): EventType[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Subscribe to multiple event types with the same handler
   * @param types - Array of event types
   * @param handler - Handler function
   * @returns Array of subscriptions
   */
  public subscribeMultiple(types: EventType[], handler: EventHandler): EventSubscription[] {
    return types.map((type) => this.subscribe(type, handler));
  }

  /**
   * Subscribe to an event type once (auto-unsubscribe after first event)
   * @param type - Event type
   * @param handler - Handler function
   * @returns Subscription object
   */
  public subscribeOnce<T extends BaseEvent = BaseEvent>(
    type: EventType,
    handler: EventHandler<T>
  ): EventSubscription {
    const wrappedHandler: EventHandler<T> = (event: T) => {
      handler(event);
      this.unsubscribe(type, wrappedHandler as EventHandler);
    };

    return this.subscribe(type, wrappedHandler);
  }
}

/**
 * Get the singleton EventBus instance
 * Convenience function for easy importing
 */
export function getEventBus(): EventBus {
  return EventBus.getInstance();
}
