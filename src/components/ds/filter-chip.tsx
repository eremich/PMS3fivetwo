import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type FilterChipProps = Omit<ComponentProps<"button">, "type" | "onClick" | "aria-pressed"> & {
  active: boolean;
  onClick: () => void;
};

export function FilterChip({ active, onClick, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-control-md shrink-0 rounded-control border px-3 text-body font-medium transition-colors focus-ring active:translate-y-px disabled:opacity-50",
        active
          ? "border-chip-selected-border bg-chip-selected text-chip-selected-text"
          : "border-chip-border bg-chip text-chip-text hover:bg-chip-hover hover:text-chip-text-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
