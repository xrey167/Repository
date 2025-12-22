/**
 * CSV file-based storage
 * Exports and imports data in CSV format
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'fs';
import { dirname } from 'path';
import { createLogger } from '@/utils';

/**
 * CSV row type
 */
export type CSVRow = Record<string, string | number | boolean>;

/**
 * CSV store options
 */
export interface CSVStoreOptions {
  /**
   * File path for CSV storage
   */
  filePath: string;

  /**
   * Column headers
   */
  headers: string[];

  /**
   * Delimiter (default: ',')
   */
  delimiter?: string;

  /**
   * Append mode (default: false)
   */
  append?: boolean;
}

/**
 * CSV file-based store
 * Exports and imports tabular data
 */
export class CSVStore {
  private filePath: string;
  private headers: string[];
  private delimiter: string;
  private append: boolean;
  private logger = createLogger('CSVStore');

  constructor(options: CSVStoreOptions) {
    this.filePath = options.filePath;
    this.headers = options.headers;
    this.delimiter = options.delimiter ?? ',';
    this.append = options.append ?? false;

    // Create file with headers if it doesn't exist
    if (!this.append && !existsSync(this.filePath)) {
      this.writeHeaders();
    }
  }

  /**
   * Write headers to file
   */
  private writeHeaders(): void {
    try {
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const headerRow = this.headers.join(this.delimiter) + '\n';
      writeFileSync(this.filePath, headerRow, 'utf-8');
      this.logger.debug(`Created CSV file with headers: ${this.filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write headers to ${this.filePath}`, error);
      throw error;
    }
  }

  /**
   * Write single row
   */
  writeRow(row: CSVRow): void {
    try {
      const values = this.headers.map((header) => {
        const value = row[header];
        if (value === undefined || value === null) {
          return '';
        }
        // Escape values containing delimiter or quotes
        const stringValue = String(value);
        if (stringValue.includes(this.delimiter) || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });

      const csvRow = values.join(this.delimiter) + '\n';

      if (this.append || existsSync(this.filePath)) {
        appendFileSync(this.filePath, csvRow, 'utf-8');
      } else {
        this.writeHeaders();
        appendFileSync(this.filePath, csvRow, 'utf-8');
      }

      this.logger.debug(`Wrote row to ${this.filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write row to ${this.filePath}`, error);
      throw error;
    }
  }

  /**
   * Write multiple rows
   */
  writeRows(rows: CSVRow[]): void {
    for (const row of rows) {
      this.writeRow(row);
    }
    this.logger.debug(`Wrote ${rows.length} rows to ${this.filePath}`);
  }

  /**
   * Read all rows
   */
  readRows(): CSVRow[] {
    try {
      if (!existsSync(this.filePath)) {
        this.logger.warn(`File does not exist: ${this.filePath}`);
        return [];
      }

      const content = readFileSync(this.filePath, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim() !== '');

      if (lines.length === 0) {
        return [];
      }

      // Skip header row
      const dataLines = lines.slice(1);
      const rows: CSVRow[] = [];

      for (const line of dataLines) {
        const values = this.parseLine(line);
        const row: CSVRow = {};

        for (let i = 0; i < this.headers.length; i++) {
          const value = values[i];
          // Try to parse as number
          const numValue = Number(value);
          if (!isNaN(numValue) && value !== '') {
            row[this.headers[i]] = numValue;
          } else if (value === 'true' || value === 'false') {
            row[this.headers[i]] = value === 'true';
          } else {
            row[this.headers[i]] = value;
          }
        }

        rows.push(row);
      }

      this.logger.debug(`Read ${rows.length} rows from ${this.filePath}`);
      return rows;
    } catch (error) {
      this.logger.error(`Failed to read from ${this.filePath}`, error);
      return [];
    }
  }

  /**
   * Parse CSV line handling quoted values
   */
  private parseLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === this.delimiter && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current);
    return values;
  }

  /**
   * Clear file (rewrite with headers only)
   */
  clear(): void {
    this.writeHeaders();
    this.logger.debug(`Cleared ${this.filePath}`);
  }

  /**
   * Get file path
   */
  getFilePath(): string {
    return this.filePath;
  }
}
