# Vmax: server

Part of the Vmax monorepo. For the quickest start, follow the [main README](../README.md); `npm run dev` at the repo root runs this API and the app together.

Express + TypeScript API for the Vmax app in [`mobile/`](../mobile), backed by PostgreSQL.

## Requirements
- Node.js 20+
- PostgreSQL 14+ (local install or a hosted database)

## Setup

1. **Install packages**
   ```bash
   npm install
   ```

2. **Create a database and login.** With a local PostgreSQL, run this once (it asks for your `postgres` password):
   ```bash
   psql -U postgres -h localhost -c "CREATE ROLE vmax LOGIN PASSWORD 'change-me';" -c "CREATE DATABASE vmax OWNER vmax;"
   ```

3. **Configure.** Copy `.env.example` to `.env` and fill it in. For a local database keep `PG_SSL=false`, and set `JWT_SECRET` to a long random string.

4. **Create the tables** (add the demo data too if you want it):
   ```bash
   npm run db:setup   # tables only
   npm run db:seed    # tables + demo account
   ```
   Demo login: `demo@vmax.app` / `VmaxDemo2026`

5. **Run**
   ```bash
   npm run dev
   ```
   The API listens on `http://localhost:3000` (or `PORT`).

## API
| Route | Purpose |
|---|---|
| `POST /user/register`, `POST /user/login` | Accounts; login returns a token to send as the `Authorization` header |
| `GET /goal`, `POST /goal/addGoal` | Savings goals |
| `GET /expense`, `POST /expense/addExpense`, `POST /expense/scanExpensePic` | Expenses, including receipt scanning (OCR + DeepSeek) |
| `GET /saving/getMonthlyIncome`, `POST /saving/setMonthlyIncome` | Salary / income |

## Notes
- Receipt scanning and AI advice need `DEEPSEEK_API_KEY`. Everything else works without it.
- The schema lives in `db/schema.sql`.
