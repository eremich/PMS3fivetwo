"use client";

import { useState } from "react";
import { useAppData } from "@/lib/app-context";
import { findDuplicatePatient, fullName } from "@/lib/patient-helpers";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ds/alert";
import { TextField } from "@/components/ds/text-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegisterPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onRegistered: (patient: Patient) => void;
}

export function RegisterPatientDialog({
  open,
  onOpenChange,
  initialName,
  onRegistered,
}: RegisterPatientDialogProps) {
  const { patients, addPatient } = useAppData();
  const [firstName, setFirstName] = useState(initialName?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(initialName?.split(" ").slice(1).join(" ") ?? "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const duplicate =
    firstName && lastName && dateOfBirth ? findDuplicatePatient(patients, firstName, lastName, dateOfBirth) : null;

  // Errors appear after the first submit attempt, then update as the user types.
  const firstNameError = firstName.trim().length === 0 ? "Enter a first name." : undefined;
  const lastNameError = lastName.trim().length === 0 ? "Enter a last name." : undefined;
  const dobError = dateOfBirth.length === 0 ? "Enter a date of birth." : undefined;
  const isValid = !firstNameError && !lastNameError && !dobError;

  function reset() {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setPhone("");
    setEmail("");
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    const patient = addPatient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    });
    reset();
    onOpenChange(false);
    onRegistered(patient);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Register patient</DialogTitle>
            <DialogDescription>Create a new patient record before adding a referral.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
              required
              error={submitted ? firstNameError : undefined}
            />
            <TextField
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              error={submitted ? lastNameError : undefined}
            />
          </div>

          <TextField
            label="Date of birth"
            type="date"
            value={dateOfBirth}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            error={submitted ? dobError : undefined}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07700 900000"
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          {duplicate && (
            <Alert tone="warning" title="Possible duplicate">
              A patient named {fullName(duplicate)} with this date of birth already exists ({duplicate.mrn}). Check before
              registering a duplicate.
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{duplicate ? "Register anyway" : "Register patient"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
