# Forgiving Habit and Focus Control

Recovery-first habit tracking plus commitment-mode focus sessions with a local Chrome extension scaffold.

## Local development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Product notes

- No `next/font/google` usage. Typography relies on system/CSS fonts for build reliability.
- Auth, billing, and email have safe local fallbacks so the app works without external credentials.
- App data is stored in `data/app-data.json` for local MVP persistence.
- The Chrome extension scaffold lives in `extension/`.

## Deploy

The project is configured for standalone output and includes a production Dockerfile:

```bash
docker build .
```
