"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  activityLog as seedActivityLog,
  appointments as seedAppointments,
  billingRecords as seedBillingRecords,
  bookingTasks as seedBookingTasks,
  episodes as seedEpisodes,
  patients as seedPatients,
  results as seedResults,
  serviceRequestForms as seedForms,
  staffUsers,
} from "./mock-data";
import { formatDateTime, generateMrn, TESTS_CONFIRMED_ACTION } from "./patient-helpers";
import type {
  ActivityLogEntry,
  Appointment,
  BillingRecord,
  BookingTask,
  EpisodeOfCare,
  Patient,
  Priority,
  ReferralCategory,
  ResultRecord,
  ServiceRequestForm,
  StaffUser,
  TaskStatus,
} from "./types";

interface NewPatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
}

interface NewEpisodeInput {
  patientId: string;
  category: ReferralCategory;
  priority: Priority;
}

interface NewTaskInput {
  episodeOfCareId: string;
  category: ReferralCategory;
  priority: Priority;
}

interface ScheduleAppointmentInput {
  bookingTaskId: string;
  scheduledAt: string;
  location?: string;
}

interface AddServiceRequestFormInput {
  bookingTaskId: string;
  capturedBy: ServiceRequestForm["capturedBy"];
  fields: Record<string, string>;
}

interface AddBillingRecordInput {
  episodeOfCareId: string;
  paymentType: BillingRecord["paymentType"];
  amount: number;
  insurerName?: string;
}

interface AppDataState {
  currentUser: StaffUser;
  staffUsers: StaffUser[];
  patients: Patient[];
  episodes: EpisodeOfCare[];
  bookingTasks: BookingTask[];
  appointments: Appointment[];
  serviceRequestForms: ServiceRequestForm[];
  results: ResultRecord[];
  activityLog: ActivityLogEntry[];
  billingRecords: BillingRecord[];
  setCurrentUser: (user: StaffUser) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, actorId: string, details?: string) => void;
  addPatient: (input: NewPatientInput) => Patient;
  addEpisode: (input: NewEpisodeInput) => EpisodeOfCare;
  addTask: (input: NewTaskInput, actorId: string, details?: string) => BookingTask;
  scheduleAppointment: (input: ScheduleAppointmentInput, actorId: string) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: Appointment["status"], actorId: string) => void;
  addServiceRequestForm: (input: AddServiceRequestFormInput, actorId: string) => ServiceRequestForm;
  confirmTestsCarriedOut: (bookingTaskId: string, actorId: string) => void;
  addResult: (bookingTaskId: string, actorId: string) => ResultRecord;
  updateResultStatus: (resultId: string, status: ResultRecord["status"], actorId: string) => void;
  addBillingRecord: (input: AddBillingRecordInput) => BillingRecord;
}

const AppDataContext = createContext<AppDataState | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StaffUser>(staffUsers[0]);
  const [patients, setPatients] = useState<Patient[]>(seedPatients);
  const [episodes, setEpisodes] = useState<EpisodeOfCare[]>(seedEpisodes);
  const [bookingTasks, setBookingTasks] = useState<BookingTask[]>(seedBookingTasks);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [serviceRequestForms, setServiceRequestForms] = useState<ServiceRequestForm[]>(seedForms);
  const [results, setResults] = useState<ResultRecord[]>(seedResults);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(seedBillingRecords);
  const [activityLogEntries, setActivityLogEntries] = useState<ActivityLogEntry[]>(seedActivityLog);

  const logActivity = (bookingTaskId: string, action: string, actorId: string, details?: string) => {
    setActivityLogEntries((prev) => [
      ...prev,
      {
        id: `log-${crypto.randomUUID()}`,
        bookingTaskId,
        action,
        changedById: actorId,
        changedAt: new Date().toISOString(),
        details,
      },
    ]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, actorId: string, details?: string) => {
    const now = new Date().toISOString();
    setBookingTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status, updatedAt: now } : task)),
    );
    logActivity(taskId, `STATUS_CHANGED_TO_${status}`, actorId, details);
  };

  const addPatient = (input: NewPatientInput): Patient => {
    const patient: Patient = {
      id: `p-${crypto.randomUUID()}`,
      mrn: generateMrn(patients),
      ...input,
    };
    setPatients((prev) => [...prev, patient]);
    return patient;
  };

  const addEpisode = (input: NewEpisodeInput): EpisodeOfCare => {
    const now = new Date().toISOString();
    const episode: EpisodeOfCare = {
      id: `e-${crypto.randomUUID()}`,
      patientId: input.patientId,
      referralReceivedAt: now,
    };
    setEpisodes((prev) => [...prev, episode]);
    setBookingTasks((prev) => [
      ...prev,
      {
        id: `t-${crypto.randomUUID()}`,
        episodeOfCareId: episode.id,
        category: input.category,
        status: "PENDING",
        priority: input.priority,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    return episode;
  };

  // A further test or appointment inside an existing episode (the flow's "Yes → Create Task" loop).
  const addTask = (input: NewTaskInput, actorId: string, details?: string): BookingTask => {
    const now = new Date().toISOString();
    const task: BookingTask = {
      id: `t-${crypto.randomUUID()}`,
      episodeOfCareId: input.episodeOfCareId,
      category: input.category,
      status: "PENDING",
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };
    setBookingTasks((prev) => [...prev, task]);
    logActivity(task.id, "TASK_CREATED", actorId, details);
    return task;
  };

  const scheduleAppointment = (input: ScheduleAppointmentInput, actorId: string): Appointment => {
    const appointment: Appointment = {
      id: `a-${crypto.randomUUID()}`,
      bookingTaskId: input.bookingTaskId,
      scheduledAt: input.scheduledAt,
      location: input.location,
      status: "BOOKED",
    };
    setAppointments((prev) => [...prev, appointment]);
    setBookingTasks((prev) =>
      prev.map((task) =>
        task.id === input.bookingTaskId
          ? { ...task, status: "SCHEDULED", updatedAt: new Date().toISOString() }
          : task,
      ),
    );
    logActivity(
      input.bookingTaskId,
      "APPOINTMENT_SCHEDULED",
      actorId,
      `${formatDateTime(input.scheduledAt)}${input.location ? ` · ${input.location}` : ""}`,
    );
    return appointment;
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment["status"], actorId: string) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status } : a)));
    if (appointment) {
      logActivity(appointment.bookingTaskId, `APPOINTMENT_${status}`, actorId);
    }
  };

  const addServiceRequestForm = (input: AddServiceRequestFormInput, actorId: string): ServiceRequestForm => {
    const form: ServiceRequestForm = {
      id: `f-${crypto.randomUUID()}`,
      bookingTaskId: input.bookingTaskId,
      capturedBy: input.capturedBy,
      fields: input.fields,
    };
    setServiceRequestForms((prev) => [...prev, form]);
    logActivity(input.bookingTaskId, "REFERRAL_FORM_ADDED", actorId);
    return form;
  };

  const confirmTestsCarriedOut = (bookingTaskId: string, actorId: string) => {
    logActivity(bookingTaskId, TESTS_CONFIRMED_ACTION, actorId, "Logged for the activity report (billing)");
  };

  const addResult = (bookingTaskId: string, actorId: string): ResultRecord => {
    const result: ResultRecord = {
      id: `r-${crypto.randomUUID()}`,
      bookingTaskId,
      status: "RECEIVED",
      receivedAt: new Date().toISOString(),
    };
    setResults((prev) => [...prev, result]);
    logActivity(bookingTaskId, "RESULT_RECEIVED", actorId);
    return result;
  };

  const updateResultStatus = (resultId: string, status: ResultRecord["status"], actorId: string) => {
    const result = results.find((r) => r.id === resultId);
    const now = new Date().toISOString();
    setResults((prev) =>
      prev.map((r) =>
        r.id === resultId ? { ...r, status, sentToReferrerAt: status === "SENT_TO_REFERRER" ? now : r.sentToReferrerAt } : r,
      ),
    );
    if (result) {
      logActivity(result.bookingTaskId, `RESULT_${status}`, actorId);
    }
  };

  const addBillingRecord = (input: AddBillingRecordInput): BillingRecord => {
    const record: BillingRecord = {
      id: `b-${crypto.randomUUID()}`,
      episodeOfCareId: input.episodeOfCareId,
      paymentType: input.paymentType,
      amount: input.amount,
      status: input.paymentType === "SELF_PAY" ? "PAID" : "INVOICED",
      insurerName: input.paymentType === "INSURER" ? input.insurerName : undefined,
      compiledAt: new Date().toISOString(),
    };
    setBillingRecords((prev) => [...prev, record]);
    return record;
  };

  const value = useMemo<AppDataState>(
    () => ({
      currentUser,
      staffUsers,
      patients,
      episodes,
      bookingTasks,
      appointments,
      serviceRequestForms,
      results,
      activityLog: activityLogEntries,
      billingRecords,
      setCurrentUser,
      updateTaskStatus,
      addPatient,
      addEpisode,
      addTask,
      scheduleAppointment,
      updateAppointmentStatus,
      addServiceRequestForm,
      confirmTestsCarriedOut,
      addResult,
      updateResultStatus,
      addBillingRecord,
    }),
    [
      currentUser,
      patients,
      episodes,
      bookingTasks,
      appointments,
      serviceRequestForms,
      results,
      billingRecords,
      activityLogEntries,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
