# Vmax - React Native Frontend
Vmax is an Expo (React Native) mobile app.

Track daily spending in Ringgit, set savings goals, and let Vmax split what you can save each day across them.

The app needs the **Vmax backend** ([vmax-server](https://github.com/john90921/vmax-server)) and a PostgreSQL database. Set the backend up first by following its README.

## Prerequisites
- Node.js 20+
- PostgreSQL (for the backend)
- One of: an Android emulator (Android Studio), the Expo Go app on your phone, or a web browser

## 1. Start the backend
In the `vmax-server` folder (see its README for first-time setup):
```bash
npm install
npm run db:seed   # first time only: creates tables + demo account
npm run dev       # API on http://localhost:3000
```
Demo login: `demo@vmax.app` / `VmaxDemo2026`

## 2. Install and configure the app
```bash
npm install
```
Copy `.env.example` to `.env` and set `EXPO_PUBLIC_BACKEND_API_URL`:

| Where the app runs | URL |
|---|---|
| Android emulator | `http://10.0.2.2:3000` |
| Phone with Expo Go (same Wi-Fi) | `http://<your computer's LAN IP>:3000` |
| Web / iOS simulator | `http://localhost:3000` |

Restart Expo after changing `.env`.

## 3. Run the app
```bash
npx expo start
```
Then press `a` for Android, `w` for web, or scan the QR code with Expo Go.

**Troubleshooting**
- *Login spins or fails:* make sure the backend is running and the URL in `.env` matches the table above.
- *`npm run dev` says it can't find `package.json`:* run it inside the `vmax-server` folder, not `htdocs`.

## AI Tools
The following AI tools are integrated or used in this project:
- **ChatGPT**
- **DeepSeek API**
- **Claude**

## Project Structure

### `/app` - Routes & Pages
The main application structure using Expo Router for file-based routing.

### `/assets` - Static Resources
Images, icons, and other static assets used throughout the app.

### `/components` - Reusable UI Components
Modular, reusable React Native components used across screens.

### `/constants` - App Configuration
Global constants and configuration values.

### `/contexts` - React Context Providers
Global state management and context providers.

### `/hooks` - Custom React Hooks
Custom hooks for reusable logic.

### `/services` - API & External Services
API client and external service integrations.
