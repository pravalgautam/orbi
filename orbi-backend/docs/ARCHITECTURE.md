# Architecture

## Lanes

1. **Hybrid auth**  
   - Email/OAuth session (JWT or cookie session) owned by your API.  
   - **Linked wallets** stored in `Wallet` rows; login “prove wallet” via signed message (SIWE pattern) before `verifiedAt` is set.  
   - Nothing here implies custody of user keys.

2. **Off-chain social graph & feed**  
   - `User`, `Follow`, `Post` in PostgreSQL — fast queries, pagination, ranking.  
   - Optional: emit chain events later for composability; index with a worker or subgraph if needed.

3. **Media**  
   - Upload → object storage or IPFS provider → store **`cid`** + **`contentHash`** on `Post` / `Media`.  
   - API returns URLs or gateway URLs; clients verify hash if you need integrity.

4. **On-chain (later, minimal)**  
   - Only for tips, subscriptions, provenance, or access control.  
   - Keep in `src/contracts/` with explicit ABIs — no chain calls from random route handlers.

5. **Moderation & spam**  
   - `ModerationService`: rate limits, report queue, block lists, text/URL checks.  
   - Enforced in write paths (`createPost`, `createComment`) before persistence.

## Request flow (example)

```
Client → API (auth middleware) → route → service → Prisma / IPFS / (optional) chain
```

## What this repo does *not* do yet

- OAuth providers and SIWE verification (interfaces + stubs only).  
- IPFS pinning (placeholder service).  
- Smart contracts (folder reserved).

Add them incrementally without rewriting the core model.
