import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import type { AppointmentKind, AppointmentStatus, BillingStatus, Priority, ResultStatus, TaskStatus } from "@/lib/types";
import {
  AppointmentKindBadge,
  AppointmentStatusBadge,
  BillingStatusBadge,
  EpisodeStatusBadge,
  PriorityBadge,
  ResultStatusBadge,
  TaskStatusBadge,
} from "./status-badge";

const TASK: TaskStatus[] = ["PENDING", "SCHEDULED", "COMPLETE", "REACTIVATE_PENDING", "NO_LONGER_REQUIRED", "CREATED_IN_ERROR"];
const PRIORITY: Priority[] = ["ROUTINE", "URGENT", "RED_FLAG"];
const APPOINTMENT: AppointmentStatus[] = ["BOOKED", "ATTENDED", "CANCELLED"];
const APPOINTMENT_KIND: AppointmentKind[] = ["DIAGNOSTIC", "CONSULTATION"];
const RESULT: ResultStatus[] = ["RECEIVED", "SENT_TO_REFERRER", "MORE_NEEDED", "COMPLETE"];
const BILLING: BillingStatus[] = ["PENDING", "PAID", "INVOICED"];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] items-center gap-4">
      <span className="text-caption text-fg-secondary">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const meta = { title: "Components/Status badges", tags: ["!autodocs"], parameters: { docs: { description: { component: "Soft-tinted status pill with an icon, so meaning never depends on colour alone. Tones come from the feedback tokens: info, success, warning, danger and neutral. One badge per domain: task, priority, appointment type, appointment, result, billing, episode." } } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex w-[40rem] flex-col gap-4">
      <Row label="Task status">
        {TASK.map((s) => (
          <TaskStatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Priority">
        {PRIORITY.map((s) => (
          <PriorityBadge key={s} priority={s} />
        ))}
      </Row>
      <Row label="Appointment type">
        {APPOINTMENT_KIND.map((k) => (
          <AppointmentKindBadge key={k} kind={k} />
        ))}
      </Row>
      <Row label="Appointment">
        {APPOINTMENT.map((s) => (
          <AppointmentStatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Result">
        {RESULT.map((s) => (
          <ResultStatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Billing">
        {BILLING.map((s) => (
          <BillingStatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Episode">
        <EpisodeStatusBadge status="OPEN" />
        <EpisodeStatusBadge status="CLOSED" />
      </Row>
    </div>
  ),
};
