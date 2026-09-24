import type { ReactNode } from "react";
import {
  alias,
  classFor,
  componentTokens,
  groupBy,
  isColor,
  primitiveTokens,
  semanticDark,
  semanticLight,
  type Token,
} from "./tokens";

function Page({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">{title}</h1>
        <p className="max-w-3xl text-body text-fg-secondary">{intro}</p>
      </header>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4">{title}</h2>
      <div className="overflow-hidden rounded-surface border border-line bg-surface">{children}</div>
    </section>
  );
}

function Swatch({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-8 shrink-0 rounded-control border border-line"
      style={{ background: `var(${name})` }}
    />
  );
}

const th = "px-4 py-2.5 text-left text-caption font-medium text-fg-secondary";
const td = "px-4 py-2.5 align-middle";
const code = "font-mono text-caption";

/** Tier 1: raw palette, grouped by hue. */
export function PrimitivesPage() {
  const byHue = new Map<string, Token[]>();
  for (const t of primitiveTokens) {
    const hue = t.name.replace("--primitive-", "").split("-")[0];
    byHue.set(hue, [...(byHue.get(hue) ?? []), t]);
  }
  return (
    <Page
      title="Primitives"
      intro={
        <>
          Tier 1. Raw palette values with no meaning and no themes. Never used in components: only{" "}
          <code className={code}>semantic.css</code> may reference them. Source:{" "}
          <code className={code}>src/styles/tokens/primitives.css</code>.
        </>
      }
    >
      {[...byHue.entries()].map(([hue, tokens]) => (
        <Section key={hue} title={hue[0].toUpperCase() + hue.slice(1)}>
          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-6">
            {tokens.map((t) => (
              <div key={t.name} className="flex flex-col gap-2 bg-surface p-3">
                <span
                  aria-hidden="true"
                  className="h-14 rounded-control border border-line"
                  style={{ background: `var(${t.name})` }}
                />
                <span className="text-body font-medium">{t.name.split("-").pop()}</span>
                <span className={`${code} text-fg-secondary`}>{t.value}</span>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  );
}

/** Tier 2: semantic tokens, live in the current theme, with both theme aliases. */
export function SemanticPage() {
  const dark = new Map(semanticDark.map((t) => [t.name, t.value]));
  return (
    <Page
      title="Semantic colours"
      intro={
        <>
          Tier 2. Purpose-named tokens, resolved per theme. These are what components and pages use. Swatches follow the
          theme selected in the toolbar. Naming: <code className={code}>--category-purpose-state</code>, state always last.
          Source: <code className={code}>src/styles/tokens/semantic.css</code>.
        </>
      }
    >
      {groupBy(semanticLight).map(([group, tokens]) => (
        <Section key={group} title={group}>
          <table className="w-full text-body">
            <thead className="bg-subtle">
              <tr>
                <th className={th} />
                <th className={th}>Token</th>
                <th className={th}>Class</th>
                <th className={th}>Light</th>
                <th className={th}>Dark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tokens.map((t) => (
                <tr key={t.name}>
                  <td className={`${td} w-12`}>
                    <Swatch name={t.name} />
                  </td>
                  <td className={`${td} ${code}`}>{t.name}</td>
                  <td className={`${td} ${code} text-fg-secondary`}>{classFor(t.name) ?? "n/a"}</td>
                  <td className={`${td} ${code} text-fg-secondary`}>{alias(t.value)}</td>
                  <td className={`${td} ${code} text-fg-secondary`}>{alias(dark.get(t.name) ?? "missing")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ))}
    </Page>
  );
}

/** Tier 3: component tokens. */
export function ComponentTokensPage() {
  return (
    <Page
      title="Component tokens"
      intro={
        <>
          Tier 3. Tuning knobs for one component; values point at semantic tokens, never at primitives. A new variant or
          state starts here. Source: <code className={code}>src/styles/tokens/component.css</code>.
        </>
      }
    >
      {groupBy(componentTokens).map(([group, tokens]) => (
        <Section key={group} title={group}>
          <table className="w-full text-body">
            <thead className="bg-subtle">
              <tr>
                <th className={th} />
                <th className={th}>Token</th>
                <th className={th}>Class</th>
                <th className={th}>Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tokens.map((t) => (
                <tr key={t.name}>
                  <td className={`${td} w-12`}>{isColor(t) ? <Swatch name={t.name} /> : null}</td>
                  <td className={`${td} ${code}`}>{t.name}</td>
                  <td className={`${td} ${code} text-fg-secondary`}>{classFor(t.name) ?? "n/a"}</td>
                  <td className={`${td} ${code} text-fg-secondary`}>{alias(t.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ))}
    </Page>
  );
}
