"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, Clock, Receipt } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import {
  calculateAge,
  categoryLabel,
  formatDate,
  formatDateTime,
  fullName,
  getEpisodeStatus,
  getEpisodeTasks,
  getPatientEpisodes,
  getPatientTasks,
  getTaskAppointment,
  getTaskResult,
  hasCompletedTask,
  isEpisodeBillable,
  isTaskOpen,
} from "@/lib/patient-helpers";
import { Button } from "@/components/ui/button";
import { BillingStatusBadge, EpisodeStatusBadge, PriorityBadge, TaskStatusBadge } from "@/components/ds/status-badge";
import { NewEpisodeDialog } from "@/components/patients/new-episode-dialog";
import { BillingDialog } from "@/components/patients/billing-dialog";
import { cn } from "@/lib/utils";

const resultStatusLabels: Record<string, string> = {
  RECEIVED: "Result received",
  SENT_TO_REFERRER: "Sent to referrer",
  MORE_NEEDED: "More results needed",
  COMPLETE: "Result complete",
};

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const { currentUser, patients, episodes, bookingTasks, appointments, results, billingRecords, activityLog } = useAppData();
  const [newEpisodeOpen, setNewEpisodeOpen] = useState(false);
  const [highlightedEpisodeId, setHighlightedEpisodeId] = useState<string | null>(null);
  const [billingEpisodeId, setBillingEpisodeId] = useState<string | null>(null);
  const episodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const patient = patients.find((p) => p.id === patientId);
  const canCreate = currentUser.role === "ADMIN" || currentUser.role === "SECRETARY";
  const isAdmin = currentUser.role === "ADMIN";

  if (!patient) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <h1 className="text-h3">Patient not found</h1>
        <p className="text-body text-fg-secondary">This patient record doesn&apos;t exist.</p>
        <Button variant="outline" className="mt-2" nativeButton={false} render={<Link href="/patients" />}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to patients
        </Button>
      </div>
    );
  }

  const patientTasks = getPatientTasks(bookingTasks, episodes, patientId);
  const inClinic = currentUser.role !== "CONSULTANT" || patientTasks.some((t) => t.assignedConsultantId === currentUser.id);

  if (!inClinic) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <h1 className="text-h3">Not in your clinic</h1>
        <p className="text-body text-fg-secondary">This patient isn&apos;t assigned to your care.</p>
        <Button variant="outline" className="mt-2" nativeButton={false} render={<Link href="/patients" />}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to patients
        </Button>
      </div>
    );
  }

  const patientEpisodes = getPatientEpisodes(episodes, patientId);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link href="/patients" className="flex w-fit items-center gap-1.5 text-body text-fg-secondary transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to patients
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-balance">{fullName(patient)}</h1>
          <p className="mt-1 text-body text-fg-secondary">
            {patient.mrn} · {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)}){" "}
            {patient.phone && <>· {patient.phone}</>} {patient.email && <>· {patient.email}</>}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setNewEpisodeOpen(true)}>
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            New episode
          </Button>
        )}
      </div>

      {patientEpisodes.length === 0 ? (
        <div className="rounded-surface border border-dashed border-line px-6 py-16 text-center">
          <p className="text-body text-fg-secondary">No referrals recorded yet.</p>
          {canCreate && (
            <Button className="mt-4" onClick={() => setNewEpisodeOpen(true)}>
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              New episode
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {patientEpisodes.map((episode) => {
            const tasks = getEpisodeTasks(bookingTasks, episode.id);
            const status = getEpisodeStatus(tasks);
            const billing = billingRecords.filter((b) => b.episodeOfCareId === episode.id);
            const billable = isEpisodeBillable(tasks, activityLog);
            const sortedTasks = [...tasks].sort((a, b) => {
              const aOpen = isTaskOpen(a.status) ? 0 : 1;
              const bOpen = isTaskOpen(b.status) ? 0 : 1;
              return aOpen - bOpen;
            });

            return (
              <div
                key={episode.id}
                className={cn(
                  "rounded-surface border border-line bg-surface",
                  highlightedEpisodeId === episode.id && "episode-highlight",
                )}
              >
                <div
                  ref={(el) => {
                    episodeRefs.current[episode.id] = el;
                  }}
                  tabIndex={-1}
                  className="flex items-center justify-between gap-3 rounded-t-surface border-b border-line px-5 py-3.5 focus-ring-inset"
                >
                  <span className="text-body font-medium">Referral received {formatDate(episode.referralReceivedAt)}</span>
                  <EpisodeStatusBadge status={status} />
                </div>
                <ul className="divide-y divide-line">
                  {sortedTasks.map((task) => {
                    const appointment = getTaskAppointment(appointments, task.id);
                    const result = getTaskResult(results, task.id);
                    const details: string[] = [];
                    if (appointment) {
                      details.push(`${appointment.status === "BOOKED" ? "Booked" : appointment.status === "ATTENDED" ? "Attended" : "Cancelled"} · ${formatDateTime(appointment.scheduledAt)}`);
                      if (appointment.location) details.push(appointment.location);
                    }
                    if (result) details.push(resultStatusLabels[result.status] ?? result.status);

                    return (
                      <li key={task.id} className={!isTaskOpen(task.status) ? "opacity-60" : undefined}>
                        <Link
                          href={`/tasks?highlight=${task.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 interactive-row"
                        >
                          <div className="flex min-w-0 flex-col">
                            <span className="text-body font-medium">{categoryLabel(task.category)}</span>
                            {details.length > 0 && (
                              <span className="text-caption text-fg-secondary">{details.join(" · ")}</span>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <TaskStatusBadge status={task.status} />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {isAdmin && billing.length > 0 && (
                  <div className="flex flex-col gap-1.5 border-t border-line px-5 py-2.5">
                    {billing.map((b) => (
                      <div key={b.id} className="flex flex-wrap items-center gap-2 text-body text-fg-secondary">
                        <span>
                          {b.paymentType === "SELF_PAY" ? "Self-pay" : `Insurer${b.insurerName ? ` (${b.insurerName})` : ""}`} · £{b.amount}
                        </span>
                        <BillingStatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
                {isAdmin && billing.length === 0 && !billable && hasCompletedTask(tasks) && (
                  <p className="flex items-center gap-1.5 border-t border-line px-5 py-3 text-caption text-fg-secondary">
                    <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                    Billing opens once the clinician confirms the tests were carried out.
                  </p>
                )}
                {isAdmin && billing.length === 0 && billable && (
                  <div className="border-t border-line px-5 py-2.5">
                    <Button variant="outline" size="sm" onClick={() => setBillingEpisodeId(episode.id)}>
                      <Receipt className="h-4 w-4" aria-hidden="true" />
                      Log billing
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <NewEpisodeDialog
        open={newEpisodeOpen}
        onOpenChange={setNewEpisodeOpen}
        patientId={patientId}
        onCreated={(episode) => {
          setHighlightedEpisodeId(episode.id);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = episodeRefs.current[episode.id];
              el?.focus();
              el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
          });
        }}
      />

      {billingEpisodeId && (
        <BillingDialog
          open={!!billingEpisodeId}
          onOpenChange={(next) => !next && setBillingEpisodeId(null)}
          episodeOfCareId={billingEpisodeId}
        />
      )}
    </div>
  );
}
