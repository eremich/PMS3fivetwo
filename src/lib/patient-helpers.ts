import type {
  ActivityLogEntry,
  Appointment,
  AppointmentKind,
  BookingTask,
  EpisodeOfCare,
  Patient,
  Priority,
  ReferralCategory,
  ResultRecord,
  TaskStatus,
} from "./types";

const OPEN_STATUSES: TaskStatus[] = ["PENDING", "SCHEDULED", "REACTIVATE_PENDING"];
const PRIORITY_RANK: Record<Priority, number> = { RED_FLAG: 2, URGENT: 1, ROUTINE: 0 };

export function isTaskOpen(status: TaskStatus): boolean {
  return OPEN_STATUSES.includes(status);
}

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function getPatientEpisodes(episodes: EpisodeOfCare[], patientId: string): EpisodeOfCare[] {
  return episodes
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => new Date(b.referralReceivedAt).getTime() - new Date(a.referralReceivedAt).getTime());
}

export function getEpisodeTasks(bookingTasks: BookingTask[], episodeId: string): BookingTask[] {
  return bookingTasks.filter((t) => t.episodeOfCareId === episodeId);
}

export function getEpisodeStatus(tasks: BookingTask[]): "OPEN" | "CLOSED" {
  return tasks.some((t) => isTaskOpen(t.status)) ? "OPEN" : "CLOSED";
}

export function hasCompletedTask(tasks: BookingTask[]): boolean {
  return tasks.some((t) => t.status === "COMPLETE");
}

export function getHighestOpenPriority(tasks: BookingTask[]): Priority | null {
  const openTasks = tasks.filter((t) => isTaskOpen(t.status));
  if (openTasks.length === 0) return null;
  return openTasks.reduce<Priority>(
    (highest, t) => (PRIORITY_RANK[t.priority] > PRIORITY_RANK[highest] ? t.priority : highest),
    "ROUTINE",
  );
}

export function getPatientTasks(
  bookingTasks: BookingTask[],
  episodes: EpisodeOfCare[],
  patientId: string,
): BookingTask[] {
  const episodeIds = new Set(getPatientEpisodes(episodes, patientId).map((e) => e.id));
  return bookingTasks.filter((t) => episodeIds.has(t.episodeOfCareId));
}

export function getNextAppointment(
  appointments: Appointment[],
  taskIds: string[],
  now: Date = new Date(),
): Appointment | null {
  const upcoming = appointments
    .filter((a) => taskIds.includes(a.bookingTaskId) && a.status === "BOOKED" && new Date(a.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  return upcoming[0] ?? null;
}

export function getLatestReferralDate(episodes: EpisodeOfCare[]): string | null {
  if (episodes.length === 0) return null;
  return episodes.reduce(
    (latest, e) => (new Date(e.referralReceivedAt) > new Date(latest) ? e.referralReceivedAt : latest),
    episodes[0].referralReceivedAt,
  );
}

export function getTaskAppointments(appointments: Appointment[], taskId: string): Appointment[] {
  return appointments
    .filter((a) => a.bookingTaskId === taskId)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
}

export function getTaskAppointment(appointments: Appointment[], taskId: string): Appointment | null {
  return getTaskAppointments(appointments, taskId)[0] ?? null;
}

export function getTaskResults(results: ResultRecord[], taskId: string): ResultRecord[] {
  return results
    .filter((r) => r.bookingTaskId === taskId)
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export function getTaskResult(results: ResultRecord[], taskId: string): ResultRecord | null {
  return getTaskResults(results, taskId)[0] ?? null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function categoryLabel(category: string): string {
  if (category === "PATIENT") return "Patient-initiated";
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export function fullName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`;
}

export function findDuplicatePatient(
  patients: Patient[],
  firstName: string,
  lastName: string,
  dateOfBirth: string,
): Patient | null {
  return (
    patients.find(
      (p) =>
        p.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
        p.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() &&
        p.dateOfBirth === dateOfBirth,
    ) ?? null
  );
}

export function getEpisodeForTask(episodes: EpisodeOfCare[], task: BookingTask): EpisodeOfCare | null {
  return episodes.find((e) => e.id === task.episodeOfCareId) ?? null;
}

export function getPatientForEpisode(patients: Patient[], episode: EpisodeOfCare | null): Patient | null {
  if (!episode) return null;
  return patients.find((p) => p.id === episode.patientId) ?? null;
}

// Scans and tests vs seeing a consultant (the flow's "Diagnostic Appointment?" decision).
const DIAGNOSTIC_CATEGORIES: ReferralCategory[] = ["RADIOLOGY", "CARDIOLOGY", "RESPIRATORY", "PATHOLOGY"];

export function getAppointmentKind(category: ReferralCategory): AppointmentKind {
  return DIAGNOSTIC_CATEGORIES.includes(category) ? "DIAGNOSTIC" : "CONSULTATION";
}

export const TESTS_CONFIRMED_ACTION = "TESTS_CONFIRMED";

// The clinician's confirmation lives in the activity log, which feeds the billing report.
export function getTestsConfirmation(activityLog: ActivityLogEntry[], taskId: string): ActivityLogEntry | null {
  return activityLog.find((a) => a.bookingTaskId === taskId && a.action === TESTS_CONFIRMED_ACTION) ?? null;
}

export function getTaskActivityLog(activityLog: ActivityLogEntry[], taskId: string): ActivityLogEntry[] {
  return activityLog
    .filter((a) => a.bookingTaskId === taskId)
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
}

export interface ReferralFormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

const RADIOLOGY_FORM_FIELDS: ReferralFormField[] = [
  { key: "clinicalHistory", label: "IRMER clinical history", type: "textarea" },
  { key: "examRequested", label: "Exam requested", type: "text" },
  { key: "specificQuestion", label: "Specific question", type: "text" },
  { key: "referringClinician", label: "Referring clinician", type: "text" },
];

const CARDIOLOGY_FORM_FIELDS: ReferralFormField[] = [
  { key: "examType", label: "Exam type", type: "select", options: ["ECG", "Echo", "Stress", "Treadmill"] },
  { key: "medication", label: "Medication", type: "text" },
  { key: "presentingSymptoms", label: "Presenting symptoms", type: "textarea" },
  { key: "referringClinician", label: "Referring clinician", type: "text" },
];

const GENERIC_FORM_FIELDS: ReferralFormField[] = [
  { key: "clinicalHistory", label: "Reason for referral", type: "textarea" },
  { key: "referringClinician", label: "Referring clinician", type: "text" },
];

export function getReferralFormFields(category: ReferralCategory): ReferralFormField[] {
  if (category === "RADIOLOGY") return RADIOLOGY_FORM_FIELDS;
  if (category === "CARDIOLOGY") return CARDIOLOGY_FORM_FIELDS;
  return GENERIC_FORM_FIELDS;
}

export function generateMrn(existing: Patient[]): string {
  const year = new Date().getFullYear();
  const max = existing.reduce((m, p) => {
    const match = p.mrn.match(/(\d+)$/);
    const n = match ? parseInt(match[1], 10) : 0;
    return Math.max(m, n);
  }, 0);
  return `P-${year}-${String(max + 1).padStart(4, "0")}`;
}
