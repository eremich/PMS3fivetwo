export type Role = "ADMIN" | "CONSULTANT" | "SECRETARY";

export interface StaffUser {
  id: string;
  name: string;
  role: Role;
  speciality?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
}

export interface EpisodeOfCare {
  id: string;
  patientId: string;
  referralReceivedAt: string;
}

export type TaskStatus =
  | "PENDING"
  | "SCHEDULED"
  | "COMPLETE"
  | "REACTIVATE_PENDING"
  | "NO_LONGER_REQUIRED"
  | "CREATED_IN_ERROR";

export type Priority = "ROUTINE" | "URGENT" | "RED_FLAG";

export type ReferralCategory =
  | "RADIOLOGY"
  | "RESPIRATORY"
  | "CARDIOLOGY"
  | "PATHOLOGY"
  | "DERMATOLOGY"
  | "GYNAECOLOGY"
  | "PATIENT";

export interface BookingTask {
  id: string;
  episodeOfCareId: string;
  category: ReferralCategory;
  status: TaskStatus;
  priority: Priority;
  assignedConsultantId?: string;
  externalReferralId?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "BOOKED" | "ATTENDED" | "CANCELLED";

export interface Appointment {
  id: string;
  bookingTaskId: string;
  scheduledAt: string;
  location?: string;
  status: AppointmentStatus;
}

export type FormCaptureSource = "CONSULTANT_IN_CLINIC" | "STAFF_PAPER" | "STAFF_SCAN";

export interface ServiceRequestForm {
  id: string;
  bookingTaskId: string;
  capturedBy: FormCaptureSource;
  fields: Record<string, string>;
}

export type ResultStatus = "RECEIVED" | "SENT_TO_REFERRER" | "MORE_NEEDED" | "COMPLETE";

export interface ResultRecord {
  id: string;
  bookingTaskId: string;
  status: ResultStatus;
  receivedAt: string;
  sentToReferrerAt?: string;
  externalReportUrl?: string;
}

export interface ActivityLogEntry {
  id: string;
  bookingTaskId: string;
  action: string;
  changedById: string;
  changedAt: string;
  details?: string;
}

export type PaymentType = "SELF_PAY" | "INSURER";
export type BillingStatus = "PENDING" | "PAID" | "INVOICED";

export interface BillingRecord {
  id: string;
  episodeOfCareId: string;
  paymentType: PaymentType;
  amount: number;
  status: BillingStatus;
  insurerName?: string;
  compiledAt: string;
}
