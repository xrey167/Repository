/**
 * TradeSync Symbol Mapper
 *
 * Intelligent symbol mapping for futures/CFD copy trading.
 * Handles:
 * - Different broker naming conventions (UsaTecDec25 vs US100.dec25)
 * - Futures rollover (automatic expiry detection)
 * - Contract to CFD mapping (expiring to perpetual)
 * - Configurable fallback rules per symbol
 */

import type { TradeSyncClient } from './client.js';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Expiry information extracted from symbol
 */
export interface SymbolExpiry {
  /** Month (1-12) */
  month: number;
  /** Year (2-digit or 4-digit) */
  year: number;
  /** Original expiry string from symbol */
  raw: string;
}

/**
 * Parsed symbol with normalized components
 */
export interface ParsedSymbol {
  /** Original symbol string */
  original: string;
  /** Normalized base symbol (e.g., 'USTEC', 'US100', 'NAS100') */
  base: string;
  /** Expiry info if present */
  expiry?: SymbolExpiry;
  /** Whether this is a perpetual/CFD (no expiry) */
  isPerpetual: boolean;
  /** Detected broker naming style */
  style: SymbolStyle;
}

/**
 * Symbol naming style/convention
 */
export type SymbolStyle =
  | 'futures_month_year'    // UsaTecDec25, GerDaxMar26
  | 'cfd_dot_expiry'        // US100.dec25, GER40.mar26
  | 'futures_code'          // NQZ24, ESH25 (CME style)
  | 'perpetual'             // US100, GER40, NAS100
  | 'unknown';

/**
 * Fallback behavior when exact match not found
 */
export type FallbackBehavior =
  | 'map_to_perpetual'      // Map to CFD/perpetual equivalent
  | 'map_to_latest_expiry'  // Map to latest available contract
  | 'skip_and_warn'         // Don't copy, emit warning
  | 'error';                // Throw error

/**
 * Mapping rule for a base symbol
 */
export interface SymbolMappingRule {
  /** Base symbol patterns to match (regex or exact) */
  masterPatterns: string[];
  /** Client base symbol to map to */
  clientBase: string;
  /** Fallback behavior for this symbol */
  fallback: FallbackBehavior;
  /** Force perpetual mapping (ignore expiry even if available) */
  forcePerpetual?: boolean;
  /** Custom expiry format for client (e.g., '.dec25' vs 'Dec25') */
  clientExpiryFormat?: 'lowercase_dot' | 'titlecase' | 'uppercase' | 'none';
}

/**
 * Symbol mapping configuration
 */
export interface SymbolMapperConfig {
  /** Mapping rules by base symbol category */
  rules: SymbolMappingRule[];
  /** Default fallback behavior */
  defaultFallback: FallbackBehavior;
  /** Known base symbol aliases (different names for same underlying) */
  aliases: Record<string, string[]>;
}

/**
 * Result of a symbol mapping operation
 */
export interface MappingResult {
  /** Whether mapping was successful */
  success: boolean;
  /** Original master symbol */
  masterSymbol: string;
  /** Mapped client symbol (if successful) */
  clientSymbol?: string;
  /** Rule that was applied */
  appliedRule?: SymbolMappingRule;
  /** Fallback was used */
  usedFallback: boolean;
  /** Warning message if any */
  warning?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Discovered symbol from an account
 */
export interface DiscoveredSymbol {
  /** Symbol name */
  symbol: string;
  /** Parsed symbol info */
  parsed: ParsedSymbol;
  /** Account ID where found */
  accountId: number;
  /** Broker name */
  broker?: string;
}

// ============================================================================
// Month Mappings
// ============================================================================

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

// CME futures month codes
const FUTURES_MONTH_CODES: Record<string, number> = {
  f: 1, g: 2, h: 3, j: 4, k: 5, m: 6,
  n: 7, q: 8, u: 9, v: 10, x: 11, z: 12,
};

const MONTH_TO_NAME: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
};

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default base symbol aliases (common equivalents)
 * Based on research of major CFD brokers (IG, AvaTrade, Capital.com, XTB, etc.)
 * and exchange futures symbols (CME, EUREX, ICE, MEFF, SGX, NYMEX, COMEX)
 */
export const DEFAULT_ALIASES: Record<string, string[]> = {
  // US Tech / Nasdaq 100 (NDX)
  // CFD: US100, NAS100, USTEC, NDX, USTECH100
  // CME Futures: NQ (E-mini), MNQ (Micro)
  'NAS100': ['USTEC', 'US100', 'USTECH', 'NDX', 'NQ', 'MNQ', 'NASDAQ', 'NAS', 'USTEC100', 'USATEC', 'USA100', 'USTECH100', 'TECH100'],

  // US 500 / S&P 500 (SPX)
  // CFD: US500, SPX500, SP500, USA500
  // CME Futures: ES (E-mini), MES (Micro)
  // NOTE: SPY is an ETF, not a CFD - excluded from this group
  'SP500': ['SPX', 'US500', 'ES', 'MES', 'USA500', 'SNP500', 'SPX500', 'USASPX'],

  // US 30 / Dow Jones Industrial Average (DJIA)
  // CFD: US30, DJ30, USA30, DJIA, WallStreet30
  // CME Futures: YM (E-mini), MYM (Micro)
  'DJ30': ['DOW', 'DJIA', 'US30', 'YM', 'MYM', 'DOWJONES', 'USAIND', 'DJI', 'USA30', 'WALLSTREET30', 'WALLST30', 'DOW30'],

  // Russell 2000 Small Cap Index
  // CFD: US2000, USA2000
  // CME Futures: RTY (E-mini), M2K (Micro)
  'US2000': ['RUSSELL', 'RTY', 'M2K', 'RUT', 'R2K', 'USARUS', 'RUSSELL2000', 'USA2000', 'SMALLCAP2000', 'USSMALLCAP'],

  // German DAX 40 / GER30 CFD (formerly DAX 30)
  // CFD: GER40, GER30, DE40, GERMANY40
  // Eurex Futures: FDAX (full), FDXM (Mini), FDXS (Micro)
  // NOTE: DAX is a separate cash index product with different lot minimums, excluded from this group
  'GER30': ['GER40', 'GERDAX', 'DE40', 'FDAX', 'FDXM', 'FDXS', 'GERMANY40', 'DEU40', 'GDAXI'],

  // Euro Stoxx 50
  // CFD: EU50, STOXX50, EURO50
  // Eurex Futures: FESX (full), FESXM (Mini)
  'STOXX50': ['EU50', 'EURO50', 'SX5E', 'EUROSTOXX', 'EUROSTOXX50', 'FESX', 'FESXM', 'EUSTX50', 'EUR50'],

  // UK FTSE 100
  // CFD: UK100, FTSE100
  // ICE Futures: Z (FTSE 100), CME: FT1 (E-mini)
  'UK100': ['FTSE', 'FTSE100', 'UKX', 'GBR100', 'UKFTSE', 'Z', 'FT1'],

  // France CAC 40
  // CFD: FR40, FRA40, CAC40
  // Euronext/LIFFE Futures: FCE
  'FR40': ['CAC', 'CAC40', 'FRA40', 'FRANCE40', 'FCE', 'PX1'],

  // Spain IBEX 35
  // CFD: ESP35, ES35, SPN35, IBEX35
  // MEFF Futures: BIBX (Mini IBEX)
  'SPN35': ['ESP35', 'IBEX', 'IBEX35', 'SPAIN35', 'ES35', 'SPA35', 'ESPIX', 'BIBX'],

  // Italy FTSE MIB (MIB 40)
  // Eurex Futures: FMIB
  'IT40': ['FTSEMIB', 'MIB', 'ITAMIB', 'ITA40', 'FTMIB', 'FMIB'],

  // Netherlands AEX 25
  // Euronext Futures: FTI
  'NL25': ['AEX', 'AEX25', 'NED25', 'NETHERLANDS25', 'FTI'],

  // Switzerland SMI 20
  // Eurex Futures: FSMI
  'CH20': ['SMI', 'SMI20', 'SWISS20', 'SUI20', 'FSMI'],

  // Hong Kong Hang Seng
  // HKEX Futures: HSI
  'HK50': ['HSI', 'HANGSENG', 'HK33', 'HKIND', 'HSI50', 'MHI'],

  // China A50
  // SGX Futures: CN
  'CN50': ['CHINA50', 'CHINAA50', 'A50', 'FTXIN50', 'CN'],

  // Australia ASX 200
  // ASX Futures: SPI
  'AU200': ['ASX200', 'AUS200', 'XJO', 'AUS', 'SPI'],

  // Japan Nikkei 225
  // CFD: JP225, JPN225, NIKKEI, NIK225
  // CME Futures: NKD (USD), NIY (JPY)
  // SGX Futures: NK
  // OSE/JPX Futures: JNK
  'JP225': ['NIKKEI', 'NI225', 'NIK', 'JP225USD', 'NIKKEI225', 'JPN225', 'NIK225', 'NKY', 'NKD', 'NIY', 'NK', 'JNK'],

  // Gold
  // CFD: GOLD, XAUUSD
  // COMEX Futures: GC (full), MGC (Micro)
  // NOTE: EUR crosses (XAUEUR) excluded - prefer USD pairs
  'GOLD': ['XAUUSD', 'GC', 'MGC', 'GOLD'],

  // Silver
  // CFD: SILVER, XAGUSD
  // COMEX Futures: SI (full), SIL (Micro)
  // NOTE: EUR crosses (XAGEUR) excluded - prefer USD pairs
  'SILVER': ['XAGUSD', 'SI', 'SIL'],

  // Copper
  // CFD: COPPER, XCUUSD
  // COMEX Futures: HG
  'COPPER': ['XCUUSD', 'HG', 'MHG'],

  // Platinum
  // CFD: PLATINUM, XPTUSD
  // NYMEX Futures: PL
  'PLATINUM': ['XPTUSD', 'PL'],

  // Palladium
  // CFD: PALLADIUM, XPDUSD
  // NYMEX Futures: PA
  'PALLADIUM': ['XPDUSD', 'PA'],

  // Oil WTI (West Texas Intermediate)
  // CFD: USOIL, WTI, CRUDEOIL
  // NYMEX/CME Futures: CL (full), MCL (Micro)
  'USOIL': ['CL', 'MCL', 'WTI', 'CRUDEOIL', 'OIL', 'USWTI', 'LCRUDE', 'USWTIZERO', 'OILWTI'],

  // Oil Brent
  // CFD: UKOIL, BRENT
  // ICE Futures: B, BRN
  'UKOIL': ['BRENT', 'B', 'BRN', 'UKBRENT', 'UKBRENTZERO', 'OILBRENT'],

  // Natural Gas
  // CFD: NATGAS
  // NYMEX Futures: NG
  // ICE Futures: GWM
  'NATGAS': ['NG', 'GWM', 'NGAS', 'NATURALGAS', 'GAS', 'NGas'],

  // Euro/USD
  // CME Futures: 6E
  'EURUSD': ['EUR', '6E', 'M6E'],

  // GBP/USD
  // CME Futures: 6B
  'GBPUSD': ['GBP', '6B', 'M6B'],

  // USD/JPY
  // CME Futures: 6J
  'USDJPY': ['JPY', '6J', 'M6J'],

  // AUD/USD
  // CME Futures: 6A
  'AUDUSD': ['AUD', '6A', 'M6A'],

  // USD/CHF
  // CME Futures: 6S
  'USDCHF': ['CHF', '6S', 'M6S'],

  // USD/CAD
  // CME Futures: 6C
  'USDCAD': ['CAD', '6C', 'M6C'],

  // Cocoa
  // ICE Futures: CC
  // TradeSync: Cocoa, CocoaMar26
  'USCC': ['COCOA', 'CC', 'COC', 'Cocoa', 'CocoaMar26'],

  // Orange Juice
  // ICE Futures: OJ
  // TradeSync: OJJan26
  'ORJ': ['OJ', 'ORANGE', 'OJUICE', 'OJJan26'],

  // Coffee (Arabica)
  // ICE Futures: KC
  // TradeSync: Coffee, CoffeeMar26
  'CFA': ['COFFEE', 'KC', 'USCOFFEE', 'ARABICA', 'Coffee', 'CoffeeMar26'],

  // Coffee (Robusta)
  // ICE Futures: RC
  // TradeSync: CoffeeR
  'CFR': ['COFFEER', 'ROBUSTA', 'CoffeeR'],

  // Cotton
  // ICE Futures: CT
  'COTTON': ['CT', 'USCOTTON'],

  // Sugar (Raw)
  // ICE Futures: SB
  // TradeSync: Sugar, SugarMar26
  'SR': ['SUGAR', 'SB', 'USSUGAR', 'Sugar', 'SugarMar26'],

  // Sugar (White)
  'SW': ['SUGARWHITE', 'WHITESUGAR'],

  // Gas Oil (Low Sulphur)
  // ICE Futures: HO
  // TradeSync: Gasol, GasolJan26
  'LSGO': ['GASOIL', 'GASOILJPN', 'Gasol', 'GasolJan26', 'HO'],

  // Wheat
  // CBOT Futures: ZW
  'WHEAT': ['ZW', 'W', 'USWHEAT'],

  // Corn
  // CBOT Futures: ZC
  'CORN': ['ZC', 'C', 'USCORN', 'Corn'],

  // Soybeans
  // CBOT Futures: ZS
  'SOYBEANS': ['ZS', 'S', 'USSOY', 'Soybns', 'Soybn'],

  // VIX Volatility Index
  // CFD: VIX
  // CBOE Futures: VX
  'VIX': ['VIXINDEX', 'USAVIX', 'VOLATILITY', 'VX', 'UVXY', 'VIXX'],

  // USD Index
  // ICE Futures: DX
  'USDX': ['USDIND', 'DXY', 'USDINDEX', 'DX', 'DOLLARINDEX'],

  // Bitcoin
  // CME Futures: BTC
  'BTC': ['BTCUSD', 'BITCOIN', 'XBTUSD'],

  // Ethereum
  // CME Futures: ETH
  'ETH': ['ETHUSD', 'ETHEREUM'],

  // Treasury Bonds
  // CBOT Futures: ZB (30-Year), ZN (10-Year), ZF (5-Year), ZT (2-Year)
  'USBOND': ['ZB', 'US', 'TY', 'USTBOND', 'UsaTB'],
  'OATS': ['ZO', 'O', 'Oats'],
  'USNOTE10': ['ZN', 'TN', 'UST10'],
  'USNOTE5': ['ZF', 'FV', 'UST5'],
  'USNOTE2': ['ZT', 'TU', 'UST2'],
};

/**
 * Default symbol mapper configuration
 * Rules for common futures → perpetual CFD mapping
 */
export const DEFAULT_CONFIG: SymbolMapperConfig = {
  rules: [
    // Nasdaq 100
    {
      masterPatterns: ['UsaTec', 'USTEC', 'NAS100', 'US100', 'USTECH', 'NDX', 'NQ'],
      clientBase: 'NAS100',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // S&P 500
    {
      masterPatterns: ['Usa500', 'US500', 'SPX', 'SP500', 'USA500', 'ES'],
      clientBase: 'SP500',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Dow Jones
    {
      masterPatterns: ['UsaInd', 'DJ30', 'US30', 'DJIA', 'USA30', 'YM', 'DOW'],
      clientBase: 'DJ30',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Russell 2000
    {
      masterPatterns: ['UsaRus', 'US2000', 'USA2000', 'RTY', 'RUT', 'RUSSELL'],
      clientBase: 'US2000',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // German DAX / GER30 CFD
    {
      masterPatterns: ['Ger40', 'GerDax', 'GERDAX', 'GER40', 'GER30', 'DE40', 'DE30'],
      clientBase: 'GER30',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Euro Stoxx 50
    {
      masterPatterns: ['STOXX50', 'EU50', 'EURO50', 'EUROSTOXX', 'SX5E'],
      clientBase: 'STOXX50',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // UK FTSE 100
    {
      masterPatterns: ['UK100', 'FTSE', 'FTSE100', 'UKX'],
      clientBase: 'UK100',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // France CAC 40
    {
      masterPatterns: ['FR40', 'FRA40', 'CAC', 'CAC40'],
      clientBase: 'FR40',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Spain IBEX 35
    {
      masterPatterns: ['Esp35', 'ESP35', 'SPN35', 'IBEX', 'IBEX35', 'ES35'],
      clientBase: 'SPN35',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Japan Nikkei 225
    {
      masterPatterns: ['JP225', 'JPN225', 'NIKKEI', 'NIK', 'NI225'],
      clientBase: 'JP225',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Hong Kong Hang Seng
    {
      masterPatterns: ['HK50', 'HSI', 'HANGSENG', 'HK33'],
      clientBase: 'HK50',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Australia ASX 200
    {
      masterPatterns: ['AU200', 'AUS200', 'ASX200', 'XJO'],
      clientBase: 'AU200',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Gold
    {
      masterPatterns: ['GOLD', 'XAUUSD', 'GC'],
      clientBase: 'GOLD',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Oil WTI
    {
      masterPatterns: ['USOIL', 'WTI', 'CL', 'CRUDEOIL', 'USWTI'],
      clientBase: 'USOIL',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // Oil Brent
    {
      masterPatterns: ['UKOIL', 'BRENT', 'BRN', 'UKBRENT'],
      clientBase: 'UKOIL',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
    // VIX
    {
      masterPatterns: ['UsaVix', 'VIX', 'VIXINDEX', 'VOLATILITY'],
      clientBase: 'VIX',
      fallback: 'map_to_perpetual',
      clientExpiryFormat: 'none',
    },
  ],
  defaultFallback: 'map_to_perpetual',
  aliases: DEFAULT_ALIASES,
};

// ============================================================================
// Symbol Parser
// ============================================================================

/**
 * Parse a symbol string to extract base and expiry
 */
export function parseSymbol(symbol: string): ParsedSymbol {
  const original = symbol;
  let base = symbol;
  let expiry: SymbolExpiry | undefined;
  let style: SymbolStyle = 'unknown';

  // Pattern 1: Dot + expiry (US100.dec25, GER40.mar26) - check first due to specificity
  const dotMatch = symbol.match(/^(.+?)\.([a-z]{3})(\d{2})$/i);
  if (dotMatch) {
    base = dotMatch[1];
    const monthStr = dotMatch[2].toLowerCase();
    const yearStr = dotMatch[3];
    expiry = {
      month: MONTH_NAMES[monthStr] || 0,
      year: 2000 + parseInt(yearStr, 10),
      raw: '.' + dotMatch[2] + dotMatch[3],
    };
    style = 'cfd_dot_expiry';
  }

  // Pattern 2: Titlecase month + 2-digit year (UsaTecDec25, GerDaxMar26, Usa500Mar26)
  // Use .+? (non-greedy any char) to handle alphanumeric bases like Usa500
  const titlecaseMatch = symbol.match(/^(.+?)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{2})$/i);
  if (!expiry && titlecaseMatch) {
    base = titlecaseMatch[1];
    const monthStr = titlecaseMatch[2].toLowerCase();
    const yearStr = titlecaseMatch[3];
    expiry = {
      month: MONTH_NAMES[monthStr] || 0,
      year: 2000 + parseInt(yearStr, 10),
      raw: titlecaseMatch[2] + titlecaseMatch[3],
    };
    style = 'futures_month_year';
  }

  // Pattern 3: CME style (NQZ24, ESH25) - require at least 2 char base
  // Avoids matching DJ30, US30, STOXX50 as futures codes
  const cmeMatch = symbol.match(/^([A-Z]{2,4})([FGHJKMNQUVXZ])(\d{2})$/);
  if (!expiry && cmeMatch) {
    // Additional check: ensure it's not a common index pattern
    const fullSymbol = cmeMatch[1] + cmeMatch[2] + cmeMatch[3];
    // Match patterns like US30, DJ30, UK100, STOXX50, etc.
    const indexPatterns = /^(US|DJ|UK|JP|EU|FR|DE|AU|HK|CN|STOXX|DAX|CAC|FTSE|NIK|NAS|SP)\d{2,4}$/i;
    // Also check if the full symbol looks like a known perpetual
    const knownPerpetuals = ['STOXX50', 'DAX30', 'CAC40', 'FTSE100', 'NAS100', 'SP500'];
    const isIndex = indexPatterns.test(fullSymbol) || knownPerpetuals.includes(fullSymbol.toUpperCase());

    if (!isIndex) {
      base = cmeMatch[1];
      const monthCode = cmeMatch[2].toLowerCase();
      const yearStr = cmeMatch[3];
      expiry = {
        month: FUTURES_MONTH_CODES[monthCode] || 0,
        year: 2000 + parseInt(yearStr, 10),
        raw: cmeMatch[2] + cmeMatch[3],
      };
      style = 'futures_code';
    }
  }

  // Pattern 4: Underscore expiry (US100_DEC25)
  const underscoreMatch = symbol.match(/^(.+?)_([A-Z]{3})(\d{2})$/i);
  if (!expiry && underscoreMatch) {
    base = underscoreMatch[1];
    const monthStr = underscoreMatch[2].toLowerCase();
    const yearStr = underscoreMatch[3];
    expiry = {
      month: MONTH_NAMES[monthStr] || 0,
      year: 2000 + parseInt(yearStr, 10),
      raw: '_' + underscoreMatch[2] + underscoreMatch[3],
    };
    style = 'futures_month_year';
  }

  // No expiry found = perpetual
  if (!expiry) {
    style = 'perpetual';
  }

  return {
    original,
    base: normalizeBase(base),
    expiry,
    isPerpetual: !expiry,
    style,
  };
}

/**
 * Normalize a base symbol (uppercase, remove common suffixes)
 */
function normalizeBase(base: string): string {
  return base
    .toUpperCase()
    .replace(/[-_.]$/, '')  // Remove trailing separators
    .replace(/CFD$/, '')    // Remove CFD suffix
    .replace(/CASH$/, '');  // Remove CASH suffix
}

/**
 * Find the canonical base symbol using aliases
 */
export function findCanonicalBase(base: string, aliases: Record<string, string[]>): string {
  const normalized = normalizeBase(base);

  for (const [canonical, aliasList] of Object.entries(aliases)) {
    // Case-insensitive canonical match
    if (normalizeBase(canonical) === normalized) return normalizeBase(canonical);
    // Check if any alias matches
    if (aliasList.some(a => normalizeBase(a) === normalized)) {
      return normalizeBase(canonical);
    }
  }

  return normalized;
}

// ============================================================================
// Symbol Mapper Class
// ============================================================================

/**
 * Symbol Mapper for intelligent futures/CFD mapping
 *
 * @example
 * ```typescript
 * const mapper = new SymbolMapper(client);
 *
 * // Configure mapping rules
 * mapper.addRule({
 *   masterPatterns: ['UsaTec', 'USTEC'],
 *   clientBase: 'US100',
 *   fallback: 'map_to_perpetual',
 * });
 *
 * // Map a symbol
 * const result = mapper.map('UsaTecDec25', ['US100', 'US100.dec25', 'US100.mar26']);
 * // result.clientSymbol = 'US100' (perpetual, since configured)
 *
 * // Or with exact expiry matching
 * mapper.updateRule('US100', { forcePerpetual: false, clientExpiryFormat: 'lowercase_dot' });
 * const result2 = mapper.map('UsaTecDec25', ['US100', 'US100.dec25']);
 * // result2.clientSymbol = 'US100.dec25'
 * ```
 */
export class SymbolMapper {
  private config: SymbolMapperConfig;
  private client?: TradeSyncClient;

  constructor(client?: TradeSyncClient, config?: Partial<SymbolMapperConfig>) {
    this.client = client;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      rules: [...(config?.rules || DEFAULT_CONFIG.rules)],
      aliases: { ...DEFAULT_ALIASES, ...(config?.aliases || {}) },
    };
  }

  /**
   * Add a mapping rule
   */
  addRule(rule: SymbolMappingRule): void {
    // Check if rule for this client base already exists
    const existingIndex = this.config.rules.findIndex(
      r => r.clientBase === rule.clientBase
    );

    if (existingIndex >= 0) {
      // Merge patterns
      this.config.rules[existingIndex] = {
        ...this.config.rules[existingIndex],
        ...rule,
        masterPatterns: [
          ...new Set([
            ...this.config.rules[existingIndex].masterPatterns,
            ...rule.masterPatterns,
          ]),
        ],
      };
    } else {
      this.config.rules.push(rule);
    }
  }

  /**
   * Update an existing rule by client base
   */
  updateRule(clientBase: string, updates: Partial<SymbolMappingRule>): boolean {
    const rule = this.config.rules.find(r => r.clientBase === clientBase);
    if (rule) {
      Object.assign(rule, updates);
      return true;
    }
    return false;
  }

  /**
   * Add an alias for a base symbol
   */
  addAlias(canonical: string, alias: string): void {
    if (!this.config.aliases[canonical]) {
      this.config.aliases[canonical] = [];
    }
    if (!this.config.aliases[canonical].includes(alias)) {
      this.config.aliases[canonical].push(alias);
    }
  }

  /**
   * Map a master symbol to a client symbol
   *
   * @param masterSymbol - The symbol from master account
   * @param availableClientSymbols - List of symbols available on client broker
   * @returns Mapping result
   */
  map(masterSymbol: string, availableClientSymbols: string[]): MappingResult {
    const parsed = parseSymbol(masterSymbol);
    const canonicalBase = findCanonicalBase(parsed.base, this.config.aliases);

    // Find matching rule
    const rule = this.findRule(parsed.base, canonicalBase);

    if (!rule) {
      // No rule found, try direct matching
      return this.tryDirectMatch(masterSymbol, parsed, availableClientSymbols);
    }

    // Parse available client symbols
    const clientParsed = availableClientSymbols.map(s => ({
      symbol: s,
      parsed: parseSymbol(s),
    }));

    // Filter to matching base symbols
    const matchingBase = clientParsed.filter(c => {
      const clientCanonical = findCanonicalBase(c.parsed.base, this.config.aliases);
      return clientCanonical === findCanonicalBase(rule.clientBase, this.config.aliases);
    });

    if (matchingBase.length === 0) {
      return {
        success: false,
        masterSymbol,
        usedFallback: false,
        error: `No matching client symbols found for base '${rule.clientBase}'`,
      };
    }

    // Force perpetual mapping
    if (rule.forcePerpetual) {
      const perpetual = matchingBase.find(c => c.parsed.isPerpetual);
      if (perpetual) {
        return {
          success: true,
          masterSymbol,
          clientSymbol: perpetual.symbol,
          appliedRule: rule,
          usedFallback: false,
        };
      }
      // Fallback to first available if no perpetual
      return {
        success: true,
        masterSymbol,
        clientSymbol: matchingBase[0].symbol,
        appliedRule: rule,
        usedFallback: true,
        warning: `No perpetual symbol found, using '${matchingBase[0].symbol}'`,
      };
    }

    // Try exact expiry match
    if (parsed.expiry) {
      const exactMatch = matchingBase.find(c =>
        c.parsed.expiry?.month === parsed.expiry?.month &&
        c.parsed.expiry?.year === parsed.expiry?.year
      );

      if (exactMatch) {
        return {
          success: true,
          masterSymbol,
          clientSymbol: exactMatch.symbol,
          appliedRule: rule,
          usedFallback: false,
        };
      }

      // Apply fallback behavior
      return this.applyFallback(masterSymbol, parsed, matchingBase, rule);
    }

    // Master is perpetual, find client perpetual
    const perpetual = matchingBase.find(c => c.parsed.isPerpetual);
    if (perpetual) {
      return {
        success: true,
        masterSymbol,
        clientSymbol: perpetual.symbol,
        appliedRule: rule,
        usedFallback: false,
      };
    }

    // No perpetual, use latest expiry
    return this.applyFallback(masterSymbol, parsed, matchingBase, rule);
  }

  /**
   * Map multiple symbols at once
   */
  mapBatch(
    masterSymbols: string[],
    availableClientSymbols: string[]
  ): Map<string, MappingResult> {
    const results = new Map<string, MappingResult>();

    for (const symbol of masterSymbols) {
      results.set(symbol, this.map(symbol, availableClientSymbols));
    }

    return results;
  }

  /**
   * Discover symbols from accounts via TradeSync API
   */
  async discoverSymbols(accountIds: number[]): Promise<DiscoveredSymbol[]> {
    if (!this.client) {
      throw new Error('TradeSyncClient required for symbol discovery');
    }

    const discovered: DiscoveredSymbol[] = [];

    for (const accountId of accountIds) {
      try {
        // Get account symbols
        const response = await this.client.get<{
          result: string;
          data: Array<{ symbol: string; [key: string]: unknown }>;
        }>(`/accounts/${accountId}/symbols`);

        if (response.data) {
          for (const item of response.data) {
            discovered.push({
              symbol: item.symbol,
              parsed: parseSymbol(item.symbol),
              accountId,
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to get symbols for account ${accountId}:`, error);
      }
    }

    return discovered;
  }

  /**
   * Generate mapping suggestions based on discovered symbols
   */
  suggestMappings(
    masterSymbols: DiscoveredSymbol[],
    clientSymbols: DiscoveredSymbol[]
  ): Array<{
    masterSymbol: string;
    suggestedClientSymbol: string;
    confidence: 'high' | 'medium' | 'low';
    reason: string;
  }> {
    const suggestions: Array<{
      masterSymbol: string;
      suggestedClientSymbol: string;
      confidence: 'high' | 'medium' | 'low';
      reason: string;
    }> = [];

    for (const master of masterSymbols) {
      const masterCanonical = findCanonicalBase(master.parsed.base, this.config.aliases);

      // Find client symbols with same canonical base
      const matches = clientSymbols.filter(c => {
        const clientCanonical = findCanonicalBase(c.parsed.base, this.config.aliases);
        return clientCanonical === masterCanonical;
      });

      if (matches.length === 0) continue;

      // Prefer exact expiry match
      const exactExpiry = matches.find(c =>
        c.parsed.expiry?.month === master.parsed.expiry?.month &&
        c.parsed.expiry?.year === master.parsed.expiry?.year
      );

      if (exactExpiry) {
        suggestions.push({
          masterSymbol: master.symbol,
          suggestedClientSymbol: exactExpiry.symbol,
          confidence: 'high',
          reason: 'Exact expiry match',
        });
        continue;
      }

      // Prefer perpetual for futures
      const perpetual = matches.find(c => c.parsed.isPerpetual);
      if (perpetual) {
        suggestions.push({
          masterSymbol: master.symbol,
          suggestedClientSymbol: perpetual.symbol,
          confidence: master.parsed.expiry ? 'medium' : 'high',
          reason: master.parsed.expiry
            ? 'Perpetual fallback (no matching contract)'
            : 'Perpetual to perpetual',
        });
        continue;
      }

      // Use latest expiry
      const sorted = matches
        .filter(c => c.parsed.expiry)
        .sort((a, b) => {
          const aDate = (a.parsed.expiry!.year * 12) + a.parsed.expiry!.month;
          const bDate = (b.parsed.expiry!.year * 12) + b.parsed.expiry!.month;
          return bDate - aDate;
        });

      if (sorted.length > 0) {
        suggestions.push({
          masterSymbol: master.symbol,
          suggestedClientSymbol: sorted[0].symbol,
          confidence: 'low',
          reason: 'Latest available expiry',
        });
      }
    }

    return suggestions;
  }

  /**
   * Get current configuration
   */
  getConfig(): SymbolMapperConfig {
    return { ...this.config };
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(json: string): void {
    const imported = JSON.parse(json) as SymbolMapperConfig;
    this.config = {
      ...imported,
      aliases: { ...DEFAULT_ALIASES, ...imported.aliases },
    };
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private findRule(base: string, canonicalBase: string): SymbolMappingRule | undefined {
    return this.config.rules.find(rule => {
      return rule.masterPatterns.some(pattern => {
        const normalizedPattern = normalizeBase(pattern);
        return (
          normalizedPattern === normalizeBase(base) ||
          normalizedPattern === canonicalBase ||
          new RegExp(`^${pattern}`, 'i').test(base)
        );
      });
    });
  }

  private tryDirectMatch(
    masterSymbol: string,
    parsed: ParsedSymbol,
    availableClientSymbols: string[]
  ): MappingResult {
    // Try exact match first
    if (availableClientSymbols.includes(masterSymbol)) {
      return {
        success: true,
        masterSymbol,
        clientSymbol: masterSymbol,
        usedFallback: false,
      };
    }

    // Try case-insensitive match
    const caseMatch = availableClientSymbols.find(
      s => s.toLowerCase() === masterSymbol.toLowerCase()
    );
    if (caseMatch) {
      return {
        success: true,
        masterSymbol,
        clientSymbol: caseMatch,
        usedFallback: false,
      };
    }

    // Try matching canonical base
    const canonicalBase = findCanonicalBase(parsed.base, this.config.aliases);
    const baseMatches = availableClientSymbols.filter(s => {
      const clientParsed = parseSymbol(s);
      const clientCanonical = findCanonicalBase(clientParsed.base, this.config.aliases);
      return clientCanonical === canonicalBase;
    });

    if (baseMatches.length > 0) {
      // Found base match, return first perpetual or first match
      const clientParsed = baseMatches.map(s => ({ symbol: s, parsed: parseSymbol(s) }));
      const perpetual = clientParsed.find(c => c.parsed.isPerpetual);

      return {
        success: true,
        masterSymbol,
        clientSymbol: perpetual?.symbol || baseMatches[0],
        usedFallback: true,
        warning: `No exact match, mapped via base symbol '${canonicalBase}'`,
      };
    }

    return {
      success: false,
      masterSymbol,
      usedFallback: false,
      error: `No matching symbol found for '${masterSymbol}'`,
    };
  }

  private mapToLatestOrFirst(
    masterSymbol: string,
    matchingBase: Array<{ symbol: string; parsed: ParsedSymbol }>,
    rule: SymbolMappingRule
  ): MappingResult {
    const sorted = matchingBase
      .filter(c => c.parsed.expiry)
      .sort((a, b) => {
        const aDate = (a.parsed.expiry!.year * 12) + a.parsed.expiry!.month;
        const bDate = (b.parsed.expiry!.year * 12) + b.parsed.expiry!.month;
        return bDate - aDate;
      });

    if (sorted.length > 0) {
      return {
        success: true,
        masterSymbol,
        clientSymbol: sorted[0].symbol,
        appliedRule: rule,
        usedFallback: true,
        warning: `No matching contract, mapped to latest '${sorted[0].symbol}'`,
      };
    }

    // Use first available
    return {
      success: true,
      masterSymbol,
      clientSymbol: matchingBase[0].symbol,
      appliedRule: rule,
      usedFallback: true,
      warning: `No matching contract, mapped to '${matchingBase[0].symbol}'`,
    };
  }

  private applyFallback(
    masterSymbol: string,
    _parsed: ParsedSymbol,
    matchingBase: Array<{ symbol: string; parsed: ParsedSymbol }>,
    rule: SymbolMappingRule
  ): MappingResult {
    const fallback = rule.fallback || this.config.defaultFallback;

    switch (fallback) {
      case 'map_to_perpetual': {
        const perpetual = matchingBase.find(c => c.parsed.isPerpetual);
        if (perpetual) {
          return {
            success: true,
            masterSymbol,
            clientSymbol: perpetual.symbol,
            appliedRule: rule,
            usedFallback: true,
            warning: `No matching contract, mapped to perpetual '${perpetual.symbol}'`,
          };
        }
        // No perpetual found, fall back to latest expiry
        return this.mapToLatestOrFirst(masterSymbol, matchingBase, rule);
      }

      case 'map_to_latest_expiry':
        return this.mapToLatestOrFirst(masterSymbol, matchingBase, rule);

      case 'skip_and_warn':
        return {
          success: false,
          masterSymbol,
          appliedRule: rule,
          usedFallback: true,
          warning: `No matching contract for '${masterSymbol}', skipped per configuration`,
        };

      case 'error':
        return {
          success: false,
          masterSymbol,
          appliedRule: rule,
          usedFallback: false,
          error: `No matching contract for '${masterSymbol}'`,
        };

      default:
        return {
          success: false,
          masterSymbol,
          usedFallback: false,
          error: `Unknown fallback behavior: ${fallback}`,
        };
    }
  }
}

/**
 * Create a symbol mapper instance
 */
export function createSymbolMapper(
  client?: TradeSyncClient,
  config?: Partial<SymbolMapperConfig>
): SymbolMapper {
  return new SymbolMapper(client, config);
}

/**
 * Format expiry for a specific style
 */
export function formatExpiry(expiry: SymbolExpiry, format: SymbolMappingRule['clientExpiryFormat']): string {
  const year2d = expiry.year % 100;
  const monthName = MONTH_TO_NAME[expiry.month] || 'Jan';

  switch (format) {
    case 'lowercase_dot':
      return `.${monthName.toLowerCase()}${year2d.toString().padStart(2, '0')}`;
    case 'titlecase':
      return `${monthName}${year2d.toString().padStart(2, '0')}`;
    case 'uppercase':
      return `${monthName.toUpperCase()}${year2d.toString().padStart(2, '0')}`;
    case 'none':
    default:
      return '';
  }
}
