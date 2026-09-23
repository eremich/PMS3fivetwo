import { cn } from "@/lib/utils";

const HUES = [25, 150, 205, 263, 310, 85];

function hueFor(name: string) {
  let sum = 0;
  for (const ch of name) sum = (sum * 31 + ch.charCodeAt(0)) % 997;
  return HUES[sum % HUES.length];
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter((part) => part && !part.endsWith("."))
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PatientAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: `oklch(0.5 0.13 ${hueFor(name)})` }}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold text-white",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
