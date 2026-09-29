# OpportuNet

OpportuNet combines a React/Vite portal with an Express API and Prisma-backed SQLite database. The same Express service serves the built frontend and `/api` endpoints, so deployed browser requests stay on the same origin.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`; set a private `JWT_SECRET` for any shared environment.
3. Run `npm run prisma:generate`, then `npm run db:deploy`.
4. Start the API with `npm run dev:api` and the frontend with `npm run dev` in separate terminals.

The local API uses `http://localhost:4000`; Vite proxies `/api` requests to it. Local SQLite data is stored in `dev.db`.

## Deploy on Render

The included `render.yaml` creates one web service, builds the Vite app, deploys the Prisma schema, and starts Express. It provisions a persistent disk at `/var/data`, stores SQLite there, generates `JWT_SECRET`, and uses `/health` as the health check. Deploy from the repository root and keep the disk attached to preserve user data.

For another host, build with `npm ci && npm run prisma:generate && npm run build`, then start with `npm run db:deploy && npm start`. Set `NODE_ENV=production`, a persistent SQLite `DATABASE_URL`, and a long random `JWT_SECRET`; the host must provide durable storage for the database file.

## API

JWT auth and RBAC protect student, employer, mentor, placement-cell, and admin flows. Core endpoints include `/api/auth`, `/api/opportunities`, `/api/applications`, `/api/notifications`, and public `/api/certificates/verify/:certificateId`.
