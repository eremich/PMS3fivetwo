"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import { formatDate, fullName } from "@/lib/patient-helpers";
import type { PaymentType } from "@/lib/types";
import { BillingStatusBadge } from "@/components/status-badge";
import { PatientAvatar } from "@/components/patient-avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PAYMENT_FILTERS: { label: string; value: PaymentType | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Self-pay", value: "SELF_PAY" },
  { label: "Insurer", value: "INSURER" },
];

export default function BillingPage() {
  const { currentUser, billingRecords, episodes, patients } = useAppData();
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentType | "ALL">("ALL");

  const rows = useMemo(() => {
    return billingRecords.map((record) => {
      const episode = episodes.find((e) => e.id === record.episodeOfCareId) ?? null;
      const patient = episode ? patients.find((p) => p.id === episode.patientId) ?? null : null;
      return { record, episode, patient };
    });
  }, [billingRecords, episodes, patients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter(({ record, patient }) => {
        if (q && !(patient && fullName(patient).toLowerCase().includes(q))) return false;
        if (paymentFilter !== "ALL" && record.paymentType !== paymentFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.record.compiledAt).getTime() - new Date(a.record.compiledAt).getTime());
  }, [rows, query, paymentFilter]);

  const totals = useMemo(() => {
    const total = billingRecords.reduce((sum, r) => sum + r.amount, 0);
    const selfPay = billingRecords.filter((r) => r.paymentType === "SELF_PAY").reduce((sum, r) => sum + r.amount, 0);
    const insurer = billingRecords.filter((r) => r.paymentType === "INSURER").reduce((sum, r) => sum + r.amount, 0);
    const invoiced = billingRecords.filter((r) => r.status === "INVOICED").length;
    return { total, selfPay, insurer, invoiced };
  }, [billingRecords]);

  if (currentUser.role !== "ADMIN") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <h1 className="text-xl font-semibold">Admin only</h1>
        <p className="text-sm text-muted-foreground">Billing and activity reporting is only visible to Admin staff.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-[28px] leading-9 font-bold tracking-tight text-balance">Billing &amp; activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compiled billing confirmations across the clinic.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col justify-between rounded-xl bg-primary px-5 py-4 text-primary-foreground sm:col-span-1">
          <span className="text-sm font-medium opacity-90">Total billed</span>
          <span className="mt-3 text-3xl font-semibold tabular-nums">£{totals.total.toLocaleString()}</span>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card px-4 py-4">
          <span className="text-xs font-medium text-muted-foreground">Self-pay</span>
          <span className="mt-3 text-2xl font-semibold tabular-nums text-card-foreground">£{totals.selfPay.toLocaleString()}</span>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card px-4 py-4">
          <span className="text-xs font-medium text-muted-foreground">Insurer</span>
          <span className="mt-3 text-2xl font-semibold tabular-nums text-card-foreground">£{totals.insurer.toLocaleString()}</span>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card px-4 py-4">
          <span className="text-xs font-medium text-muted-foreground">Awaiting insurer</span>
          <span className="mt-3 text-2xl font-semibold tabular-nums text-card-foreground">{totals.invoiced}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient name"
            className="pl-9"
          />
        </div>
        {PAYMENT_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setPaymentFilter(f.value)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              paymentFilter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-secondary/60",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">
          Showing {filtered.length} of {rows.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {rows.length === 0 ? "No billing confirmations logged yet." : "No records match these filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Patient</th>
                <th className="px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Compiled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(({ record, patient }) => (
                <tr key={record.id} className="transition-colors hover:bg-secondary/50">
                  <td className="px-4 py-3.5 font-semibold">
                    {patient ? (
                      <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:underline">
                        <PatientAvatar name={fullName(patient)} />
                        {fullName(patient)}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {record.paymentType === "SELF_PAY" ? "Self-pay" : `Insurer${record.insurerName ? ` (${record.insurerName})` : ""}`}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">£{record.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <BillingStatusBadge status={record.status} />
                  </td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{formatDate(record.compiledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
