import {
  ArrowUp,
  CalendarCheck,
  Check,
  CircleDot,
  Clock,
  Flag,
  Minus,
  RotateCcw,
  ScanLine,
  Send,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentKind, AppointmentStatus, BillingStatus, Priority, ResultStatus, TaskStatus } from "@/lib/types";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";
type BadgeConfig = { label: string; tone: Tone; icon: LucideIcon };

function Badge({ config, className }: { config: BadgeConfig; className?: string }) {
  const Icon = config.icon;
  return (
    <span className={cn("pill", `pill-${config.tone}`, className)}>
      <Icon className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
      {config.label}
    </span>
  );
}

const statusConfig: Record<TaskStatus, BadgeConfig> = {
  PENDING: { label: "Pending", tone: "warning", icon: Clock },
  SCHEDULED: { label: "Scheduled", tone: "info", icon: CalendarCheck },
  COMPLETE: { label: "Complete", tone: "success", icon: Check },
  REACTIVATE_PENDING: { label: "Reactivate pending", tone: "warning", icon: RotateCcw },
  NO_LONGER_REQUIRED: { label: "No longer required", tone: "neutral", icon: Minus },
  CREATED_IN_ERROR: { label: "Created in error", tone: "danger", icon: X },
};

const priorityConfig: Record<Priority, BadgeConfig> = {
  ROUTINE: { label: "Routine", tone: "neutral", icon: Minus },
  URGENT: { label: "Urgent", tone: "warning", icon: ArrowUp },
  RED_FLAG: { label: "Red flag", tone: "danger", icon: Flag },
};

const appointmentStatusConfig: Record<AppointmentStatus, BadgeConfig> = {
  BOOKED: { label: "Booked", tone: "info", icon: CalendarCheck },
  ATTENDED: { label: "Attended", tone: "success", icon: Check },
  CANCELLED: { label: "Cancelled", tone: "neutral", icon: X },
};

const appointmentKindConfig: Record<AppointmentKind, BadgeConfig> = {
  DIAGNOSTIC: { label: "Diagnostic", tone: "neutral", icon: ScanLine },
  CONSULTATION: { label: "Consultation", tone: "neutral", icon: Stethoscope },
};

const resultStatusConfig: Record<ResultStatus, BadgeConfig> = {
  RECEIVED: { label: "Result received", tone: "info", icon: CircleDot },
  SENT_TO_REFERRER: { label: "Sent to referrer", tone: "neutral", icon: Send },
  MORE_NEEDED: { label: "More results needed", tone: "warning", icon: RotateCcw },
  COMPLETE: { label: "Result complete", tone: "success", icon: Check },
};

const billingStatusConfig: Record<BillingStatus, BadgeConfig> = {
  PENDING: { label: "Pending", tone: "warning", icon: Clock },
  PAID: { label: "Paid", tone: "success", icon: Check },
  INVOICED: { label: "Invoiced", tone: "info", icon: Send },
};

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return <Badge config={statusConfig[status]} className={className} />;
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return <Badge config={priorityConfig[priority]} className={className} />;
}

export function AppointmentStatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return <Badge config={appointmentStatusConfig[status]} className={className} />;
}

export function AppointmentKindBadge({ kind, className }: { kind: AppointmentKind; className?: string }) {
  return <Badge config={appointmentKindConfig[kind]} className={className} />;
}

export function ResultStatusBadge({ status, className }: { status: ResultStatus; className?: string }) {
  return <Badge config={resultStatusConfig[status]} className={className} />;
}

export function BillingStatusBadge({ status, className }: { status: BillingStatus; className?: string }) {
  return <Badge config={billingStatusConfig[status]} className={className} />;
}

export function EpisodeStatusBadge({ status, className }: { status: "OPEN" | "CLOSED"; className?: string }) {
  const config: BadgeConfig =
    status === "OPEN"
      ? { label: "Open", tone: "info", icon: CircleDot }
      : { label: "Closed", tone: "neutral", icon: Check };
  return <Badge config={config} className={className} />;
}
