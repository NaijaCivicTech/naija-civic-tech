# Mobile responsiveness

## Goal

Core flows (home, pipeline board, directory, modals, header/tabs) are usable on small screens: readable type, tappable targets, no horizontal trap, modals scroll safely.

## Non-goals (for first slice)

- Pixel-perfect parity with desktop; prioritize **usability** and **critical paths**.

## User stories

- As a mobile user, I can browse the directory and open project details without zooming or sideways scroll.
- As a mobile user, I can use submit/idea modals with the keyboard open where relevant.
- As a mobile user, pipeline columns remain understandable (scroll, stack, or tabs; implementation choice).

## Technical notes

- **Audit:** real devices + Chrome/Firefox responsive mode; focus on breakpoints already used (`max-md`, etc.).
- **Tailwind:** prefer existing tokens (`paper`, `ink`, spacing) for consistency.
- **Touch:** minimum tap targets (~44px), sticky actions if needed.

## Dependencies

- None blocking; can proceed in parallel with backend work. Re-test after large UI changes.

## Definition of done

- [ ] Checklist run on at least one small phone size for `/`, `/pipeline`, `/directory` + all modals.
- [ ] No critical content clipped; horizontal scroll only where intentional (e.g. kanban).
- [ ] Issues found are fixed or filed as linked follow-ups in this doc.
