# Orbi — backend

Backend for a Web3 social product: **hybrid auth**, **off-chain graph/feed**, **decentralized storage for media**, **on-chain only where trustlessness matters**, and **moderation from day one**.

## Product principles (locked)

> For most teams, the best balance is: hybrid auth (email/OAuth + linked wallet), off-chain social graph and feed in a normal database behind your API, IPFS/Arweave for large media with hashes, and on-chain only for money, ownership, or rules that truly need trustlessness—plus serious anti-spam/moderation from day one, because that’s what kills Web3 social products, not picking the wrong chain.
>
> If you optimize for pure decentralization over growth, flip toward wallet-only + on-chain identity/reputation and accept worse onboarding and recovery; if you optimize for shipping and retention, the hybrid model above is the practical “best.”

See **`docs/ARCHITECTURE.md`** for how this repo maps those ideas to code paths and services.

## Stack

- **Runtime**: Node.js + TypeScript  
- **API**: Express (swap for Fastify/Hono if you prefer)  
- **DB**: PostgreSQL via Prisma  
- **Next steps you wire in**: OAuth (e.g. Auth.js / Clerk / Supabase Auth), wallet verify (SIWE / CAIP), IPFS (Pinata / NFT.Storage), chain RPC + contracts for tips/ownership only  

## Quick start

```bash
cd "/Users/praval/Desktop/Orbi backend"
cp .env.example .env
docker compose up -d postgres
# .env.example DATABASE_URL matches docker-compose defaults

npm install
npx prisma generate
npx prisma migrate dev --name init

npm run dev
```

Health check: `GET http://localhost:3000/health`

## Folder layout

| Path | Role |
|------|------|
| `src/routes/` | HTTP routes; thin — delegate to services |
| `src/services/` | Auth, feed, media (IPFS), moderation |
| `src/contracts/` | Optional on-chain clients (tips, NFT gates) — add when needed |
| `prisma/` | Schema = source of truth for off-chain data |
