import type { ReactNode } from "react";

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="rounded-surface border border-dashed border-line px-6 py-16 text-center">
      <p className="text-body text-fg-secondary">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
