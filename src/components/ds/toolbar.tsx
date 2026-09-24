import type { ReactNode } from "react";

export function Toolbar({ children, meta }: { children: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {meta && <span className="ml-auto text-body text-fg-secondary">{meta}</span>}
    </div>
  );
}
