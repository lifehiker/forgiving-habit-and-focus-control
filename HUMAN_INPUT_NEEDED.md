# HUMAN INPUT NEEDED

The app runs locally without external credentials. The following items are only needed to enable the live third-party integrations described in the PRD.

## Google sign-in

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- A production OAuth callback URL that matches the deployed domain

## Stripe billing

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_YEARLY`

## Email delivery

- `RESEND_API_KEY`
- A verified Resend sending domain / sender identity

## Production app configuration

- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL` if you want a separate public base URL value
- `AUTH_SECRET`
- `RESTART_NUDGE_SECRET` if the scheduled restart-nudge route should require a shared secret

## Local environment note

- Docker is installed here, but this session cannot access the Docker daemon socket, so `docker build .` could not be run to completion from this environment.
