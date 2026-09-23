import type {
  ActivityLogEntry,
  Appointment,
  BillingRecord,
  BookingTask,
  EpisodeOfCare,
  Patient,
  ResultRecord,
  ServiceRequestForm,
  StaffUser,
} from "./types";

export const staffUsers: StaffUser[] = [
  { id: "u-admin-1", name: "Alex Morgan", role: "ADMIN" },
  { id: "u-cons-1", name: "Dr. Sarah Chen", role: "CONSULTANT", speciality: "Radiology" },
  { id: "u-cons-2", name: "Dr. James Okafor", role: "CONSULTANT", speciality: "Cardiology" },
  { id: "u-sec-1", name: "Jamie Lee", role: "SECRETARY" },
];

export const patients: Patient[] = [
  { id: "p-1", mrn: "P-2026-0001", firstName: "Emily", lastName: "Carter", dateOfBirth: "1985-03-12", phone: "07700 900001" },
  { id: "p-2", mrn: "P-2026-0002", firstName: "Noah", lastName: "Williams", dateOfBirth: "1972-11-04", phone: "07700 900002" },
  { id: "p-3", mrn: "P-2026-0003", firstName: "Olivia", lastName: "Brown", dateOfBirth: "1990-07-22", email: "olivia.brown@example.com" },
  { id: "p-4", mrn: "P-2026-0004", firstName: "Liam", lastName: "Davies", dateOfBirth: "1958-01-30", phone: "07700 900004" },
  { id: "p-5", mrn: "P-2026-0005", firstName: "Ava", lastName: "Wilson", dateOfBirth: "2001-09-15", phone: "07700 900005" },
  { id: "p-6", mrn: "P-2026-0006", firstName: "Ethan", lastName: "Taylor", dateOfBirth: "1966-05-08", email: "ethan.taylor@example.com" },
  { id: "p-7", mrn: "P-2026-0007", firstName: "Sophia", lastName: "Evans", dateOfBirth: "1979-12-19", phone: "07700 900007" },
];

export const episodes: EpisodeOfCare[] = [
  { id: "e-1", patientId: "p-1", referralReceivedAt: "2026-09-01T09:00:00Z" },
  { id: "e-2", patientId: "p-2", referralReceivedAt: "2026-09-02T10:30:00Z" },
  { id: "e-3", patientId: "p-3", referralReceivedAt: "2026-09-03T08:15:00Z" },
  { id: "e-4", patientId: "p-4", referralReceivedAt: "2026-09-05T14:00:00Z" },
  { id: "e-5", patientId: "p-5", referralReceivedAt: "2026-09-08T11:20:00Z" },
  { id: "e-6", patientId: "p-6", referralReceivedAt: "2026-09-10T13:45:00Z" },
  { id: "e-7", patientId: "p-7", referralReceivedAt: "2026-09-15T09:30:00Z" },
  { id: "e-8", patientId: "p-1", referralReceivedAt: "2026-07-14T09:00:00Z" },
];

export const bookingTasks: BookingTask[] = [
  { id: "t-1", episodeOfCareId: "e-1", category: "RADIOLOGY", status: "SCHEDULED", priority: "ROUTINE", assignedConsultantId: "u-cons-1", externalReferralId: "MYORB-1001", createdAt: "2026-09-01T09:05:00Z", updatedAt: "2026-09-03T10:00:00Z" },
  { id: "t-2", episodeOfCareId: "e-2", category: "CARDIOLOGY", status: "PENDING", priority: "URGENT", assignedConsultantId: "u-cons-2", createdAt: "2026-09-02T10:35:00Z", updatedAt: "2026-09-02T10:35:00Z" },
  { id: "t-3", episodeOfCareId: "e-3", category: "PATHOLOGY", status: "COMPLETE", priority: "ROUTINE", createdAt: "2026-09-03T08:20:00Z", updatedAt: "2026-09-12T09:00:00Z" },
  { id: "t-4", episodeOfCareId: "e-4", category: "RADIOLOGY", status: "PENDING", priority: "RED_FLAG", assignedConsultantId: "u-cons-1", externalReferralId: "MYORB-1004", createdAt: "2026-09-05T14:05:00Z", updatedAt: "2026-09-05T14:05:00Z" },
  { id: "t-5", episodeOfCareId: "e-5", category: "RESPIRATORY", status: "SCHEDULED", priority: "ROUTINE", createdAt: "2026-09-08T11:25:00Z", updatedAt: "2026-09-10T09:00:00Z" },
  { id: "t-6", episodeOfCareId: "e-6", category: "CARDIOLOGY", status: "REACTIVATE_PENDING", priority: "URGENT", assignedConsultantId: "u-cons-2", createdAt: "2026-09-10T13:50:00Z", updatedAt: "2026-09-18T08:00:00Z" },
  { id: "t-7", episodeOfCareId: "e-7", category: "DERMATOLOGY", status: "NO_LONGER_REQUIRED", priority: "ROUTINE", createdAt: "2026-09-15T09:35:00Z", updatedAt: "2026-09-16T09:00:00Z" },
  { id: "t-8", episodeOfCareId: "e-1", category: "PATHOLOGY", status: "CREATED_IN_ERROR", priority: "ROUTINE", createdAt: "2026-09-04T09:00:00Z", updatedAt: "2026-09-04T09:10:00Z" },
  { id: "t-9", episodeOfCareId: "e-8", category: "PATHOLOGY", status: "COMPLETE", priority: "ROUTINE", createdAt: "2026-07-14T09:05:00Z", updatedAt: "2026-07-20T09:00:00Z" },
];

export const appointments: Appointment[] = [
  { id: "a-1", bookingTaskId: "t-1", scheduledAt: "2026-09-30T10:00:00Z", location: "Imaging Suite 1", status: "BOOKED" },
  { id: "a-2", bookingTaskId: "t-3", scheduledAt: "2026-09-11T09:00:00Z", location: "Phlebotomy", status: "ATTENDED" },
  { id: "a-3", bookingTaskId: "t-5", scheduledAt: "2026-10-02T13:30:00Z", location: "Lung Function Lab", status: "BOOKED" },
];

export const serviceRequestForms: ServiceRequestForm[] = [
  {
    id: "f-1",
    bookingTaskId: "t-1",
    capturedBy: "STAFF_SCAN",
    fields: { examRequested: "MRI Knee", clinicalHistory: "Chronic knee pain, 6 months", referringClinician: "Dr. A. Patel" },
  },
  {
    id: "f-2",
    bookingTaskId: "t-2",
    capturedBy: "CONSULTANT_IN_CLINIC",
    fields: { examType: "Echo", presentingSymptoms: "Breathlessness on exertion", referringClinician: "Dr. James Okafor" },
  },
];

export const results: ResultRecord[] = [
  { id: "r-1", bookingTaskId: "t-3", status: "COMPLETE", receivedAt: "2026-09-11T15:00:00Z", sentToReferrerAt: "2026-09-12T09:00:00Z" },
  { id: "r-2", bookingTaskId: "t-1", status: "RECEIVED", receivedAt: "2026-09-21T09:00:00Z" },
  { id: "r-3", bookingTaskId: "t-9", status: "COMPLETE", receivedAt: "2026-07-19T15:00:00Z", sentToReferrerAt: "2026-07-20T09:00:00Z" },
];

export const activityLog: ActivityLogEntry[] = [
  { id: "log-1", bookingTaskId: "t-6", action: "REACTIVATE_REQUESTED", changedById: "u-sec-1", changedAt: "2026-09-18T08:00:00Z", details: "Patient requested new appointment date" },
  { id: "log-2", bookingTaskId: "t-7", action: "DEACTIVATED", changedById: "u-admin-1", changedAt: "2026-09-16T09:00:00Z", details: "Referral withdrawn by referrer" },
  { id: "log-3", bookingTaskId: "t-8", action: "MARKED_CREATED_IN_ERROR", changedById: "u-sec-1", changedAt: "2026-09-04T09:10:00Z", details: "Duplicate of t-3" },
];

export const billingRecords: BillingRecord[] = [
  { id: "b-1", episodeOfCareId: "e-3", paymentType: "SELF_PAY", amount: 180, status: "PAID", compiledAt: "2026-09-12T10:00:00Z" },
  { id: "b-2", episodeOfCareId: "e-1", paymentType: "INSURER", amount: 420, status: "INVOICED", insurerName: "Bupa", compiledAt: "2026-09-21T10:00:00Z" },
];
