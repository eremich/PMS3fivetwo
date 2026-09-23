"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, UserPlus } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import {
  calculateAge,
  fullName,
  getHighestOpenPriority,
  getLatestReferralDate,
  getNextAppointment,
  getPatientEpisodes,
  getPatientTasks,
  formatDate,
} from "@/lib/patient-helpers";
import type { Patient, Priority } from "@/lib/types";
import { PriorityBadge } from "@/components/status-badge";
import { PatientAvatar } from "@/components/patient-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RegisterPatientDialog } from "@/components/patients/register-patient-dialog";

const PRIORITY_ORDER: Record<Priority, number> = { RED_FLAG: 0, URGENT: 1, ROUTINE: 2 };
const PRIORITY_FILTERS: { label: string; value: Priority | "ALL" }[] = [
  { label: "All priorities", value: "ALL" },
  { label: "Red flag", value: "RED_FLAG" },
  { label: "Urgent", value: "URGENT" },
];

export default function PatientsPage() {
  const { currentUser, patients, episodes, bookingTasks, appointments } = useAppData();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [registerOpen, setRegisterOpen] = useState(false);

  const canCreate = currentUser.role === "ADMIN" || currentUser.role === "SECRETARY";

  const visiblePatients = useMemo(() => {
    if (currentUser.role !== "CONSULTANT") return patients;
    return patients.filter((p) =>
      getPatientTasks(bookingTasks, episodes, p.id).some((t) => t.assignedConsultantId === currentUser.id),
    );
  }, [patients, bookingTasks, episodes, currentUser]);

  const rows = useMemo(() => {
    return visiblePatients.map((patient) => {
      const patientEpisodes = getPatientEpisodes(episodes, patient.id);
      const tasks = getPatientTasks(bookingTasks, episodes, patient.id);
      const openTasks = tasks.filter((t) => t.status === "PENDING" || t.status === "SCHEDULED" || t.status === "REACTIVATE_PENDING");
      const highestPriority = getHighestOpenPriority(tasks);
      const nextAppointment = getNextAppointment(appointments, tasks.map((t) => t.id));
      const latestReferral = getLatestReferralDate(patientEpisodes);
      return { patient, openTaskCount: openTasks.length, highestPriority, nextAppointment, latestReferral };
    });
  }, [visiblePatients, episodes, bookingTasks, appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((row) => {
        if (q) {
          const matches =
            fullName(row.patient).toLowerCase().includes(q) ||
            row.patient.mrn.toLowerCase().includes(q) ||
            row.patient.phone?.toLowerCase().includes(q) ||
            row.patient.dateOfBirth.includes(q);
          if (!matches) return false;
        }
        if (openOnly && row.openTaskCount === 0) return false;
        if (priorityFilter !== "ALL" && row.highestPriority !== priorityFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const pa = a.highestPriority ? PRIORITY_ORDER[a.highestPriority] : 3;
        const pb = b.highestPriority ? PRIORITY_ORDER[b.highestPriority] : 3;
        if (pa !== pb) return pa - pb;
        const ra = a.latestReferral ?? "";
        const rb = b.latestReferral ?? "";
        return rb.localeCompare(ra);
      });
  }, [rows, query, openOnly, priorityFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-9 font-bold tracking-tight text-balance">Patients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentUser.role === "CONSULTANT" ? "Patients under your care." : "Every patient across the clinic."}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setRegisterOpen(true)}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Register patient
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, MRN, date of birth, or phone"
            className="pl-9"
            autoFocus
          />
        </div>
        <button
          type="button"
          onClick={() => setOpenOnly((v) => !v)}
          className={cn(
            "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            openOnly ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-secondary/60",
          )}
        >
          Open tasks only
        </button>
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
        <EmptyState
          query={query}
          canCreate={canCreate}
          isConsultantWithNone={currentUser.role === "CONSULTANT" && rows.length === 0}
          onRegister={() => setRegisterOpen(true)}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Patient</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Open tasks</th>
                  <th className="px-4 py-2.5 font-medium">Next appointment</th>
                  <th className="px-4 py-2.5 font-medium">DOB (age)</th>
                  <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Contact</th>
                  <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Latest referral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(({ patient, openTaskCount, highestPriority, nextAppointment, latestReferral }) => (
                  <tr
                    key={patient.id}
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    className="cursor-pointer transition-colors hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={fullName(patient)} />
                        <div className="min-w-0">
                          <Link href={`/patients/${patient.id}`} className="font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                            {fullName(patient)}
                          </Link>
                          <div className="text-xs text-muted-foreground">{patient.mrn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {highestPriority ? <PriorityBadge priority={highestPriority} /> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">{openTaskCount}</td>
                    <td className="px-4 py-3.5">
                      {nextAppointment ? formatDate(nextAppointment.scheduledAt) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)})
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">{patient.phone ?? patient.email ?? "—"}</td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">
                      {latestReferral ? formatDate(latestReferral) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked list */}
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card md:hidden">
            {filtered.map(({ patient, openTaskCount, highestPriority }) => (
              <li key={patient.id}>
                <Link
                  href={`/patients/${patient.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PatientAvatar name={fullName(patient)} />
                    <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">{fullName(patient)}</span>
                    <span className="text-xs text-muted-foreground">
                      {patient.mrn} · {openTaskCount} open
                    </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {highestPriority && <PriorityBadge priority={highestPriority} />}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <RegisterPatientDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        initialName={query}
        onRegistered={(patient) => router.push(`/patients/${patient.id}`)}
      />
    </div>
  );
}

function EmptyState({
  query,
  canCreate,
  isConsultantWithNone,
  onRegister,
}: {
  query: string;
  canCreate: boolean;
  isConsultantWithNone: boolean;
  onRegister: () => void;
}) {
  if (isConsultantWithNone) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">No patients are assigned to you yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">
        {query ? `No patients match "${query}".` : "No patients match these filters."}
      </p>
      {canCreate && query && (
        <Button className="mt-4" onClick={onRegister}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Register &quot;{query}&quot;
        </Button>
      )}
    </div>
  );
}
