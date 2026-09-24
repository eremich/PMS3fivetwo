"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/lib/app-context";
import { categoryLabel, formatDateTime, fullName, getEpisodeForTask, getPatientForEpisode } from "@/lib/patient-helpers";
import type { AppointmentStatus } from "@/lib/types";
import { AppointmentStatusBadge } from "@/components/ds/status-badge";
import { PatientAvatar } from "@/components/ds/patient-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ds/page-header";
import { Toolbar } from "@/components/ds/toolbar";
import { SearchInput } from "@/components/ds/search-input";
import { FilterChip } from "@/components/ds/filter-chip";
import { TableCard } from "@/components/ds/table-card";
import { EmptyState } from "@/components/ds/empty-state";
import { cn } from "@/lib/utils";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";

const STATUS_FILTERS: { label: string; value: AppointmentStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Booked", value: "BOOKED" },
  { label: "Attended", value: "ATTENDED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AppointmentsPage() {
  const { currentUser, appointments, bookingTasks, episodes, patients } = useAppData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rows = useMemo(() => {
    return appointments
      .map((appointment) => {
        const task = bookingTasks.find((t) => t.id === appointment.bookingTaskId) ?? null;
        const episode = task ? getEpisodeForTask(episodes, task) : null;
        const patient = getPatientForEpisode(patients, episode);
        return { appointment, task, patient };
      })
      .filter(({ task }) => task && (currentUser.role !== "CONSULTANT" || task.assignedConsultantId === currentUser.id));
  }, [appointments, bookingTasks, episodes, patients, currentUser]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter(({ appointment, patient }) => {
        if (q && !(patient && fullName(patient).toLowerCase().includes(q))) return false;
        if (statusFilter !== "ALL" && appointment.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.appointment.scheduledAt).getTime() - new Date(a.appointment.scheduledAt).getTime());
  }, [rows, query, statusFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Appointments"
        description={
          currentUser.role === "CONSULTANT" ? "Appointments for your patients." : "Every scheduled appointment across the clinic."
        }
      />

      <Toolbar meta={`Showing ${filtered.length} of ${rows.length}`}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by patient name" />
        {STATUS_FILTERS.map((f) => (
          <FilterChip key={f.value} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState message={rows.length === 0 ? "No appointments scheduled yet." : "No appointments match these filters."} />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Patient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date &amp; time</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ appointment, task, patient }) => (
                <TableRow
                  key={appointment.id}
                  onClick={() => {
                    setSelectedTaskId(task?.id ?? null);
                    setDialogOpen(true);
                  }}
                  className={cn(appointment.status === "CANCELLED" && "opacity-60")}
                >
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      {patient && <PatientAvatar name={fullName(patient)} />}
                      {patient ? fullName(patient) : "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="text-fg-secondary">{task ? categoryLabel(task.category) : "—"}</TableCell>
                  <TableCell>{formatDateTime(appointment.scheduledAt)}</TableCell>
                  <TableCell className="hidden text-fg-secondary md:table-cell">{appointment.location ?? "—"}</TableCell>
                  <TableCell>
                    <AppointmentStatusBadge status={appointment.status} />
                  </TableCell>
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
