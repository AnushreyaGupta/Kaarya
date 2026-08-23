# OpportuNet

Vite/React frontend plus a TypeScript Express REST API backed by PostgreSQL and Prisma.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
2. Run `npm install`, `npm run prisma:generate`, and `npm run prisma:migrate -- --name init`.
3. Run `npm run dev` for the frontend and `npm run dev:api` for the API.

## API highlights

JWT auth and RBAC protect the student, employer, mentor, placement-cell, and admin flows. Core endpoints include `/api/auth`, `/api/opportunities`, `/api/opportunities/:id/apply`, `/api/applications`, `/api/notifications`, and public `/api/certificates/verify/:certificateId`.

Application transitions are enforced server-side and each transition records status history, notifications, and an audit record. The Prisma schema provides the normalized foundation for profiles, skills, opportunities, documents, interviews, certificates, placements, mentor requests, recommendations, and audit logs.
