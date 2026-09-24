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

### [2026-09-24] Class merger read our type tokens as colours
- **What happened**: After renaming `text-sm` to `text-body` in the button sizes, buttons showed black text on blue and red backgrounds. The class merger (`cn`) did not know `text-body` / `text-caption` were font sizes, treated them as text colours, and dropped the real colour when both were present.
- **Why**: Custom Tailwind tokens are invisible to the merge library unless it is configured; the code looked correct, only the rendered result was wrong.
- **Rule**: When adding custom font-size / colour / radius names, register them in `src/lib/utils.ts` (`createCn`) in the same change, and route every component through that one `cn`. After renaming classes, verify computed styles in the browser, not just the source.

### [2026-09-24] Installed Storybook before the tokens were applied to the site
- **What happened**: The user wanted the token system applied correctly on the site first and Storybook after it. Asked in a different order, I started the Storybook install mid-refactor and had to revert it.
- **Why**: I read "do it in Storybook" as an instruction to install now instead of confirming the sequence.
- **Rule**: When a request could mean two orders of work (tool first vs. foundation first), state the order in one line and confirm before touching the project. Foundations (tokens, naming) before tooling that documents them.

### [2026-09-24] Variants lived in component strings, not in the design system
- **What happened**: Button variants, hover and pressed colours existed only as class strings inside `button.tsx`, inherited from the shadcn template. The user expected primary / secondary and every state to be defined in CSS.
- **Why**: I styled components directly with template defaults instead of defining tokens first.
- **Rule**: Design-system order is tokens first (primitive, semantic, component), then components that only compose them. A new variant or state means new component tokens in `src/styles/tokens/component.css`, a story, and a docs row in the same change.

### [2026-09-24] Built the design-system state but not the screens that use it
- **What happened**: Error state existed in Storybook (red border, message under the field, `aria-invalid`), but the app's forms still showed one generic message at the bottom, no red field, native browser bubbles and a silently disabled submit button. The user noticed the mismatch.
- **Why**: I added the component to the design system and stopped, without migrating the places that hand-assemble the same thing.
- **Rule**: Finishing a design-system component includes (1) migrating every existing usage in the app, then (2) checking the app against Storybook by comparing computed styles (border, text size and colour) of the same state. If they differ, fix the app.
- Also: Storybook's dev build does not pick up classes from a brand-new file until it is restarted; restart before judging colours.

