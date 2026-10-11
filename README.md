TRY LANG

# Weather Window

Weather Window is a responsive weather forecast site built with React, TypeScript, and Vite. It uses Open-Meteo for live worldwide forecasts and location search, so local development needs no API key.

## Features

- Current temperature, condition, feels-like temperature, wind, and humidity
- Interactive 24-hour temperature and precipitation trace
- Seven-day forecast with daily range and rain probability
- Worldwide place search
- Browser geolocation
- Celsius and Fahrenheit switching
- Condition-responsive color themes
- Loading, empty-search, geolocation-denied, and network-error handling
- Keyboard-accessible hourly slider, visible focus, and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

The browser smoke test uses the installed Chrome browser:

```bash
node scripts/capture.mjs
```

It checks the live page, location search, unit switching, row counts, browser errors, and desktop/mobile overflow. Screenshots are written to `.impeccable/review/`.

## Deploy to Vercel

Import the project into Vercel and keep the detected Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

No environment variables are required for the Open-Meteo endpoints used by this version.

## Data source

Forecast and geocoding data come from Open-Meteo. The interface includes source attribution in the footer.

## Production scope

This version has no accounts, saved locations, severe-weather alerts, analytics, or server-side persistence. Browser geolocation depends on user permission and a secure context when deployed.
