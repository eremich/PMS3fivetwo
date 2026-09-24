# Task Plan

Style: user-supplied references (Eclipso-style light dashboard): light-gray canvas + sidebar
with a white active pill, white rounded work panel, bordered tables with initials avatars,
soft tinted status pills with icons (`.pill-*` in globals.css), DM Sans, blue primary.
(First attempt — deep-blue sidebar — was rejected by the user.)
Brand: New Malden Diagnostic Centre (logo in `public/logo.png`). Tokens live in `globals.css`.

## Current Task

**Patient Management System — staff-facing dashboard (portfolio case study)**

Source spec: `patient-management-system-spec.md` (Patient Pathway, Radiology Flow,
Results Pathway, Service Request Forms, Booking Task Lifecycle, User Roles).

Will later be showcased as a case study (flows, decisions, etc.) on the user's
portfolio site.

### Stack (revised — simplified)
- Next.js (App Router, TypeScript) + Tailwind + shadcn/ui
- **No database, no ORM, no real auth.** This is a click-through portfolio demo —
  a reviewer never verifies backend plumbing, only screens and flows. All that
  complexity budget goes into UI/UX instead.
- **Data**: a seed data file in TypeScript (`src/lib/mock-data.ts`), loaded into a
  React Context on app load. Lives only in memory — no persistence between
  sessions/reloads. Mutations (create task, change status, etc.) update context
  state directly.
- **"Auth"**: a UI role switcher ("Войти как: Admin / Consultant / Secretary") —
  no credentials, no session. Switching role re-renders nav + visible data to
  demonstrate the access-control *thinking*, not a real auth flow.
- Deploy: Vercel — static/CSR-friendly since there's no backend to provision.

> Dropped from the earlier plan: Postgres, Prisma, seeded DB, login screen,
> billing-as-a-separate-phase-after-DB. See `docs/lessons.md` for why (two
> entries: over-engineering the backend, and chasing a pre-release Prisma
> version) — worth reading before reintroducing a real backend later.

### Data model (still the shape, now as TS types + in-memory arrays, not DB tables)
`User` (role: Admin/Consultant/Secretary, Consultant has speciality) · `Patient` ·
`EpisodeOfCare` · `BookingTask` (status, priority, audit log) · `Appointment` ·
`ServiceRequestForm` · `Result` · `ActivityLogEntry` (who/what/when) ·
`BillingRecord`.

## Phases

### Phase 0 — Scaffolding ✅
- [x] Next.js + TS + Tailwind + shadcn/ui project init
- [x] Git initialized, GitHub remote connected (not yet pushed)
- [x] Mock data layer: TS types + seed arrays (realistic patients/tasks/results
      across statuses) in `src/lib/mock-data.ts`
- [x] App-wide React Context: current role + in-memory data + mutation actions
- [x] Role switcher component (used instead of login)

### Phase 1 — App Shell & Dashboard ✅
- [x] Role switcher in header/nav
- [x] Role-based layout/nav (Admin/Consultant/Secretary see different nav)
- [x] Dashboard/overview: task counts by status, quick stats

### Phase 2 — Patients ✅
- [x] Patient list (table, search/filter)
- [x] Patient detail (episodes of care, history)
- [x] Create patient / create episode of care

### Phase 3 — Booking Tasks (core) ✅
- [x] Task table: filters (status, priority, consultant), sort
- [x] Task detail: lifecycle actions (create, reactivate, deactivate, "created in error")
- [x] Audit log per task (who/what/when)

### Phase 4 — Appointments & Service Request Forms ✅
- [x] Made `appointments` / `serviceRequestForms` stateful in context
- [x] Schedule appointment against a task (from Task Detail dialog) — sets task to
      SCHEDULED, logs activity; mark attended/cancelled from the same dialog
- [x] Service request form capture (capturedBy: Consultant in clinic / staff paper /
      staff scan) — full fields for Radiology (X-Ray/Ultrasound-style) + Cardiology
      (Cardiac Investigation-style), generic fields for the rest
- [x] `/appointments` list page — search, status filter, reuses `TaskDetailDialog`
      on row click instead of a separate dialog (consistency)

### Phase 5 — Results Pathway ✅
- [x] Result received → sent to referrer → complete / more-needed loop (in Task Detail
      dialog's "Result" section) — completing a result also closes the booking task
- [x] `ResultStatusBadge`, refactored `TaskStatusBadge`/`AppointmentStatusBadge` onto a
      shared `Badge` primitive in `status-badge.tsx` for consistency
- [x] Fixed `getTaskAppointment`/`getTaskResult` to return the *latest* record
      (previously `.find()` returned array order, not necessarily latest)

### Phase 6 — Billing & Activity Report ✅
- [x] Self-pay (→ Paid) vs insurer (→ Invoiced) path, mocked — "Log billing" on a
      completed episode in the patient detail page (Admin only, once per episode)
- [x] `/billing` activity report: totals (billed / self-pay / insurer / awaiting insurer),
      search + payment-type filter, links through to the patient
- [x] `BillingStatusBadge` on the shared `Badge` primitive; "Admin only" guard on
      direct URL access for other roles (matches the "Not in your clinic" pattern)

### Design system ✅ (2026-09-24)
- [x] Interaction states unified (hover / focus / pressed / disabled / pointer cursor), keyboard-reachable table rows
- [x] Dark theme with toggle (Light / Dark / System), no flash on load, SVG logos with dark variants
- [x] Three-tier tokens in `src/styles/` (primitives, semantic, component) + Tailwind bridge; default palette, radii and type sizes removed
- [x] Primary / secondary roles, all button variants with states, field / menu / chip / choice card / table header / dialog tokens, elevation and motion tokens
- [x] `scripts/codemod-tokens.py` and `scripts/check-tokens.py` (run before committing)
- [x] Storybook (`npm run storybook`): Foundations read the token files directly (colours, type, radius, control heights, elevation, motion, interaction-state matrix); stories for every ui/ds component, logo and theme toggle
- [x] Forms use Text field and Alert: per-field errors, validate on submit then live, submit never disabled (register patient, billing, task scheduling and referral form text fields)
- [ ] Select fields (referral category, captured by, referral form selects) as a labelled Select field with the same error state
- [ ] Field borders reach 3:1 contrast (currently ~1.3:1, shared by both themes)
- [ ] Publish Storybook (Vercel / Chromatic) for the portfolio case study
- [ ] README rewritten as the case study (current README is the designer kit's)

### Phase 7 — Polish
- [ ] Accessibility audit pass (WCAG 2.1 AA)
- [ ] Final design-reviewer anti-slop pass across all screens
- [ ] Responsive check (375 / 768 / 1024 / 1440), empty + loading states

## Completed

- Next.js + TypeScript + Tailwind + shadcn/ui (Base UI, Nova preset) scaffolded
- Git repo initialized, GitHub remote `eremich/PMS3fivetwo` connected
