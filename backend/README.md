# DynaPrice backend realtime module

This NestJS backend adds a Socket.io-powered realtime module for price change notifications.

## Event payload

`price.changed` events include:

- `productId`
- `sellerId`
- `categoryId`
- `oldPrice`
- `newPrice`
- `changedAt`
- `source` (`formula` or `ml`)

## Room patterns

Clients subscribe by emitting a `subscribe` message to the `/realtime` namespace with:

```json
{ "scope": "seller", "value": "seller-123" }
```

Supported scopes:

- `seller` → `seller:<sellerId>`
- `category` → `category:<categoryId>`
- `product` → `product:<productId>`

When a price changes, the server emits the same `price.changed` payload to all three relevant rooms so dashboards can subscribe narrowly without receiving unrelated updates.

## Price publishing flow

`PricingService.handleComputedPrice()` compares the previous computed price with the new computed price. If the value changed, it publishes a realtime event using `RealtimeService`.
