# Vmax

Track daily spending in Ringgit, set savings goals, and let Vmax split what you can save each day across them. Save with friends using group goals.

| Folder | What it is |
|---|---|
| [`mobile/`](mobile) | The app: Expo / React Native (Android, iOS, web) |
| [`server/`](server) | The API: Express + TypeScript + PostgreSQL |

## Requirements
- [Node.js](https://nodejs.org) 20+
- [PostgreSQL](https://www.postgresql.org/download/) 14+
- To view the app, one of: an Android emulator (Android Studio), the Expo Go app on your phone, or a web browser

## First-time setup

1. **Install packages** (both folders):
   ```bash
   npm run setup
   ```

2. **Create a database.** Run this once (it asks for your PostgreSQL `postgres` password):
   ```bash
   psql -U postgres -h localhost -c "CREATE ROLE vmax LOGIN PASSWORD 'change-me';" -c "CREATE DATABASE vmax OWNER vmax;"
   ```

3. **Configure.**
   - Copy `server/.env.example` to `server/.env`. Fill in the database details from step 2 and set `JWT_SECRET` to a long random string.
   - Copy `mobile/.env.example` to `mobile/.env`. The default URL works for the Android emulator; see the file for phone and web URLs.

4. **Create the tables and a demo account:**
   ```bash
   npm run db:seed
   ```
   Demo login: `demo@vmax.app` / `VmaxDemo2026`

## Run

```bash
npm run dev
```

This starts the API (`http://localhost:3000`, logs prefixed `[server]`) and the Expo dev server together. Press `a` to open Android, `w` for web, or scan the QR code with Expo Go. `Ctrl+C` stops both.

To run one side only, use `npm run server` or `npm run mobile`.

## Troubleshooting
- **Login spins or fails:** check the `[server]` logs, and that `EXPO_PUBLIC_BACKEND_API_URL` in `mobile/.env` matches where the app runs (emulator: `http://10.0.2.2:3000`).
- **`Missing JWT_SECRET`:** add it to `server/.env` (step 3).
- **Database connection errors:** for a local PostgreSQL keep `PG_SSL=false` in `server/.env`.

## Team
Built by Man Ning ([@ManNing1203](https://github.com/ManNing1203)), Lucas ([@LucasLim5234](https://github.com/LucasLim5234)) and [@john90921](https://github.com/john90921). Commit history from the original `Vmax` and `vmax-server` repos is preserved here.
