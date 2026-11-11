# Vmax: mobile app
Vmax is an Expo (React Native) mobile app.

Track daily spending in Ringgit, set savings goals, and let Vmax split what you can save each day across them.

This is the app part of the Vmax monorepo. **Setup and run instructions are in the [main README](../README.md).** From the repo root, `npm run dev` starts this app together with the API in [`server/`](../server).

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
