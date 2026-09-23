# Product

## Register

product

## Users

Front-desk admin staff, consultants, and secretaries at a diagnostic clinic
(Anuitex), using this during clinic hours — mostly desktop, some tablet at a
reception desk. They're triaging: dozens of referrals and booking tasks in
flight, each needing to move through a lifecycle (booked → scheduled →
result → closed) without silently stalling. The job is "what needs my
attention right now, and can I act on it in one or two clicks."

## Product Purpose

Internal staff dashboard for a diagnostic centre's patient management:
referral intake, appointment booking, task/status tracking, results
chasing, billing. Success is a staff member landing on the dashboard and
immediately knowing what's urgent, without digging.

This is also a portfolio case study — a reviewer will click through it, not
run it in production. The demo itself has to read as competently-built
software, since that reading *is* the deliverable.

## Brand Personality

Precise, calm, unflashy — "a well-run reception desk," not a sterile
hospital portal and not a consumer health app. Three words: precise, warm,
unhurried.

## Anti-references

- Generic SaaS-purple admin dashboard templates (Notion/Linear clones)
- Cold clinical blue-on-white "hospital portal" look
- Cutesy consumer health-app illustration style
- Anything that reads as a spreadsheet with rounded corners

## Design Principles

- One primary action visible per screen — staff are triaging, not browsing.
- Status and priority are scannable at a glance: color + label together,
  never color alone (colorblind-safe, matches the WCAG requirement below).
- Never hide what a role can't do behind a later error — grey out or omit
  the control instead.
- Show, don't make staff dig: surface what needs attention before they ask.

## Accessibility & Inclusion

WCAG 2.1 AA — contrast, full keyboard navigation, no color-only signaling.
Already a stated requirement for this project (see docs/todo.md Phase 7).

---
_Inferred from project context (spec doc, docs/todo.md, conversation) rather
than a formal interview, since the answers were already discoverable.
Correct anything that's off._
