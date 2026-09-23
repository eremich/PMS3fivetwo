import type { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function RadioCard({ id, value, children }: { id: string; value: string; children: ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-input bg-card px-3 py-2.5 transition-colors duration-150 ease-out has-data-[checked]:border-primary has-data-[checked]:bg-primary/5"
    >
      <RadioGroupItem id={id} value={value} />
      {children}
    </label>
  );
}
