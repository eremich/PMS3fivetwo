import type { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function RadioCard({ id, value, children }: { id: string; value: string; children: ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 rounded-control border border-line-strong bg-surface px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-surface-hover has-data-[checked]:border-primary has-data-[checked]:bg-primary-subtle has-data-[checked]:hover:bg-primary-subtle-hover"
    >
      <RadioGroupItem id={id} value={value} />
      {children}
    </label>
  );
}
