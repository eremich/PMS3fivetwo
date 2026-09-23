"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import {
  categoryLabel,
  formatDateTime,
  fullName,
  getEpisodeForTask,
  getPatientForEpisode,
  isTaskOpen,
} from "@/lib/patient-helpers";
import type { Priority, TaskStatus } from "@/lib/types";
import { PriorityBadge, TaskStatusBadge } from "@/components/status-badge";
import { PatientAvatar } from "@/components/patient-avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";

const PRIORITY_ORDER: Record<Priority, number> = { RED_FLAG: 0, URGENT: 1, ROUTINE: 2 };
const PRIORITY_FILTERS: { label: string; value: Priority | "ALL" }[] = [
  { label: "All priorities", value: "ALL" },
  { label: "Red flag", value: "RED_FLAG" },
  { label: "Urgent", value: "URGENT" },
];

const STATUS_OPTIONS: { label: string; value: TaskStatus | "ALL" }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Reactivate pending", value: "REACTIVATE_PENDING" },
  { label: "Complete", value: "COMPLETE" },
  { label: "No longer required", value: "NO_LONGER_REQUIRED" },
  { label: "Created in error", value: "CREATED_IN_ERROR" },
];

export function TasksClient() {
  const { currentUser, bookingTasks, episodes, patients, staffUsers } = useAppData();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibleTasks = useMemo(() => {
    if (currentUser.role !== "CONSULTANT") return bookingTasks;
    return bookingTasks.filter((t) => t.assignedConsultantId === currentUser.id);
  }, [bookingTasks, currentUser]);

  const rows = useMemo(() => {
    return visibleTasks.map((task) => {
      const episode = getEpisodeForTask(episodes, task);
      const patient = getPatientForEpisode(patients, episode);
      const consultant = staffUsers.find((u) => u.id === task.assignedConsultantId);
      return { task, patient, consultant };
    });
  }, [visibleTasks, episodes, patients, staffUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter(({ task, patient }) => {
        if (q && !(patient && fullName(patient).toLowerCase().includes(q))) return false;
        if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
        if (priorityFilter !== "ALL" && task.priority !== priorityFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const aOpen = isTaskOpen(a.task.status) ? 0 : 1;
        const bOpen = isTaskOpen(b.task.status) ? 0 : 1;
        if (aOpen !== bOpen) return aOpen - bOpen;
        const pa = PRIORITY_ORDER[a.task.priority];
        const pb = PRIORITY_ORDER[b.task.priority];
        if (pa !== pb) return pa - pb;
        return new Date(b.task.updatedAt).getTime() - new Date(a.task.updatedAt).getTime();
      });
  }, [rows, query, statusFilter, priorityFilter]);

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDialogOpen(true);
  };

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId) return;
    if (bookingTasks.some((t) => t.id === highlightId)) openTask(highlightId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-[28px] leading-9 font-bold tracking-tight text-balance">Booking tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.role === "CONSULTANT" ? "Tasks assigned to you." : "Every booking task across the clinic."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient name"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "ALL")}>
          <SelectTrigger className="w-48">
            <SelectValue>
              {(value: TaskStatus | "ALL") => STATUS_OPTIONS.find((s) => s.value === value)?.label ?? "All statuses"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {PRIORITY_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setPriorityFilter(f.value)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              priorityFilter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-secondary/60",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">
          Showing {filtered.length} of {rows.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">No tasks match these filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Patient</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Priority</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Consultant</th>
                <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(({ task, patient, consultant }) => (
                <tr
                  key={task.id}
                  onClick={() => openTask(task.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-secondary/50",
                    !isTaskOpen(task.status) && "opacity-60",
                  )}
                >
                  <td className="px-4 py-3.5 font-semibold">
                    <div className="flex items-center gap-3">
                      {patient && <PatientAvatar name={fullName(patient)} />}
                      {patient ? fullName(patient) : "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{categoryLabel(task.category)}</td>
                  <td className="px-4 py-3.5">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{consultant?.name ?? "—"}</td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">{formatDateTime(task.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TaskDetailDialog taskId={selectedTaskId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
