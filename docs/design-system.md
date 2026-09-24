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

## Interaction states

Defined once in `src/app/globals.css`; components reuse the utilities, never re-declare a state.

| State | Rule | Utility / token |
| --- | --- | --- |
| Hover | neutral surfaces fill with `accent`; primary button `primary/90`; fields darken the border (`muted-foreground/50`) | `hover:bg-accent`, `interactive-row` |
| Focus | keyboard only (`:focus-visible`), solid 2px `ring`; 2px offset outside, or inset for fields and rows in clipped containers | `focus-ring`, `focus-ring-inset` |
| Active (pressed) | buttons and chips move 1px down; rows darken one step | `active:translate-y-px`, `interactive-row` |
| Disabled | 50% opacity, `cursor: not-allowed`, no click | `disabled:opacity-50`, `state-disabled` |
| Cursor | every clickable control shows a pointer (global base rule); disabled shows `not-allowed` | `@layer base` in globals.css |
| Invalid | destructive border and soft ring | `aria-invalid:*` |
| Transition | color/background only, 150ms ease-out; removed under `prefers-reduced-motion` | |

### Per component

| Component | Hover | Focus | Active | Disabled | Selected |
| --- | --- | --- | --- | --- | --- |
| Button default | `primary/90` | `focus-ring` | down 1px | 50%, not-allowed | n/a |
| Button outline / ghost | `accent` | `focus-ring` | down 1px | 50%, not-allowed | `aria-expanded` = `accent` |
| Button destructive | `destructive/20` | `focus-ring` | down 1px | 50%, not-allowed | n/a |
| Input / Textarea / Select trigger | darker border | `focus-ring-inset` + `ring` border | n/a | 50%, tinted bg, not-allowed | n/a |
| FilterChip | `accent` | `focus-ring` | down 1px | n/a | `aria-pressed`: primary tint |
| RadioCard | `accent` | radio has `focus-ring` | n/a | n/a | `data-checked`: primary tint |
| Menu / Select item | `accent` (also on keyboard highlight) | highlight = `accent` | n/a | 50%, not-allowed | check mark |
| Sidebar / mobile nav link | `card/70` / `accent` | `focus-ring` | n/a | n/a | `aria-current="page"`: white pill |
| Clickable table row | `accent` | `focus-ring-inset`, reachable by Tab, Enter/Space opens | darker `accent` | n/a | n/a |
| RoleSwitcher trigger | `accent` | `focus-ring` | n/a | n/a | `aria-expanded` |

Non-clickable rows and cards have no hover fill, so hover always signals "you can click this".

## Themes

Light and dark share the same token names; only values change (`:root` and `.dark` in `globals.css`). Components never branch on the theme, except the logo (two SVGs) and a few `dark:` tweaks for destructive/invalid states.

| Token | Why it exists |
| --- | --- |
| `--primary` | fills (buttons, emphasis tile) with white text on top; AA in both themes |
| `--primary-text` | blue used *as text* (links, active chip, check marks); lighter in dark so it stays AA on `card` |
| `--pill-{info,success,warning,danger,neutral}-{bg,fg,border}` | status badges; soft tint in light, deep tint + light text in dark |
| `--card` / `--popover` / `--accent` | surfaces step lighter in dark (canvas 0.16, card 0.20, popover 0.22) instead of using shadows |

- Switching: `ThemeToggle` (Light / Dark / System), preference in `localStorage["theme"]`, applied before first paint by an inline script (`themeInitScript` in `src/lib/theme.ts`).
- Logo: `Logo` renders `logo-compact.svg` / `logo-compact-dark.svg` (and `full` variants); CSS shows the matching one.
- Contrast was audited in dark on every screen and dialog (text against its real background, AA); known gap shared with light: borders of fields are ~1.3:1, below the 3:1 non-text guideline.
- Outline buttons use `card` (same as inputs), never `background`, so they do not read as holes in dark surfaces.

## Rules

- No raw `text-sm/xs`, arbitrary `text-[..px]`, or one-off radii in pages; use the tokens above.
- New status → add a config entry in `status-badge.tsx` (tone + icon + label), not new CSS.
- App-level, data-aware pieces (`RoleSwitcher`, dialogs, page clients) stay outside `ds/`.

## Storybook notes

- Stories: one per `ds/` component, plus `ui/` controls in all sizes/states.
- `RadioCard` needs a `RadioGroup` decorator; badges need no decorator.
- Stories must show every state per component: default, hover, focus, active, disabled (Storybook `pseudo-states` addon for hover/focus/active).
- Add a theme toolbar (Storybook `globalTypes` + `withThemeByClassName` decorator toggling the `dark` class); every story must be checked in both themes.
