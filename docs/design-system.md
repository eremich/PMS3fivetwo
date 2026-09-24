# Design system

Code is the source of truth. Token files live in `src/styles/`; Storybook (next step) renders them
directly from those files, so docs and code cannot drift.

## Architecture: three tiers

```
src/styles/
  tokens/primitives.css   Tier 1  raw palette, no meaning, no themes
  tokens/semantic.css     Tier 2  purpose-named, resolved per theme (:root = light, .dark = dark)
  tokens/component.css    Tier 3  tuning knobs per component (button, field, menu, nav, control heights)
  theme.css               bridge: exposes tiers 2-3 as Tailwind utilities, removes Tailwind defaults
src/app/globals.css       imports the above + base rules, status pills, interaction utilities
```

| Tier | Example | Who may use it |
| --- | --- | --- |
| 1. Primitive | `--primitive-blue-600`, `--primitive-neutral-50` | only `semantic.css` |
| 2. Semantic | `--bg-surface`, `--text-secondary`, `--border-default`, `--action-primary-hover` | components, pages |
| 3. Component | `--button-primary-bg-hover`, `--field-border-focus`, `--control-height-md` | that component |

Rules:
- Components never reference primitives. Pages and components never contain raw colours, `px` radii or font sizes.
- Every semantic token has a value in both themes. Components never branch on the theme (no `dark:` colour overrides).
- Tailwind's default palette, radii and font sizes are **removed** (`theme.css`). `bg-blue-500`, `rounded-lg`, `text-sm` do not exist.

## Naming

Semantic and component variables: `--{category}-{purpose}[-{state}]`, lowercase kebab-case.

- Categories: `bg`, `text`, `border`, `action`, `destructive`, `success`, `warning`, `info`, `neutral`, `overlay`; components: `button`, `field`, `menu-item`, `nav-item`.
- State is always the last word: `default`, `hover`, `pressed`, `subtle`, `subtle-hover`.
- Names describe purpose, never appearance (`destructive-hover`, not `red-hover`).
- Feedback groups share one shape: `default` (solid/icon), `subtle` (soft fill), `text` (on subtle), `border`. Only `destructive` has `subtle-hover` (only interactive feedback).

### Tailwind class names

Tailwind adds `bg-`, `text-`, `border-` itself, so the category word is dropped in classes:

| CSS variable | Class |
| --- | --- |
| `--bg-canvas` / `--bg-surface` / `--bg-surface-hover` / `--bg-surface-pressed` / `--bg-subtle` / `--bg-overlay` | `bg-canvas` `bg-surface` `bg-surface-hover` `bg-surface-pressed` `bg-subtle` `bg-overlay` |
| `--overlay-scrim` | `bg-scrim` |
| `--text-primary` / `-secondary` / `-inverse` / `-link` | `text-fg` `text-fg-secondary` `text-fg-inverse` `text-fg-link` |
| `--border-default` / `-strong` / `-strong-hover` / `-focus` | `border-line` `border-line-strong` `border-line-strong-hover` `border-focus` |
| `--action-primary-{default,hover,pressed,subtle,subtle-hover}` | `bg-primary` `bg-primary-hover` `bg-primary-pressed` `bg-primary-subtle` `bg-primary-subtle-hover` |
| `--action-secondary-{default,hover,pressed}` | `bg-secondary` `bg-secondary-hover` `bg-secondary-pressed` |
| `--{destructive,success,warning,info}-{default,subtle,text,border}` | `bg-destructive-subtle` `text-destructive-text` `border-destructive-border` `text-success` ... |
| `--neutral-{subtle,text,border}` | `bg-neutral-subtle` `text-neutral-text` `border-neutral-border` |
| `--button-{variant}-{bg,bg-hover,bg-pressed,text,border}` | `bg-button-primary` `hover:bg-button-primary-hover` `text-button-primary-text` ... |
| `--field-*` | `bg-field` `text-field-text` `border-field-border` `border-field-border-hover` `border-field-border-focus` `border-field-border-invalid` `ring-field-ring-invalid` `bg-field-disabled` `placeholder:text-field-placeholder` |
| `--menu-item-*`, `--nav-item-*` | `bg-menu-item-hover` `text-menu-item-text` `bg-nav-hover` `bg-nav-active` |
| `--control-height-{xs,sm,md,lg}` | `h-control-md` `size-control-md` ... |

### Radius, type, spacing

| Role | Class | Value | Use |
| --- | --- | --- | --- |
| Radius | `rounded-control` | 8px | inputs, buttons, chips, pills, menu items |
| Radius | `rounded-surface` | 12px | cards, tables, list panels |
| Radius | `rounded-panel` | 16px | app panel, dialogs |
| Radius | `rounded-full` | pill | avatars only |
| Type | `text-h1` 28/36 bold, `text-h2` 24/32 bold, `text-h3` 20/24 semibold, `text-h4` 18/24 semibold | | page title, big numbers, blocked-state titles, card/dialog titles |
| Type | `text-body-lg` 16/24, `text-body` 14/20, `text-caption` 12/16 | | mobile input text, default text, meta/labels |
| Spacing | Tailwind 4px scale; page gap `gap-6`; table cell `px-4 py-3.5`; panel padding `p-4`/`p-5` | | |
| Font | DM Sans (`--font-dm-sans`) | | |

## Button variants

Every variant defines fill, hover, pressed and text (outline also a border) in `component.css`.
`button.tsx` only composes these tokens.

| Variant | Use |
| --- | --- |
| `primary` | the one main action per screen or dialog |
| `secondary` | supporting action, quiet neutral fill |
| `outline` | alternative or cancel next to a primary |
| `ghost` | toolbar and in-row actions |
| `destructive` | irreversible or risky action (soft red) |
| `link` | inline navigation-style action |

Sizes: `xs` 28, `sm` 32, `default` 40, `lg` 44 (from `--control-height-*`); icon buttons match.

## Interaction states

Defined once (`globals.css` utilities + tokens); components reuse them, never re-declare.

| State | Rule | Utility / token |
| --- | --- | --- |
| Hover | neutral surfaces fill `bg-surface-hover`; primary fills `bg-primary-hover`; fields darken the border | `hover:bg-surface-hover`, `interactive-row` |
| Focus | keyboard only (`:focus-visible`), 2px `--border-focus`, 2px offset (inset for fields and rows in clipped containers) | `focus-ring`, `focus-ring-inset` |
| Active (pressed) | buttons 1px down + `*-pressed` fill; rows `bg-surface-pressed` | `active:translate-y-px`, `interactive-row` |
| Disabled | 50% opacity, `cursor: not-allowed`, no click | `disabled:opacity-50`, `state-disabled` |
| Cursor | every clickable control shows a pointer (global base rule); disabled shows `not-allowed` | `@layer base` |
| Invalid | `--field-border-invalid` border + soft ring | `aria-invalid:*` |
| Transition | colour/background only, 150ms ease-out; removed under `prefers-reduced-motion` | |

Non-clickable rows and cards have no hover fill, so hover always means "you can click this".

| Component | Hover | Focus | Active | Disabled | Selected |
| --- | --- | --- | --- | --- | --- |
| Button primary / secondary / destructive | variant `-hover` | `focus-ring` | variant `-pressed` | 50%, not-allowed | n/a |
| Button outline / ghost | variant `-hover` | `focus-ring` | variant `-pressed` | 50%, not-allowed | `aria-expanded` = hover fill |
| Input / Textarea / Select trigger | `field-border-hover` | `focus-ring-inset` + `field-border-focus` | n/a | 50%, `field-disabled` | n/a |
| FilterChip | `surface-hover` | `focus-ring` | down 1px | n/a | `aria-pressed`: `primary-subtle` |
| RadioCard | `surface-hover` | radio has `focus-ring` | n/a | n/a | `data-checked`: `primary-subtle` |
| Menu / Select item | `menu-item-hover` (also keyboard highlight) | highlight | n/a | 50%, not-allowed | check mark |
| Sidebar / mobile nav link | `nav-hover` / `surface-hover` | `focus-ring` | n/a | n/a | `aria-current="page"`: `nav-active` |
| Clickable table row | `surface-hover` | `focus-ring-inset`, Tab reachable, Enter/Space opens | `surface-pressed` | n/a | n/a |
| RoleSwitcher / ThemeToggle trigger | `surface-hover` | `focus-ring` | n/a | n/a | `aria-expanded` |

## Themes

Light (`:root`) and dark (`.dark`) share token names; only semantic values change.

- Switching: `ThemeToggle` (Light / Dark / System), stored in `localStorage["theme"]`, applied before first paint by `themeInitScript` (`src/lib/theme.ts`).
- Dark surfaces step lighter instead of using shadows: canvas 0.16, surface 0.20, overlay 0.22 (OKLCH lightness).
- Blue as **text** (`text-fg-link`) is lighter in dark than the blue **fill** (`bg-primary`) so both stay AA.
- Logo: `Logo` renders light/dark SVG variants (`public/logo/`), CSS shows the matching one.
- Contrast was audited in dark on every screen and dialog (AA). Known gap shared by both themes: field borders are ~1.3:1, below the 3:1 non-text guideline.
- Outline buttons use the field/surface colour, not the canvas, so they never read as holes in dark surfaces.

## Components (`src/components/ds`)

| Component | Purpose |
| --- | --- |
| `PageHeader` | title, description, optional actions |
| `Toolbar` | filter row, right-aligned meta (result count) |
| `SearchInput` | search field with icon |
| `FilterChip` | toggle filter, `aria-pressed` |
| `TableCard` | bordered surface around a table or list |
| `StatTile` | metric tile, `emphasis` for the primary metric |
| `EmptyState` | dashed empty block with optional action |
| `SectionPanel` / `SectionLabel` | titled panel with icon inside dialogs |
| `RadioCard` | selectable option row (use inside `RadioGroup`) |
| `PatientAvatar` | initials avatar, deterministic hue from name |
| `status-badge` | `TaskStatusBadge`, `PriorityBadge`, `AppointmentStatusBadge`, `ResultStatusBadge`, `BillingStatusBadge`, `EpisodeStatusBadge` (shared `Badge`, tones from feedback tokens) |

Base primitives live in `src/components/ui` (shadcn / Base UI): button, input, textarea, select, dialog, dropdown-menu, radio-group, label, avatar, table. All class merging goes through `cn` from `@/lib/utils` (it knows our type tokens).

## Working rules

- New colour need: add a semantic token (both themes) → bridge it in `theme.css` → use the class. Never add a hex or a primitive to a component.
- New status → config entry in `status-badge.tsx` (tone + icon + label), not new CSS.
- New variant/state on a component: add tokens to `component.css` first.
- App-level, data-aware pieces (`RoleSwitcher`, dialogs, page clients) stay outside `ds/`.
- Adding a component with `shadcn add`: run `python scripts/codemod-tokens.py`, then `python scripts/check-tokens.py`.

Checks (run before committing):

```
python scripts/codemod-tokens.py --check   # no legacy shadcn / palette / size classes
python scripts/check-tokens.py             # every colour class resolves to a token
```

## Storybook notes

- Token pages (colours per theme, type, radius, control heights, states) read `src/styles/**` directly.
- One story per `ds/` component plus `ui/` controls in every variant, size and state (Storybook `pseudo-states` addon for hover/focus/active).
- Theme toolbar via `withThemeByClassName` toggling `dark`; check every story in both themes.
- `RadioCard` needs a `RadioGroup` decorator; badges need none.
