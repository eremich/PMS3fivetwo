import type { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function RadioCard({ id, value, children }: { id: string; value: string; children: ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 rounded-control border border-choice-border bg-choice px-3 py-2.5 transition-colors hover:bg-choice-hover has-data-[checked]:border-choice-selected-border has-data-[checked]:bg-choice-selected has-data-[checked]:hover:bg-choice-selected-hover"
    >
      <RadioGroupItem id={id} value={value} />
      {children}
    </label>
  );
}
