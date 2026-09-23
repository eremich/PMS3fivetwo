# Design system

Single source of truth for tokens is `src/app/globals.css`. Components below are
presentational (props only, no data context) so each maps 1:1 to a Storybook story.

## Tokens

| Group | Tokens | Usage |
| --- | --- | --- |
| Radius | `rounded-lg` 8px, `rounded-xl` 12px, `rounded-2xl` 16px, `rounded-full` | controls (inputs, buttons, chips, pills) · cards, tables, panels · app panel, dialogs · avatars |
| Type | `text-h1` 28/36 bold, `text-h2` 24/32 bold, `text-h3` 20/24 semibold, `text-h4` 18/24 semibold, `text-body` 14/20, `text-caption` 12/16 | page title · big numbers · blocked-state titles · card/dialog titles · default text · meta/labels |
| Control height | input, select, chip, button default `h-10` (40px); `sm` 32px; `xs` 28px; `lg` 44px | one rhythm across toolbars and forms |
| Color | `background` (canvas), `card` (surfaces), `foreground`, `muted-foreground`, `primary` (blue), `border`, `input`, `ring`, `success`, `warning`, `destructive` | never hard-code colors in pages |
| Status tones | `.pill-info / -success / -warning / -danger / -neutral` (soft tint + icon) | all status and priority badges |
| Font | DM Sans (`--font-dm-sans`) | |
| Spacing | 4px scale; page gap `gap-6`; table cell `px-4 py-3.5`; panel padding `p-4`/`p-5` | |

## Components (`src/components/ds`)

| Component | Purpose |
| --- | --- |
| `PageHeader` | title, description, optional actions |
| `Toolbar` | filter row, right-aligned meta (result count) |
| `SearchInput` | search field with icon |
| `FilterChip` | toggle filter, `aria-pressed` |
| `TableCard` | bordered white surface around a table or list |
| `StatTile` | metric tile, `emphasis` for the primary metric |
| `EmptyState` | dashed empty block with optional action |
| `SectionPanel` / `SectionLabel` | titled panel with icon inside dialogs |
| `RadioCard` | selectable option row (use inside `RadioGroup`) |
| `PatientAvatar` | initials avatar, deterministic color from name |
| `status-badge` | `TaskStatusBadge`, `PriorityBadge`, `AppointmentStatusBadge`, `ResultStatusBadge`, `BillingStatusBadge`, `EpisodeStatusBadge` (shared `Badge`) |

Base primitives live in `src/components/ui` (shadcn / Base UI): button, input, textarea,
select, dialog, dropdown-menu, radio-group, label, avatar, table.

## Rules

- No raw `text-sm/xs`, arbitrary `text-[..px]`, or one-off radii in pages; use the tokens above.
- New status → add a config entry in `status-badge.tsx` (tone + icon + label), not new CSS.
- App-level, data-aware pieces (`RoleSwitcher`, dialogs, page clients) stay outside `ds/`.

## Storybook notes

- Stories: one per `ds/` component, plus `ui/` controls in all sizes/states.
- `RadioCard` needs a `RadioGroup` decorator; badges need no decorator.
- Add the `dark` class decorator only after dark-mode tokens are reviewed (dark block exists but is untested).
