import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { controlHeights, elevationTokens, motionTokens, radii, typeScale } from "./tokens";

// Tailwind only generates classes it can read literally, so names map to full class strings here.
const TEXT_CLASS: Record<string, string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  "body-lg": "text-body-lg",
  body: "text-body",
  caption: "text-caption",
};
const RADIUS_CLASS: Record<string, string> = {
  control: "rounded-control",
  surface: "rounded-surface",
  panel: "rounded-panel",
};
const HEIGHT_CLASS: Record<string, string> = {
  "--control-height-xs": "h-control-xs",
  "--control-height-sm": "h-control-sm",
  "--control-height-md": "h-control-md",
  "--control-height-lg": "h-control-lg",
};
const RADIUS_USE: Record<string, string> = {
  control: "inputs, buttons, chips, pills, menu items",
  surface: "cards, tables, list panels",
  panel: "app panel, dialogs",
};

function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">{title}</h1>
        <p className="max-w-3xl text-body text-fg-secondary">{intro}</p>
      </header>
      {children}
    </div>
  );
}

const meta = { title: "Foundations/Shape and type", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => (
    <Page title="Typography" intro="Type scale by role, DM Sans. Read from src/styles/theme.css. Only these sizes exist; Tailwind's default size names are removed.">
      <div className="divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
        {typeScale.map((t) => (
          <div key={t.name} className="grid grid-cols-[10rem_1fr] items-baseline gap-6 px-4 py-4">
            <div className="flex flex-col">
              <code className="font-mono text-caption">{TEXT_CLASS[t.name] ?? `text-${t.name}`}</code>
              <span className="text-caption text-fg-secondary">
                {t.size} / {t.lineHeight ?? "1.5"}
                {t.weight ? ` / ${t.weight}` : ""}
              </span>
            </div>
            <p className={TEXT_CLASS[t.name]}>New Malden Diagnostic Centre</p>
          </div>
        ))}
      </div>
    </Page>
  ),
};

export const Radius: Story = {
  render: () => (
    <Page title="Radius" intro="Radius by role, not by size. rounded-full is only for avatars.">
      <div className="grid grid-cols-3 gap-4">
        {radii.map((r) => (
          <div key={r.name} className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-4">
            <div className={`h-20 border border-line-strong bg-subtle ${RADIUS_CLASS[r.name] ?? ""}`} />
            <code className="font-mono text-caption">{RADIUS_CLASS[r.name] ?? `rounded-${r.name}`}</code>
            <span className="text-caption text-fg-secondary">
              {r.value} · {RADIUS_USE[r.name]}
            </span>
          </div>
        ))}
      </div>
    </Page>
  ),
};

export const ControlHeights: Story = {
  name: "Control heights",
  render: () => (
    <Page title="Control heights" intro="One rhythm for buttons, inputs, selects and chips. Read from src/styles/tokens/component.css.">
      <div className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-4">
        {controlHeights.map((t) => (
          <div key={t.name} className="flex items-center gap-4">
            <code className="w-48 font-mono text-caption">{HEIGHT_CLASS[t.name] ?? t.name}</code>
            <div className={`w-40 rounded-control border border-line-strong bg-subtle ${HEIGHT_CLASS[t.name] ?? ""}`} />
            <span className="text-caption text-fg-secondary">{t.value}</span>
          </div>
        ))}
      </div>
    </Page>
  ),
};

export const Elevation: Story = {
  render: () => (
    <Page title="Elevation" intro="Two levels. Surfaces step lighter in dark mode, so shadows stay subtle. Read from src/styles/tokens/semantic.css.">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 rounded-surface border border-line bg-canvas p-6">
          <div className="h-20 rounded-surface border border-line bg-surface shadow-raised" />
          <code className="font-mono text-caption">shadow-raised</code>
          <span className="text-caption text-fg-secondary">active nav item, app panel</span>
        </div>
        <div className="flex flex-col gap-3 rounded-surface border border-line bg-canvas p-6">
          <div className="h-20 rounded-surface bg-menu shadow-overlay ring-1 ring-menu-border" />
          <code className="font-mono text-caption">shadow-overlay</code>
          <span className="text-caption text-fg-secondary">menus, select lists</span>
        </div>
      </div>
      <ul className="text-caption text-fg-secondary">
        {elevationTokens.map((t) => (
          <li key={t.name} className="font-mono">
            {t.name}
          </li>
        ))}
      </ul>
    </Page>
  ),
};

export const Motion: Story = {
  render: () => (
    <Page title="Motion" intro="One speed and easing for every colour and background transition. Reduced-motion users get instant changes (global rule in globals.css).">
      <div className="divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
        {motionTokens.map((t) => (
          <div key={t.name} className="grid grid-cols-[18rem_1fr] gap-4 px-4 py-3">
            <code className="font-mono text-caption">{t.name}</code>
            <span className="text-caption text-fg-secondary">{t.value}</span>
          </div>
        ))}
      </div>
    </Page>
  ),
};
