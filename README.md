# Fenix Life

Premium life and business simulation — build a career, company, family, and legacy in a living world.

## Quick start (local)

```powershell
# 1. Copy environment file and add your Neon DATABASE_URL
copy .env.example .env

# 2. Install & run frontend
npm install
npm run dev

# 3. Install & run API (separate terminal)
cd api
npm install
npm run db:generate
npm run db:push
npm run dev
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
├── src/           # React + Vite game UI
├── api/           # Express API (auth, saves)
├── prisma/        # Database schema
├── docs/          # Full design documentation (00–41)
└── prd/           # Product Bible
```

## Documentation

Start with [docs/39_Project_Master_Index.md](docs/39_Project_Master_Index.md) for the full doc registry.
