"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import { categoryLabel, formatDateTime, fullName, getEpisodeForTask, getPatientForEpisode } from "@/lib/patient-helpers";
import type { AppointmentStatus } from "@/lib/types";
import { AppointmentStatusBadge } from "@/components/status-badge";
import { PatientAvatar } from "@/components/patient-avatar";
import { Input } from "@/components/ui/input";
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
      <div>
        <h1 className="text-[28px] leading-9 font-bold tracking-tight text-balance">Appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.role === "CONSULTANT" ? "Appointments for your patients." : "Every scheduled appointment across the clinic."}
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
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              statusFilter === f.value
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
          <p className="text-sm text-muted-foreground">
            {rows.length === 0 ? "No appointments scheduled yet." : "No appointments match these filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Patient</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Date &amp; time</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Location</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(({ appointment, task, patient }) => (
                <tr
                  key={appointment.id}
                  onClick={() => {
                    setSelectedTaskId(task?.id ?? null);
                    setDialogOpen(true);
                  }}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-secondary/50",
                    appointment.status === "CANCELLED" && "opacity-60",
                  )}
                >
                  <td className="px-4 py-3.5 font-semibold">
                    <div className="flex items-center gap-3">
                      {patient && <PatientAvatar name={fullName(patient)} />}
                      {patient ? fullName(patient) : "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{task ? categoryLabel(task.category) : "—"}</td>
                  <td className="px-4 py-3.5">{formatDateTime(appointment.scheduledAt)}</td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{appointment.location ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
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
