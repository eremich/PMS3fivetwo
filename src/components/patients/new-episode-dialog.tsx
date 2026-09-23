"use client";

import { useState } from "react";
import { useAppData } from "@/lib/app-context";
import { categoryLabel } from "@/lib/patient-helpers";
import type { EpisodeOfCare, Priority, ReferralCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PriorityBadge } from "@/components/status-badge";

const CATEGORIES: ReferralCategory[] = [
  "RADIOLOGY",
  "RESPIRATORY",
  "CARDIOLOGY",
  "PATHOLOGY",
  "DERMATOLOGY",
  "GYNAECOLOGY",
  "PATIENT",
];

const PRIORITIES: Priority[] = ["ROUTINE", "URGENT", "RED_FLAG"];

interface NewEpisodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onCreated: (episode: EpisodeOfCare) => void;
}

export function NewEpisodeDialog({ open, onOpenChange, patientId, onCreated }: NewEpisodeDialogProps) {
  const { addEpisode } = useAppData();
  const [category, setCategory] = useState<ReferralCategory | "">("");
  const [priority, setPriority] = useState<Priority>("ROUTINE");

  function reset() {
    setCategory("");
    setPriority("ROUTINE");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    const episode = addEpisode({ patientId, category, priority });
    reset();
    onOpenChange(false);
    onCreated(episode);
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
            <DialogTitle>New episode of care</DialogTitle>
            <DialogDescription>Referral received today. A booking task is created automatically.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Referral category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ReferralCategory)}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category">
                  {(value: ReferralCategory | null) => (value ? categoryLabel(value) : "Select a category")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as Priority)} className="flex flex-col gap-2">
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  htmlFor={`priority-${p}`}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-input px-3 py-2 transition-colors duration-150 ease-out has-data-[checked]:border-primary has-data-[checked]:bg-primary/5"
                >
                  <span className="flex items-center gap-2.5">
                    <RadioGroupItem id={`priority-${p}`} value={p} />
                    <PriorityBadge priority={p} />
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!category}>
              Create episode
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
