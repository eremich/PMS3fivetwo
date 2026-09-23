import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  emphasis,
  className,
}: {
  label: string;
  value: string | number;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border px-4 py-4",
        emphasis ? "border-transparent bg-primary px-5 text-primary-foreground" : "border-border bg-card",
        className,
      )}
    >
      <span className={cn("text-caption font-medium", emphasis ? "opacity-90" : "text-muted-foreground")}>{label}</span>
      <span className={cn("mt-3 tabular-nums", emphasis ? "text-h1" : "text-h2")}>{value}</span>
    </div>
  );
}
