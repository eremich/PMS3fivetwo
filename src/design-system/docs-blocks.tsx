import type { ReactNode } from "react";
import { Check, X } from "lucide-react";

/**
 * Small building blocks for MDX documentation pages, styled with the design tokens themselves.
 * Covers the "design reference" part of component docs: when to use, do and don't.
 */

export function Lead({ children }: { children: ReactNode }) {
  return <p className="docs-lead max-w-3xl">{children}</p>;
}

export function DoDont({ tone, title, children }: { tone: "do" | "dont"; title: string; children: ReactNode }) {
  const isDo = tone === "do";
  return (
    <div
      className={
        isDo
          ? "flex flex-1 flex-col gap-3 rounded-surface border border-success-border bg-success-subtle p-4"
          : "flex flex-1 flex-col gap-3 rounded-surface border border-destructive-border bg-destructive-subtle p-4"
      }
    >
      <div className={isDo ? "flex items-center gap-2 text-success-text" : "flex items-center gap-2 text-destructive-text"}>
        {isDo ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
        <strong className="text-body font-semibold">{isDo ? "Do" : "Don't"}</strong>
      </div>
      <div className="sb-unstyled flex min-h-16 items-center justify-center rounded-control border border-line bg-surface p-4">{children}</div>
      <p className="text-body text-fg">{title}</p>
    </div>
  );
}

export function DoDontRow({ children }: { children: ReactNode }) {
  return <div className="docs-row flex flex-col gap-4 sm:flex-row">{children}</div>;
}

export function Card({ title, children, href }: { title: string; children: ReactNode; href?: string }) {
  const body = (
    <div className="flex h-full flex-col gap-1.5 rounded-surface border border-line bg-surface p-4 transition-colors hover:bg-surface-hover">
      <strong className="text-body font-semibold text-fg">{title}</strong>
      <span className="text-body text-fg-secondary">{children}</span>
    </div>
  );
  return href ? (
    <a href={href} target="_top" className="docs-card">
      {body}
    </a>
  ) : (
    body
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Tiers() {
  const tiers = [
    { n: "1", name: "Primitive", ex: "--primitive-blue-600", who: "Raw palette. Only semantic tokens may use it." },
    { n: "2", name: "Semantic", ex: "--bg-surface, --text-secondary", who: "Purpose-named, resolved per theme. What pages and components use." },
    { n: "3", name: "Component", ex: "--button-primary-bg-hover", who: "Tuning knobs for one component. Point at semantic tokens." },
  ];
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-3">
      {tiers.map((t) => (
        <div key={t.n} className="flex flex-col gap-2 rounded-surface border border-line bg-surface p-4">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-caption font-semibold text-fg-inverse">
            {t.n}
          </span>
          <strong className="text-body font-semibold text-fg">{t.name}</strong>
          <code className="font-mono text-caption text-fg-secondary">{t.ex}</code>
          <span className="text-body text-fg-secondary">{t.who}</span>
        </div>
      ))}
    </div>
  );
}
