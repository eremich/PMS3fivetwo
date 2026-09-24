import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TableCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-surface border border-line bg-surface", className)}>{children}</div>;
}
