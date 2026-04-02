# Team membership (auth + invite-only)

## Goal

Joining a project team requires **authentication** and a valid **invite**; no open “join” without an invitation.

## Non-goals (for first slice)

- Full org/SSO or enterprise role hierarchies.

## User stories

- As a project owner (or maintainer), I invite someone by email or link; they accept while signed in.
- As a visitor, I cannot add myself to a team without a valid invite.
- As a user, I see only teams I belong to (or public roster; product decision).

## Technical notes

- **Model (draft):** `invite` with `projectId`, `inviterUserId`, `inviteeEmail` or single-use token, `expiresAt`, `acceptedAt`.
- **Accept flow:** authenticated user matches invitee email or token; server marks invite used and creates `teamMember` row.
- **Permissions:** define who can create invites (e.g. listing owner only).

## Dependencies

- [authentication-nextauth.md](./authentication-nextauth.md)
- [database-mongodb.md](./database-mongodb.md)

## Definition of done

- [ ] Join team UI only available when signed in; server rejects unauthenticated joins.
- [ ] Invites are single-use (or explicitly idempotent rules documented) with expiry.
- [ ] No team membership without valid invite record.
