"use client";

import { useState } from "react";
import { useAppData } from "@/lib/app-context";
import type { PaymentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioCard } from "@/components/ds/radio-card";
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

  const isValid = Number(amount) > 0 && (paymentType === "SELF_PAY" || insurerName.trim().length > 0);

  function reset() {
    setPaymentType("SELF_PAY");
    setAmount("");
    setInsurerName("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="insurerName">Insurer name</Label>
              <Input
                id="insurerName"
                value={insurerName}
                onChange={(e) => setInsurerName(e.target.value)}
                placeholder="Bupa"
                autoFocus
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount (£)</Label>
            <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="180" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
