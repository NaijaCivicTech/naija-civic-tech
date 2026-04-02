# Database (MongoDB)

## Goal

Persist projects, pipeline state, votes, submissions, ideas, and team/invite data instead of in-memory seed data.

## Non-goals (for first slice)

- Full analytics warehouse or complex reporting.
- Choosing ORM vs driver is an implementation detail; document the chosen approach here when decided.

## User stories

- As a visitor, I see listings and pipeline data that match what is stored in the database.
- As the team, we can back up and restore or migrate data without rewriting the whole app.

## Technical notes

- **Driver:** Official `mongodb` package; connection helper in `lib/mongodb.ts` (lazy connect so builds work without `MONGODB_URI` until an API route runs).
- **Collections (current):** `projects` (full `CivicProject` document + numeric `id` + unique `slug`); `counters` (`_id: "projectId"`, `value` = last issued id for new rows).
- **API:** `GET/POST /api/projects`, `POST /api/projects/[id]/vote`, `POST /api/projects/[id]/team`.
- **Seed:** `npm run db:seed` (reads `.env.local`; skips if `projects` is non-empty). See `.env.example`.
- **Environment:** `MONGODB_URI`, optional `MONGODB_DB` (default `naija_civic_tech`).
- **Next:** All DB access from Route Handlers only.

## Dependencies

- Blocks or overlaps: [authentication-nextauth.md](./authentication-nextauth.md) (session user id for votes and ownership).

## Definition of done

- [x] Seed path from `INITIAL_PROJECTS` via `npm run db:seed`.
- [x] Read path for directory + pipeline + home stats uses DB (`GET /api/projects`).
- [x] Writes persisted: new listing/idea, vote delta, team member push.
- [ ] Connection/health documented in root README or ops doc (optional follow-up).
