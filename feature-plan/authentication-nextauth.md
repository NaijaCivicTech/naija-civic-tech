# Authentication (NextAuth)

## Goal

Signed-in users can vote with persistence and see **their** project submissions; anonymous users have read-only (or limited) access as you define.

## Non-goals (for first slice)

- Every possible OAuth provider; start with one or two you will maintain (e.g. GitHub + Google).

## User stories

- As a user, I sign in and my votes are tied to my account and survive refresh and new devices.
- As a user, I can see submissions I created (dashboard or profile section; product decision).
- As a user, I cannot impersonate another user’s votes or submissions.

## Technical notes

- **NextAuth (Auth.js)** with adapter if using MongoDB for sessions/users (or separate session strategy; document choice).
- **Session shape:** expose `user.id` (stable) to server actions / API for votes and ownership checks.
- **Authorization:** enforce on server for every mutating route (never trust client-only checks).

## Dependencies

- [database-mongodb.md](./database-mongodb.md) for durable user-linked records.
- [ideas-email-sync.md](./ideas-email-sync.md) if merging guest ideas by email on first login.
- [team-invite-only.md](./team-invite-only.md) for “must be signed in + valid invite” rules.

## Definition of done

- [ ] Sign in / sign out flows work in dev and production (correct `NEXTAUTH_URL`, secrets).
- [ ] Votes require auth and are stored per user + project (or listing) with clear uniqueness rules.
- [ ] Submissions are associated with `userId` and listed for that user.
