/**
 * Default Symbol Mapping Rules
 *
 * Master Account: 5980034 (ActivTrades) - Uses futures with expiry (UsaTecDec25, Usa500Mar26)
 * Client Account: 844891 (ACY Securities) - Mix of perpetual CFDs and contracts
 *
 * Strategy:
 * - When client has contracts: use map_to_latest_expiry (auto-rollover)
 * - When client only has perpetual: use map_to_perpetual with forcePerpetual
 * - Some instruments not available on client: skip_and_warn
 */

import type { SymbolMappingRule } from './symbol-mapper.js';

/**
 * Complete mapping rules for ActivTrades → ACY Securities
 */
export const ACTIVTRADES_TO_ACY_RULES: SymbolMappingRule[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // US INDICES
  // ═══════════════════════════════════════════════════════════════════════════

  // US Tech 100 (Nasdaq) - Has both contracts AND perpetual on client
  {
    masterPatterns: ['UsaTec'],
    clientBase: 'US100',
    fallback: 'map_to_latest_expiry',     // Use US100.dec25, US100.mar26 when available
    clientExpiryFormat: 'lowercase_dot',   // Format: US100.mar26
    // Falls back to NAS100 perpetual if no matching contract
  },

  // S&P 500 - ONLY perpetual on client (no contracts)
  {
    masterPatterns: ['Usa500'],
    clientBase: 'SP500',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,                  // No SP500.xxx contracts available
  },

  // Dow Jones 30 - ONLY perpetual on client (no contracts)
  {
    masterPatterns: ['UsaInd'],
    clientBase: 'DJ30',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,                  // No DJ30.xxx contracts available
  },

  // Russell 2000 - ONLY perpetual on client
  {
    masterPatterns: ['UsaRus'],
    clientBase: 'US2000',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // VIX - Has contracts on client
  {
    masterPatterns: ['UsaVix'],
    clientBase: 'VIX',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',   // VIX.jan26
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EUROPEAN INDICES
  // ═══════════════════════════════════════════════════════════════════════════

  // German DAX - ONLY perpetual (DAX or GER30)
  {
    masterPatterns: ['Ger40'],
    clientBase: 'DAX',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // Euro Stoxx 50 - ONLY perpetual
  {
    masterPatterns: ['Euro50'],
    clientBase: 'STOXX50',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // UK FTSE 100 - ONLY perpetual
  {
    masterPatterns: ['UK100'],
    clientBase: 'UK100',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // French CAC 40 - ONLY perpetual
  {
    masterPatterns: ['Fra40'],
    clientBase: 'FR40',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ASIAN INDICES
  // ═══════════════════════════════════════════════════════════════════════════

  // Japan Nikkei 225 - ONLY perpetual
  {
    masterPatterns: ['Jp225'],
    clientBase: 'JP225',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENERGY
  // ═══════════════════════════════════════════════════════════════════════════

  // Brent Crude - Has contracts (BRENT.jan26) + perpetual (UKBRENTzero)
  {
    masterPatterns: ['Brent'],
    clientBase: 'BRENT',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
    // Falls back to UKBRENTzero if no contract
  },

  // WTI Crude - ONLY perpetual (USWTIzero)
  {
    masterPatterns: ['LCrude'],
    clientBase: 'USWTIzero',
    fallback: 'map_to_perpetual',
    forcePerpetual: true,
  },

  // Gasoil - Has contracts (LSGO.jan26)
  {
    masterPatterns: ['Gasol'],
    clientBase: 'LSGO',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // METALS
  // ═══════════════════════════════════════════════════════════════════════════

  // Copper - Has contracts (COP.mar26) + perpetual (COPPER)
  {
    masterPatterns: ['Copper'],
    clientBase: 'COP',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGRICULTURE / SOFTS
  // ═══════════════════════════════════════════════════════════════════════════

  // Cocoa - Has contracts (USCC.mar26) - NO perpetual
  {
    masterPatterns: ['Cocoa'],
    clientBase: 'USCC',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // Coffee - Has contracts (CFA.mar26) - NO perpetual
  {
    masterPatterns: ['Coffee'],
    clientBase: 'CFA',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // Cotton - Has contracts (CT.mar26) - NO perpetual
  {
    masterPatterns: ['Cotton'],
    clientBase: 'CT',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // Orange Juice - Has contracts (ORJ.jan26) - NO perpetual
  {
    masterPatterns: ['OJ'],
    clientBase: 'ORJ',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER
  // ═══════════════════════════════════════════════════════════════════════════

  // USD Index - Has contracts (USDX.mar26) + perpetual (USDIndex)
  {
    masterPatterns: ['USDInd'],
    clientBase: 'USDX',
    fallback: 'map_to_latest_expiry',
    clientExpiryFormat: 'lowercase_dot',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NOT AVAILABLE ON CLIENT - Will skip with warning
  // ═══════════════════════════════════════════════════════════════════════════

  // US T-Bonds
  {
    masterPatterns: ['UsaTB'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Spanish IBEX 35
  {
    masterPatterns: ['Esp35'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Italian FTSE MIB
  {
    masterPatterns: ['Ita40'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Natural Gas
  {
    masterPatterns: ['NGas'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Corn
  {
    masterPatterns: ['Corn'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Wheat
  {
    masterPatterns: ['Wheat'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Sugar
  {
    masterPatterns: ['Sugar'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Oats
  {
    masterPatterns: ['Oats'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Soybeans
  {
    masterPatterns: ['Soybns'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Soybean Oil
  {
    masterPatterns: ['SoyOil'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Soybean Meal
  {
    masterPatterns: ['SoyMl'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Carbon/EUA
  {
    masterPatterns: ['Carbon'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Mini Dollar
  {
    masterPatterns: ['MinDol'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // Bovespa
  {
    masterPatterns: ['Bra50'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },

  // European Bonds
  {
    masterPatterns: ['EuBTP', 'EuBbl', 'EuBund', 'EuStz'],
    clientBase: '',
    fallback: 'skip_and_warn',
  },
];

/**
 * Additional aliases for symbol recognition
 */
export const SYMBOL_ALIASES: Record<string, string[]> = {
  // US Tech 100 aliases
  'USTEC': ['UsaTec', 'US100', 'NAS100', 'NQ', 'NASDAQ', 'NDX'],

  // S&P 500 aliases
  'SP500': ['Usa500', 'US500', 'SPX', 'ES', 'SPY'],

  // Dow Jones aliases
  'DJ30': ['UsaInd', 'US30', 'DOW', 'DJIA', 'YM'],

  // Russell 2000 aliases
  'US2000': ['UsaRus', 'RTY', 'RUT', 'RUSSELL'],

  // DAX aliases
  'DAX': ['Ger40', 'GER40', 'GER30', 'DE40'],

  // Cocoa aliases
  'USCC': ['Cocoa', 'CC', 'COC'],

  // Orange Juice aliases
  'ORJ': ['OJ', 'ORANGE', 'OJUICE'],
};

export default ACTIVTRADES_TO_ACY_RULES;
