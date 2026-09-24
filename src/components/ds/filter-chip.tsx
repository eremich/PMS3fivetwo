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
        "h-10 shrink-0 rounded-lg border px-3 text-body font-medium transition-colors duration-150 ease-out focus-ring active:translate-y-px",
        active
          ? "border-primary bg-primary/10 text-primary-text"
          : "border-input bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
