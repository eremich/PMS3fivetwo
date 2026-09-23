"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppData } from "@/lib/app-context";
import { formatDate, fullName } from "@/lib/patient-helpers";
import type { PaymentType } from "@/lib/types";
import { BillingStatusBadge } from "@/components/ds/status-badge";
import { PatientAvatar } from "@/components/ds/patient-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ds/page-header";
import { Toolbar } from "@/components/ds/toolbar";
import { SearchInput } from "@/components/ds/search-input";
import { FilterChip } from "@/components/ds/filter-chip";
import { TableCard } from "@/components/ds/table-card";
import { EmptyState } from "@/components/ds/empty-state";
import { StatTile } from "@/components/ds/stat-tile";

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
        <h1 className="text-h3">Admin only</h1>
        <p className="text-body text-muted-foreground">Billing and activity reporting is only visible to Admin staff.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader title="Billing & activity" description="Compiled billing confirmations across the clinic." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total billed" value={`£${totals.total.toLocaleString()}`} emphasis className="col-span-2 sm:col-span-1" />
        <StatTile label="Self-pay" value={`£${totals.selfPay.toLocaleString()}`} />
        <StatTile label="Insurer" value={`£${totals.insurer.toLocaleString()}`} />
        <StatTile label="Awaiting insurer" value={totals.invoiced} />
      </div>

      <Toolbar meta={`Showing ${filtered.length} of ${rows.length}`}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by patient name" />
        {PAYMENT_FILTERS.map((f) => (
          <FilterChip key={f.value} active={paymentFilter === f.value} onClick={() => setPaymentFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState message={rows.length === 0 ? "No billing confirmations logged yet." : "No records match these filters."} />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Patient</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Compiled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ record, patient }) => (
                <TableRow key={record.id}>
                  <TableCell className="font-semibold">
                    {patient ? (
                      <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:underline">
                        <PatientAvatar name={fullName(patient)} />
                        {fullName(patient)}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.paymentType === "SELF_PAY" ? "Self-pay" : `Insurer${record.insurerName ? ` (${record.insurerName})` : ""}`}
                  </TableCell>
                  <TableCell className="tabular-nums">£{record.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <BillingStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{formatDate(record.compiledAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      )}
    </div>
  );
}
