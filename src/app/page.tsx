"use client";

import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import { TaskStatusBadge, PriorityBadge } from "@/components/ds/status-badge";
import { PatientAvatar } from "@/components/ds/patient-avatar";
import { PageHeader } from "@/components/ds/page-header";
import { StatTile } from "@/components/ds/stat-tile";
import { TableCard } from "@/components/ds/table-card";
import { categoryLabel } from "@/lib/patient-helpers";
import type { TaskStatus } from "@/lib/types";

const statusOrder: TaskStatus[] = [
  "PENDING",
  "SCHEDULED",
  "REACTIVATE_PENDING",
  "COMPLETE",
  "NO_LONGER_REQUIRED",
  "CREATED_IN_ERROR",
];

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pending",
  SCHEDULED: "Scheduled",
  REACTIVATE_PENDING: "Reactivate pending",
  COMPLETE: "Complete",
  NO_LONGER_REQUIRED: "No longer required",
  CREATED_IN_ERROR: "Created in error",
};

export default function DashboardPage() {
  const { currentUser, bookingTasks, patients, episodes } = useAppData();

  const visibleTasks =
    currentUser.role === "CONSULTANT"
      ? bookingTasks.filter((t) => t.assignedConsultantId === currentUser.id)
      : bookingTasks;

  const activeTasks = visibleTasks.filter(
    (t) => t.status !== "COMPLETE" && t.status !== "NO_LONGER_REQUIRED" && t.status !== "CREATED_IN_ERROR",
  );

  const counts = statusOrder.reduce<Record<TaskStatus, number>>((acc, status) => {
    acc[status] = visibleTasks.filter((t) => t.status === status).length;
    return acc;
  }, {} as Record<TaskStatus, number>);

  const needsAttention = visibleTasks
    .filter((t) => (t.priority === "RED_FLAG" || t.priority === "URGENT") && t.status !== "COMPLETE")
    .sort((a, b) => (a.priority === "RED_FLAG" ? -1 : 1))
    .slice(0, 6);

  const patientName = (episodeOfCareId: string) => {
    const episode = episodes.find((e) => e.id === episodeOfCareId);
    const patient = patients.find((p) => p.id === episode?.patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient";
  };

  const isConsultant = currentUser.role === "CONSULTANT";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title={isConsultant ? `Your clinic, ${currentUser.name}` : "Overview"}
        description={isConsultant ? "Tasks and appointments assigned to you." : "Booking tasks across every episode of care."}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Active tasks" value={activeTasks.length} emphasis className="col-span-2 sm:col-span-1 lg:col-span-2" />
        {statusOrder.map((status) => (
          <StatTile key={status} label={statusLabels[status]} value={counts[status]} />
        ))}
      </div>

      <TableCard>
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-warning" aria-hidden="true" />
            <h2 className="text-h4">Needs attention</h2>
          </div>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-body font-semibold text-primary-text transition-colors hover:opacity-80"
          >
            View all tasks
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        {needsAttention.length === 0 ? (
          <p className="px-5 py-8 text-center text-body text-muted-foreground">Nothing urgent right now.</p>
        ) : (
          <ul className="divide-y divide-border">
            {needsAttention.map((task) => {
              const name = patientName(task.episodeOfCareId);
              return (
                <li key={task.id}>
                  <Link
                    href={`/tasks?highlight=${task.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 interactive-row"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <PatientAvatar name={name} />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">{name}</span>
                        <span className="text-caption text-muted-foreground">{categoryLabel(task.category)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </TableCard>
    </div>
  );
}
