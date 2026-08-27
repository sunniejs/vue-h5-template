# State Management

## Pinia: Client State

Use Pinia for auth sessions, themes, feature flags, and local preferences owned by the browser. The `user` store keeps the short-lived example token and exposes `login/logout`.

## TanStack Query: Server State

Use TanStack Query for remote caching, loading/error state, retries, cancellation, mutations, pagination, and infinite queries. Global defaults are:

- 30-second `staleTime`;
- 5-minute `gcTime`;
- at most two retries for network/5xx failures;
- no retry for 4xx;
- Query Functions forward `AbortSignal`.

`/examples/query` demonstrates a task query, toggle mutation, and cursor infinite query. Mutations update Query Cache instead of duplicating data in Pinia.

## Local and Streaming State

Form values stay inside components. `useStreamingChat` owns AI conversation state because its lifecycle is tied to the provider and AbortController. Do not copy it into Pinia or Query Cache unless the product adds explicit cross-session persistence.
