# Lessons Learned

<!-- Claude updates this file after every correction from the user. -->
<!-- This is the project's "memory" — patterns to remember and mistakes to avoid. -->
<!-- Claude reads this file at the start of each session. -->

## Format

Each entry follows this pattern:

```
### [Date] Short description
- **What happened**: What went wrong
- **Why**: Root cause
- **Rule**: What to do differently next time
```

## Lessons

### [2026-09-23] create-next-app overwrote CLAUDE.md, README.md, .gitignore
- **What happened**: Scaffolded Next.js into a temp folder (`create-next-app` rejects
  uppercase dir names, so it was created in a subfolder then moved into the project
  root with `mv`). `create-next-app` generates its own `CLAUDE.md`, `README.md`, and
  `.gitignore` — the blind `mv` silently overwrote the kit's existing files with the
  same names instead of merging.
- **Why**: Didn't check for filename collisions between the scaffold output and
  existing project files before moving; `mv` overwrites without prompting.
- **Rule**: Before moving/copying a generated project into a non-empty directory,
  diff the incoming file list against existing files first and handle collisions
  explicitly (merge, rename, or skip) — never blind `mv`/`cp` over an existing repo.
  Recovered here: `CLAUDE.md` restored verbatim from conversation context,
  `README.md`/`.gitignore` re-fetched from the upstream kit repo (still on the same
  pinned version, byte-identical sizes confirmed before trusting them).

### [2026-09-23] Over-engineered the backend for a click-through portfolio demo
- **What happened**: Went deep into a real Postgres + Prisma ORM setup (and even
  further down a Prisma-8-vs-7 version rabbit hole — see below) for what is a
  portfolio case study meant to be clicked through by a reviewer, not run in
  production. Burned significant time/tokens on migrations, configs, and DB
  provisioning that a reviewer never sees or verifies.
- **Why**: Defaulted to "production-grade architecture" too literally. For a
  demo whose entire audience is "someone clicking through screens," a real DB
  + real auth is invisible complexity — the visible, judged work is the UI/UX
  and the flows, not the backend plumbing.
- **Rule**: For portfolio / demo-only projects, ask up front whether persistence
  needs to be real or can be a mock/seed data file in React state — default to
  the mock unless the user needs the app to survive a page reload or wants to
  show real backend chops specifically. Put the complexity budget into what the
  reviewer actually evaluates (screens, flows, polish), not infrastructure they
  can't see. Confirmed by the user after seeing the DB detour eat time on
  version/config issues.

### [2026-09-23] Chased a pre-release tool version instead of pinning stable
- **What happened**: `npm install prisma` pulled Prisma 8 (release candidate,
  rc.15) by default, which turned out to have an entirely different API
  (contract-first, no `schema.prisma`/`@prisma/client`) from what training
  knowledge expected. Spent real effort reading the new paradigm's skill docs
  before realizing it was the wrong call for this project, then had to revert
  to Prisma 7 (last stable) and clean up broken symlinks left behind by two
  different skill-installer mechanisms in the process.
- **Why**: Didn't check `npm view <pkg> dist-tags` before installing a
  fast-moving library; `latest` silently meant "pre-release" here.
- **Rule**: For any library likely to move fast or matter architecturally,
  check dist-tags (or changelog) for a stable vs. rc/next split before
  installing, and prefer pinning to the last stable tag unless the user
  explicitly wants bleeding-edge. Related: [[project-scope-simplification]].
