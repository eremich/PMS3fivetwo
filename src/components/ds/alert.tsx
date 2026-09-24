import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

// Static class strings so Tailwind can see them; every colour is a feedback token.
const TONES: Record<Tone, { icon: LucideIcon; box: string; iconColor: string; role: "alert" | "status" }> = {
  info: { icon: Info, box: "border-info-border bg-info-subtle", iconColor: "text-info", role: "status" },
  success: { icon: CircleCheck, box: "border-success-border bg-success-subtle", iconColor: "text-success", role: "status" },
  warning: { icon: TriangleAlert, box: "border-warning-border bg-warning-subtle", iconColor: "text-warning", role: "alert" },
  danger: { icon: CircleAlert, box: "border-destructive-border bg-destructive-subtle", iconColor: "text-destructive", role: "alert" },
};

/**
 * Form- or page-level message. For an error on one field use Text field's `error` instead.
 * Warning and danger are announced immediately (role="alert"); info and success politely.
 */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, box, iconColor, role } = TONES[tone];
  return (
    <div role={role} className={cn("flex items-start gap-2.5 rounded-control border px-3 py-2.5 text-body text-fg", box, className)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconColor)} aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-0.5">
        {title && <strong className="font-semibold">{title}</strong>}
        <span>{children}</span>
      </div>
    </div>
  );
}
