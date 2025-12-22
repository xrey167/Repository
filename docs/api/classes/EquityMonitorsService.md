[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / EquityMonitorsService

# Class: EquityMonitorsService

Defined in: src/services/equity-monitors.ts:113

Equity Monitors API service

## Constructors

### Constructor

> **new EquityMonitorsService**(`client`): `EquityMonitorsService`

Defined in: src/services/equity-monitors.ts:114

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`EquityMonitorsService`

## Methods

### create()

> **create**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`EquityMonitor`](../interfaces/EquityMonitor.md)\>\>

Defined in: src/services/equity-monitors.ts:146

Create an equity monitor

#### Parameters

##### input

[`CreateEquityMonitorInput`](../interfaces/CreateEquityMonitorInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`EquityMonitor`](../interfaces/EquityMonitor.md)\>\>

#### Example

```typescript
// Target value monitor - alerts when equity reaches $10,000
const response = await sdk.equityMonitors.create({
  account_id: 12345,
  type: 'target_value',
  value: 10000,
  action: 'alert'
});

// Protect percentage - disables copiers when equity drops 10%
const response = await sdk.equityMonitors.create({
  account_id: 12345,
  type: 'protect_percentage',
  value: 10,
  action: 'alert_disable_copiers'
});

// Protect value - closes trades when equity falls below $5,000
const response = await sdk.equityMonitors.create({
  account_id: 12345,
  type: 'protect_value',
  value: 5000,
  action: 'alert_disable_copiers_close_trades'
});
```

***

### cancel()

> **cancel**(`monitorId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`EquityMonitor`](../interfaces/EquityMonitor.md)\>\>

Defined in: src/services/equity-monitors.ts:169

Cancel an equity monitor

Note: Only the status can be modified; other attributes are immutable.

#### Parameters

##### monitorId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`EquityMonitor`](../interfaces/EquityMonitor.md)\>\>

#### Example

```typescript
const response = await sdk.equityMonitors.cancel(123456);
console.log(response.data.status); // 'cancelled'
```
