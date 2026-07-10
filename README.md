# Fenix Life

Premium life and business simulation — build a career, company, family, and legacy in a living world.

## Quick start (local)

```powershell
# 1. Copy environment file and add your Neon DATABASE_URL
copy .env.example .env

# 2. Install dependencies (monorepo root)
npm install

# 3. Push database schema
npm run db:push

# 4. Run game client + API (separate terminals)
npm run dev:client
npm run dev:api
```

- **Game:** http://localhost:5173  
- **API:** http://localhost:3001/health  

## Host online (free)

See **[docs/SETUP_FREE_TIER.md](docs/SETUP_FREE_TIER.md)** for step-by-step setup:

| Service | Purpose |
|---|---|
| [Neon](https://neon.tech) | PostgreSQL database |
| [Render](https://render.com) | API backend |
| [Vercel](https://vercel.com) | Frontend hosting |
| [GitHub](https://github.com/Themba-Sithole/Fenix-Life) | Source code |

## Project structure

```
fenix-life/
├── apps/
│   ├── client/    # React + Vite game UI
│   └── api/       # Express API (auth, saves)
├── packages/
│   └── domain/    # Shared domain types (Money, WorldInstance, …)
├── prisma/        # Database schema
├── docs/          # Full design documentation (00–42)
└── prd/           # Product Bible
```

Monorepo uses **npm workspaces + Turborepo** (see `docs/28_Project_Architecture.md`).

## Documentation

Start with [docs/39_Project_Master_Index.md](docs/39_Project_Master_Index.md) for the full doc registry.

Official build kickoff: [docs/BUILD_KICKOFF_PROMPT.md](docs/BUILD_KICKOFF_PROMPT.md)
