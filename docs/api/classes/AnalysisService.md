[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / AnalysisService

# Class: AnalysisService

Defined in: src/services/analysis.ts:138

Analysis API service

## Constructors

### Constructor

> **new AnalysisService**(`client`): `AnalysisService`

Defined in: src/services/analysis.ts:139

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`AnalysisService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Analysis`](../interfaces/Analysis.md)\>\>

Defined in: src/services/analysis.ts:150

List analyses for all accounts

#### Parameters

##### filters?

[`AnalysisListFilters`](../interfaces/AnalysisListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Analysis`](../interfaces/Analysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.list();
console.log(response.data); // Array of analyses
```

***

### get()

> **get**(`accountId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Analysis`](../interfaces/Analysis.md)\>\>

Defined in: src/services/analysis.ts:173

Get analysis for a single account

#### Parameters

##### accountId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Analysis`](../interfaces/Analysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.get(12345);
console.log(response.data.profit_loss);
```

***

### getDailies()

> **getDailies**(`accountId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`DailyAnalysis`](../interfaces/DailyAnalysis.md)\>\>

Defined in: src/services/analysis.ts:193

Get daily analysis for an account

#### Parameters

##### accountId

`number`

##### filters?

[`TimeAnalysisFilters`](../interfaces/TimeAnalysisFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`DailyAnalysis`](../interfaces/DailyAnalysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.getDailies(12345, {
  start_date: '2024-01-01',
  end_date: '2024-12-31'
});
console.log(response.data); // Array of daily analyses
```

***

### getMonthlies()

> **getMonthlies**(`accountId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`MonthlyAnalysis`](../interfaces/MonthlyAnalysis.md)\>\>

Defined in: src/services/analysis.ts:221

Get monthly analysis for an account

#### Parameters

##### accountId

`number`

##### filters?

[`TimeAnalysisFilters`](../interfaces/TimeAnalysisFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`MonthlyAnalysis`](../interfaces/MonthlyAnalysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.getMonthlies(12345);
console.log(response.data); // Array of monthly analyses
```

***

### getMonthlySymbols()

> **getMonthlySymbols**(`accountId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`MonthlySymbolAnalysis`](../interfaces/MonthlySymbolAnalysis.md)\>\>

Defined in: src/services/analysis.ts:249

Get monthly symbol analysis for an account

#### Parameters

##### accountId

`number`

##### filters?

[`TimeAnalysisFilters`](../interfaces/TimeAnalysisFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`MonthlySymbolAnalysis`](../interfaces/MonthlySymbolAnalysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.getMonthlySymbols(12345);
console.log(response.data); // Array of monthly symbol analyses
```

***

### getHourlies()

> **getHourlies**(`accountId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`HourlyAnalysis`](../interfaces/HourlyAnalysis.md)\>\>

Defined in: src/services/analysis.ts:277

Get hourly analysis for an account

#### Parameters

##### accountId

`number`

##### filters?

[`TimeAnalysisFilters`](../interfaces/TimeAnalysisFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`HourlyAnalysis`](../interfaces/HourlyAnalysis.md)\>\>

#### Example

```typescript
const response = await sdk.analysis.getHourlies(12345);
console.log(response.data); // Array of hourly analyses
```
