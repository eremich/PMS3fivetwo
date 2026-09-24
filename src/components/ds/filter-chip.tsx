import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-control-md shrink-0 rounded-control border px-3 text-body font-medium transition-colors duration-150 ease-out focus-ring active:translate-y-px",
        active
          ? "border-primary bg-primary-subtle text-fg-link"
          : "border-line-strong bg-surface text-fg-secondary hover:bg-surface-hover hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
