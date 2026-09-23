"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import { findDuplicatePatient, fullName } from "@/lib/patient-helpers";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [touched, setTouched] = useState(false);

  const duplicate =
    firstName && lastName && dateOfBirth ? findDuplicatePatient(patients, firstName, lastName, dateOfBirth) : null;

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0 && dateOfBirth.length > 0;

  function reset() {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setPhone("");
    setEmail("");
    setTouched(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Register patient</DialogTitle>
            <DialogDescription>Create a new patient record before adding a referral.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07700 900000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          {duplicate && (
            <div className="flex animate-in items-start gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-sm text-foreground fade-in-0 slide-in-from-top-1 duration-200 ease-out">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <span>
                A patient named <strong>{fullName(duplicate)}</strong> with this date of birth already exists (
                {duplicate.mrn}). Check before registering a duplicate.
              </span>
            </div>
          )}

          {touched && !isValid && (
            <p className="text-sm text-destructive">First name, last name, and date of birth are required.</p>
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
