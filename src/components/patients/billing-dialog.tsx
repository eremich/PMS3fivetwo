"use client";

import { useState } from "react";
import { useAppData } from "@/lib/app-context";
import type { PaymentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioCard } from "@/components/ds/radio-card";
import { TextField } from "@/components/ds/text-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: "SELF_PAY", label: "Self-pay" },
  { value: "INSURER", label: "Insurer" },
];

interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episodeOfCareId: string;
}

export function BillingDialog({ open, onOpenChange, episodeOfCareId }: BillingDialogProps) {
  const { addBillingRecord } = useAppData();
  const [paymentType, setPaymentType] = useState<PaymentType>("SELF_PAY");
  const [amount, setAmount] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Errors appear after the first submit attempt, then update as the user types.
  const amountError = Number(amount) > 0 ? undefined : "Enter an amount greater than £0.";
  const insurerError =
    paymentType === "INSURER" && insurerName.trim().length === 0 ? "Enter the insurer's name." : undefined;

  function reset() {
    setPaymentType("SELF_PAY");
    setAmount("");
    setInsurerName("");
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (amountError || insurerError) return;
    addBillingRecord({
      episodeOfCareId,
      paymentType,
      amount: Number(amount),
      insurerName: paymentType === "INSURER" ? insurerName.trim() : undefined,
    });
    reset();
    onOpenChange(false);
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
            <DialogTitle>Log billing confirmation</DialogTitle>
            <DialogDescription>
              {paymentType === "SELF_PAY"
                ? "Payment taken, receipt issued."
                : "Invoiced via Healthcode, sent to insurer."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label>Payment</Label>
            <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)} className="flex flex-col gap-2">
              {PAYMENT_TYPES.map((p) => (
                <RadioCard key={p.value} id={`payment-${p.value}`} value={p.value}>
                  <span className="text-body">{p.label}</span>
                </RadioCard>
              ))}
            </RadioGroup>
          </div>

          {paymentType === "INSURER" && (
            <TextField
              label="Insurer name"
              value={insurerName}
              onChange={(e) => setInsurerName(e.target.value)}
              placeholder="Bupa"
              autoFocus
              required
              error={submitted ? insurerError : undefined}
            />
          )}

          <TextField
            label="Amount (£)"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="180"
            required
            error={submitted ? amountError : undefined}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
