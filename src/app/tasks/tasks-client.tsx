"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { PriorityBadge, TaskStatusBadge } from "@/components/ds/status-badge";
import { PatientAvatar } from "@/components/ds/patient-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ds/page-header";
import { Toolbar } from "@/components/ds/toolbar";
import { SearchInput } from "@/components/ds/search-input";
import { FilterChip } from "@/components/ds/filter-chip";
import { TableCard } from "@/components/ds/table-card";
import { EmptyState } from "@/components/ds/empty-state";
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
  const highlightId = searchParams.get("highlight");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(highlightId);
  const [dialogOpen, setDialogOpen] = useState(Boolean(highlightId));

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


  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Booking tasks"
        description={currentUser.role === "CONSULTANT" ? "Tasks assigned to you." : "Every booking task across the clinic."}
      />

      <Toolbar meta={`Showing ${filtered.length} of ${rows.length}`}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by patient name" />
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
          <FilterChip key={f.value} active={priorityFilter === f.value} onClick={() => setPriorityFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState message="No tasks match these filters." />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Patient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden md:table-cell">Consultant</TableHead>
                <TableHead className="hidden lg:table-cell">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ task, patient, consultant }) => (
                <TableRow
                  key={task.id}
                  onClick={() => openTask(task.id)}
                  className={cn(!isTaskOpen(task.status) && "opacity-60")}
                >
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      {patient && <PatientAvatar name={fullName(patient)} />}
                      {patient ? fullName(patient) : "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="text-fg-secondary">{categoryLabel(task.category)}</TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="hidden text-fg-secondary md:table-cell">{consultant?.name ?? "—"}</TableCell>
                  <TableCell className="hidden text-fg-secondary lg:table-cell">{formatDateTime(task.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      )}

      <TaskDetailDialog taskId={selectedTaskId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
