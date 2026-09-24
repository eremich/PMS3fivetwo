"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, ClipboardList, FlaskConical, History } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import {
  categoryLabel,
  formatDate,
  formatDateTime,
  fullName,
  getEpisodeForTask,
  getPatientForEpisode,
  getReferralFormFields,
  getTaskActivityLog,
  getTaskAppointments,
  getTaskResults,
} from "@/lib/patient-helpers";
import type { FormCaptureSource, ResultStatus, TaskStatus } from "@/lib/types";
import { AppointmentStatusBadge, PriorityBadge, ResultStatusBadge, TaskStatusBadge } from "@/components/ds/status-badge";
import { Button } from "@/components/ui/button";
import { SectionLabel, SectionPanel } from "@/components/ds/section-panel";
import { TextField } from "@/components/ds/text-field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CAPTURE_SOURCE_LABELS: Record<FormCaptureSource, string> = {
  CONSULTANT_IN_CLINIC: "Consultant, in clinic",
  STAFF_PAPER: "Staff, from paper referral",
  STAFF_SCAN: "Staff, from scanned referral",
};

const TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  PENDING: ["COMPLETE", "NO_LONGER_REQUIRED", "CREATED_IN_ERROR"],
  SCHEDULED: ["COMPLETE", "NO_LONGER_REQUIRED", "CREATED_IN_ERROR"],
  REACTIVATE_PENDING: ["PENDING", "NO_LONGER_REQUIRED"],
  COMPLETE: ["REACTIVATE_PENDING"],
  NO_LONGER_REQUIRED: ["REACTIVATE_PENDING"],
  CREATED_IN_ERROR: [],
};

const ACTION_LABELS: Record<TaskStatus, string> = {
  PENDING: "Reactivate",
  SCHEDULED: "Mark scheduled",
  COMPLETE: "Mark complete",
  REACTIVATE_PENDING: "Reactivate",
  NO_LONGER_REQUIRED: "No longer required",
  CREATED_IN_ERROR: "Created in error",
};

const ACTION_VARIANT: Record<TaskStatus, "primary" | "outline" | "destructive"> = {
  PENDING: "primary",
  SCHEDULED: "primary",
  COMPLETE: "primary",
  REACTIVATE_PENDING: "outline",
  NO_LONGER_REQUIRED: "outline",
  CREATED_IN_ERROR: "destructive",
};

function actorName(staffUsers: { id: string; name: string }[], id: string) {
  return staffUsers.find((u) => u.id === id)?.name ?? "Unknown";
}

export function TaskDetailDialog({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    currentUser,
    staffUsers,
    episodes,
    patients,
    activityLog,
    bookingTasks,
    appointments,
    serviceRequestForms,
    results,
    updateTaskStatus,
    scheduleAppointment,
    updateAppointmentStatus,
    addServiceRequestForm,
    addResult,
    updateResultStatus,
  } = useAppData();
  const [pendingAction, setPendingAction] = useState<TaskStatus | null>(null);
  const [reason, setReason] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleSubmitted, setScheduleSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [addingForm, setAddingForm] = useState(false);
  const [capturedBy, setCapturedBy] = useState<FormCaptureSource>("CONSULTANT_IN_CLINIC");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const task = bookingTasks.find((t) => t.id === taskId) ?? null;
  if (!task) return null;

  const episode = getEpisodeForTask(episodes, task);
  const patient = getPatientForEpisode(patients, episode);
  const log = getTaskActivityLog(activityLog, task.id);
  const availableActions = TRANSITIONS[task.status];
  const taskAppointments = getTaskAppointments(appointments, task.id);
  const activeAppointment = taskAppointments.find((a) => a.status !== "CANCELLED") ?? taskAppointments[0] ?? null;
  const referralForm = serviceRequestForms.find((f) => f.bookingTaskId === task.id) ?? null;
  const formFields = getReferralFormFields(task.category);
  const latestResult = getTaskResults(results, task.id)[0] ?? null;

  function resetAction() {
    setPendingAction(null);
    setReason("");
  }

  function confirmAction() {
    if (!pendingAction || !task) return;
    updateTaskStatus(task.id, pendingAction, currentUser.id, reason.trim() || undefined);
    resetAction();
  }

  function resetSchedule() {
    setScheduling(false);
    setScheduledAt("");
    setLocation("");
    setScheduleSubmitted(false);
  }

  function confirmSchedule() {
    setScheduleSubmitted(true);
    if (!task || !scheduledAt) return;
    scheduleAppointment(
      { bookingTaskId: task.id, scheduledAt: new Date(scheduledAt).toISOString(), location: location.trim() || undefined },
      currentUser.id,
    );
    resetSchedule();
  }

  function resetForm() {
    setAddingForm(false);
    setCapturedBy("CONSULTANT_IN_CLINIC");
    setFormValues({});
  }

  function confirmForm() {
    if (!task) return;
    addServiceRequestForm({ bookingTaskId: task.id, capturedBy, fields: formValues }, currentUser.id);
    resetForm();
  }

  function logResultReceived() {
    if (!task) return;
    addResult(task.id, currentUser.id);
  }

  function setResultStatus(status: ResultStatus) {
    if (!latestResult) return;
    updateResultStatus(latestResult.id, status, currentUser.id);
  }

  function markResultCompleteAndCloseTask() {
    if (!task || !latestResult) return;
    updateResultStatus(latestResult.id, "COMPLETE", currentUser.id);
    updateTaskStatus(task.id, "COMPLETE", currentUser.id, "Result reviewed — no further tests needed");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetAction();
          resetSchedule();
          resetForm();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {patient ? (
              <Link href={`/patients/${patient.id}`} className="hover:underline">
                {fullName(patient)}
              </Link>
            ) : (
              "Unknown patient"
            )}
          </DialogTitle>
          <DialogDescription>
            {categoryLabel(task.category)}
            {episode && <> · Referral received {formatDate(episode.referralReceivedAt)}</>}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {!pendingAction ? (
          availableActions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action) => (
                <Button key={action} variant={ACTION_VARIANT[action]} size="sm" onClick={() => setPendingAction(action)}>
                  {ACTION_LABELS[action]}
                </Button>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2 rounded-surface border border-line bg-surface p-4">
            <p className="text-body font-medium">{ACTION_LABELS[pendingAction]} — add a reason (optional)</p>
            <TextField
              label="Reason"
              showLabel={false}
              multiline
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What changed and why?"
              rows={2}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={resetAction}>
                Cancel
              </Button>
              <Button size="sm" onClick={confirmAction}>
                Confirm
              </Button>
            </div>
          </div>
        )}

        <SectionPanel icon={CalendarClock} title="Appointment">
          {activeAppointment && activeAppointment.status !== "CANCELLED" ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body">
                {formatDateTime(activeAppointment.scheduledAt)}
                {activeAppointment.location && <span className="text-fg-secondary"> · {activeAppointment.location}</span>}
              </p>
              <div className="flex items-center gap-2">
                <AppointmentStatusBadge status={activeAppointment.status} />
                {activeAppointment.status === "BOOKED" && (
                  <>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => updateAppointmentStatus(activeAppointment.id, "ATTENDED", currentUser.id)}
                    >
                      Mark attended
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => updateAppointmentStatus(activeAppointment.id, "CANCELLED", currentUser.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : !scheduling ? (
            <Button variant="outline" size="sm" className="w-fit" onClick={() => setScheduling(true)}>
              Schedule appointment
            </Button>
          ) : (
            <div className="flex flex-col gap-2.5">
              {activeAppointment?.status === "CANCELLED" && (
                <p className="text-caption text-fg-secondary">
                  Previous appointment cancelled — {formatDateTime(activeAppointment.scheduledAt)}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <TextField
                  label="Date & time"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  autoFocus
                  required
                  error={scheduleSubmitted && !scheduledAt ? "Choose a date and time." : undefined}
                />
                <TextField
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Imaging Suite 1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={resetSchedule}>
                  Cancel
                </Button>
                <Button size="sm" onClick={confirmSchedule}>
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </SectionPanel>

        <SectionPanel icon={FlaskConical} title="Result">
          {!latestResult ? (
            <Button variant="outline" size="sm" className="w-fit" onClick={logResultReceived}>
              Log result received
            </Button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-body text-fg-secondary">Received {formatDateTime(latestResult.receivedAt)}</p>
                <ResultStatusBadge status={latestResult.status} />
              </div>
              {latestResult.status === "RECEIVED" && (
                <Button variant="outline" size="sm" className="w-fit" onClick={() => setResultStatus("SENT_TO_REFERRER")}>
                  Send to referrer
                </Button>
              )}
              {latestResult.status === "SENT_TO_REFERRER" && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={markResultCompleteAndCloseTask}>
                    Complete — no further tests
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setResultStatus("MORE_NEEDED")}>
                    More results needed
                  </Button>
                </div>
              )}
              {latestResult.status === "MORE_NEEDED" && (
                <Button variant="outline" size="sm" className="w-fit" onClick={logResultReceived}>
                  Log next result received
                </Button>
              )}
            </div>
          )}
        </SectionPanel>

        <SectionPanel icon={ClipboardList} title="Referral form">
          {referralForm ? (
            <div className="flex flex-col gap-1.5 text-body">
              <p className="text-caption text-fg-secondary">Captured by {CAPTURE_SOURCE_LABELS[referralForm.capturedBy]}</p>
              {formFields.map(
                (field) =>
                  referralForm.fields[field.key] && (
                    <p key={field.key}>
                      <span className="text-fg-secondary">{field.label}:</span> {referralForm.fields[field.key]}
                    </p>
                  ),
              )}
            </div>
          ) : !addingForm ? (
            <Button variant="outline" size="sm" className="w-fit" onClick={() => setAddingForm(true)}>
              Add referral form
            </Button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="capturedBy">Captured by</Label>
                <Select value={capturedBy} onValueChange={(v) => setCapturedBy(v as FormCaptureSource)}>
                  <SelectTrigger id="capturedBy" className="w-full">
                    <SelectValue>{(v: FormCaptureSource) => CAPTURE_SOURCE_LABELS[v]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CAPTURE_SOURCE_LABELS) as FormCaptureSource[]).map((source) => (
                      <SelectItem key={source} value={source}>
                        {CAPTURE_SOURCE_LABELS[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formFields.map((field) =>
                field.type === "select" ? (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
                    <Select
                      value={formValues[field.key] ?? ""}
                      onValueChange={(v) => setFormValues((prev) => ({ ...prev, [field.key]: v ?? "" }))}
                    >
                      <SelectTrigger id={`field-${field.key}`} className="w-full">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`}>
                          {(v: string | null) => v ?? `Select ${field.label.toLowerCase()}`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <TextField
                    key={field.key}
                    label={field.label}
                    multiline={field.type === "textarea"}
                    rows={2}
                    value={formValues[field.key] ?? ""}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                ),
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
                <Button size="sm" onClick={confirmForm}>
                  Save form
                </Button>
              </div>
            </div>
          )}
        </SectionPanel>

        <div className="flex flex-col gap-2">
          <SectionLabel icon={History}>Activity log</SectionLabel>
          {log.length === 0 ? (
            <p className="text-body text-fg-secondary">No changes recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2.5 border-l border-line pl-3">
              {log.map((entry) => (
                <li key={entry.id} className="text-body">
                  <p>
                    <span className="font-medium">{actorName(staffUsers, entry.changedById)}</span>{" "}
                    <span className="text-fg-secondary">
                      {entry.action.replaceAll("_", " ").toLowerCase()} · {formatDateTime(entry.changedAt)}
                    </span>
                  </p>
                  {entry.details && <p className="text-fg-secondary">{entry.details}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
