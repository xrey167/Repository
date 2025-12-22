/**
 * Test file to verify auto-documentation hook
 * This file tests that TypeDoc regenerates automatically
 */

/**
 * Test function for documentation generation
 * @param name - The name to greet
 * @returns A greeting message
 *
 * @example
 * ```typescript
 * const result = testGreeting("World");
 * console.log(result); // "Hello, World!"
 * ```
 */
export function testGreeting(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Test class for documentation
 */
export class TestClass {
  /**
   * Constructor for TestClass
   * @param value - Initial value
   */
  constructor(private value: number) {}

  /**
   * Get the current value
   * @returns The stored value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Set a new value
   * @param newValue - The new value to set
   */
  setValue(newValue: number): void {
    this.value = newValue;
  }
}
