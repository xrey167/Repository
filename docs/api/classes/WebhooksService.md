[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / WebhooksService

# Class: WebhooksService

Defined in: src/services/webhooks.ts:170

Webhooks API service

## Constructors

### Constructor

> **new WebhooksService**(`client`): `WebhooksService`

Defined in: src/services/webhooks.ts:171

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`WebhooksService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

Defined in: src/services/webhooks.ts:182

List all webhooks

#### Parameters

##### filters?

[`WebhookListFilters`](../interfaces/WebhookListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

#### Example

```typescript
const response = await sdk.webhooks.list();
console.log(response.data); // Array of webhooks
```

***

### get()

> **get**(`webhookId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

Defined in: src/services/webhooks.ts:205

Get a single webhook by ID

#### Parameters

##### webhookId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

#### Example

```typescript
const response = await sdk.webhooks.get(12345);
console.log(response.data.url);
```

***

### create()

> **create**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

Defined in: src/services/webhooks.ts:244

Create a new webhook

#### Parameters

##### input

[`CreateWebhookInput`](../type-aliases/CreateWebhookInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

#### Example

```typescript
// No authentication
const response = await sdk.webhooks.create({
  url: 'https://example.com/webhook',
  authentication: 'none'
});

// Basic auth
const response = await sdk.webhooks.create({
  url: 'https://example.com/webhook',
  authentication: 'basic_auth',
  username: 'user',
  password: 'pass'
});

// Bearer token
const response = await sdk.webhooks.create({
  url: 'https://example.com/webhook',
  authentication: 'bearer_token',
  token: 'your-token'
});

// API key
const response = await sdk.webhooks.create({
  url: 'https://example.com/webhook',
  authentication: 'api_key',
  key: 'X-API-Key',
  value: 'your-key'
});
```

***

### update()

> **update**(`webhookId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

Defined in: src/services/webhooks.ts:266

Update a webhook

Note: Both url and authentication must be provided.

#### Parameters

##### webhookId

`number`

##### input

[`CreateWebhookInput`](../type-aliases/CreateWebhookInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Webhook`](../interfaces/Webhook.md)\>\>

#### Example

```typescript
const response = await sdk.webhooks.update(12345, {
  url: 'https://new-url.com/webhook',
  authentication: 'bearer_token',
  token: 'new-token'
});
```

***

### delete()

> **delete**(`webhookId`, `options?`): `Promise`\<`void`\>

Defined in: src/services/webhooks.ts:287

Delete a webhook

#### Parameters

##### webhookId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await sdk.webhooks.delete(12345);
```
