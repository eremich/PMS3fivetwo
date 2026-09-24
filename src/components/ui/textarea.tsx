import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-control border border-field-border bg-field text-field-text px-3 py-2 text-body-lg transition-colors hover:border-field-border-hover placeholder:text-field-placeholder focus-ring-inset focus-visible:border-field-border-focus disabled:cursor-not-allowed disabled:bg-field-disabled disabled:opacity-50 aria-invalid:border-field-border-invalid aria-invalid:ring-3 aria-invalid:ring-field-ring-invalid md:text-body",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
