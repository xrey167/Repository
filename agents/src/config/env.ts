/**
 * Environment configuration with priority:
 * 1. .env.local (local overrides)
 * 2. .env (project defaults)
 * 3. process.env (Windows system env)
 */

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env files in priority order
const root = join(__dirname, "../..");

// Load .env first (base config)
if (existsSync(join(root, ".env"))) {
  expand(config({ path: join(root, ".env") }));
}

// Load .env.local second (overrides .env AND Windows env)
if (existsSync(join(root, ".env.local"))) {
  expand(config({ path: join(root, ".env.local"), override: true }));
}

// Export config
export const env = {
  // API Keys - falls back to Windows env if not in .env
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Project specific
  DATABASE_URL: process.env.DATABASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // Helpers
  isDev: process.env.NODE_ENV !== "production",
} as const;

// Optional: Validate required keys (uncomment when ready)
// const required = ["ANTHROPIC_API_KEY"] as const;
// for (const key of required) {
//   if (!env[key]) {
//     throw new Error(`Missing required env var: ${key}`);
//   }
// }
