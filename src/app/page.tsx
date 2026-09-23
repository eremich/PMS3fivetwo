"use client";

import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import { TaskStatusBadge, PriorityBadge } from "@/components/status-badge";
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <h1 className="text-[28px] leading-9 font-bold tracking-tight text-balance">
          {currentUser.role === "CONSULTANT" ? `Your clinic, ${currentUser.name}` : "Overview"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.role === "CONSULTANT"
            ? "Tasks and appointments assigned to you."
            : "Booking tasks across every episode of care."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 flex flex-col justify-between rounded-xl bg-primary px-5 py-4 text-primary-foreground sm:col-span-1 lg:col-span-2">
          <span className="text-sm font-medium opacity-90">Active tasks</span>
          <span className="mt-3 text-4xl font-semibold tabular-nums">{activeTasks.length}</span>
        </div>
        {statusOrder.map((status) => (
          <div
            key={status}
            className="flex flex-col justify-between rounded-xl border border-border bg-card px-4 py-4"
          >
            <span className="text-xs font-medium text-muted-foreground">{statusLabels[status]}</span>
            <span className="mt-3 text-2xl font-semibold tabular-nums text-card-foreground">
              {counts[status]}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-warning" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Needs attention</h2>
          </div>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:opacity-80"
          >
            View all tasks
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        {needsAttention.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Nothing urgent right now.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {needsAttention.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks?highlight=${task.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/60"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{patientName(task.episodeOfCareId)}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.category.charAt(0) + task.category.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
