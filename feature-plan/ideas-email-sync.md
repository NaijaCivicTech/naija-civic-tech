# Ideas + email (pre-signup sync)

## Goal

Submitting an **idea** requires an **email** so that when the same person signs up later, their ideas can be linked to their account (or surfaced for manual merge).

## Non-goals (for first slice)

- Full marketing email program; only what’s needed for verification or merge.

## User stories

- As a visitor, I submit an idea with my email before I have an account.
- As a user, after I sign up with the same email, my prior ideas appear under my account (or I get a clear path to claim them).

## Technical notes

- **Storage:** store `email` (normalized lowercase), optional `emailVerified`, `submittedAt`, idea payload.
- **Privacy:** document retention and whether email is shown publicly (default: no).
- **Sync strategy (pick one and document):** automatic merge on verified email match vs. magic-link “claim” flow vs. admin tool.
- **Abuse:** rate limit and/or verification to reduce spam (even lightweight).

## Dependencies

- [database-mongodb.md](./database-mongodb.md) for storing ideas.
- [authentication-nextauth.md](./authentication-nextauth.md) for signup identity to merge against.

## Definition of done

- [ ] Idea form requires valid email format; server validates and persists.
- [ ] Documented merge or claim behavior when user signs up with matching email.
- [ ] No accidental public exposure of submitter emails on the site.
