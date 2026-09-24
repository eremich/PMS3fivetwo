"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, UserPlus } from "lucide-react";
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
import { PriorityBadge } from "@/components/ds/status-badge";
import { PatientAvatar } from "@/components/ds/patient-avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ds/page-header";
import { Toolbar } from "@/components/ds/toolbar";
import { SearchInput } from "@/components/ds/search-input";
import { FilterChip } from "@/components/ds/filter-chip";
import { TableCard } from "@/components/ds/table-card";
import { EmptyState } from "@/components/ds/empty-state";
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

  const emptyMessage =
    currentUser.role === "CONSULTANT" && rows.length === 0
      ? "No patients are assigned to you yet."
      : query
        ? `No patients match "${query}".`
        : "No patients match these filters.";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Patients"
        description={currentUser.role === "CONSULTANT" ? "Patients under your care." : "Every patient across the clinic."}
        actions={
          canCreate && (
            <Button onClick={() => setRegisterOpen(true)}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Register patient
            </Button>
          )
        }
      />

      <Toolbar meta={`Showing ${filtered.length} of ${rows.length}`}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, MRN, date of birth, or phone"
          autoFocus
        />
        <FilterChip active={openOnly} onClick={() => setOpenOnly((v) => !v)}>
          Open tasks only
        </FilterChip>
        {PRIORITY_FILTERS.map((f) => (
          <FilterChip key={f.value} active={priorityFilter === f.value} onClick={() => setPriorityFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState
          message={emptyMessage}
          action={
            canCreate && query ? (
              <Button onClick={() => setRegisterOpen(true)}>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Register &quot;{query}&quot;
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <TableCard className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Patient</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Open tasks</TableHead>
                  <TableHead>Next appointment</TableHead>
                  <TableHead>DOB (age)</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Latest referral</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ patient, openTaskCount, highestPriority, nextAppointment, latestReferral }) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    tabIndex={-1}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={fullName(patient)} />
                        <div className="min-w-0">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="font-semibold hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {fullName(patient)}
                          </Link>
                          <div className="text-caption whitespace-nowrap text-fg-secondary">{patient.mrn}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {highestPriority ? <PriorityBadge priority={highestPriority} /> : <span className="text-fg-secondary">—</span>}
                    </TableCell>
                    <TableCell className="tabular-nums">{openTaskCount}</TableCell>
                    <TableCell>
                      {nextAppointment ? formatDate(nextAppointment.scheduledAt) : <span className="text-fg-secondary">—</span>}
                    </TableCell>
                    <TableCell className="text-fg-secondary">
                      {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)})
                    </TableCell>
                    <TableCell className="hidden text-fg-secondary lg:table-cell">{patient.phone ?? patient.email ?? "—"}</TableCell>
                    <TableCell className="hidden text-fg-secondary lg:table-cell">
                      {latestReferral ? formatDate(latestReferral) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCard>

          <TableCard className="md:hidden">
            <ul className="divide-y divide-line">
              {filtered.map(({ patient, openTaskCount, highestPriority }) => (
                <li key={patient.id}>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 interactive-row"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <PatientAvatar name={fullName(patient)} />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">{fullName(patient)}</span>
                        <span className="text-caption text-fg-secondary">
                          {patient.mrn} · {openTaskCount} open
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {highestPriority && <PriorityBadge priority={highestPriority} />}
                      <ChevronRight className="h-4 w-4 text-fg-secondary" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </TableCard>
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
