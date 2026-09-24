import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-control-md w-full min-w-0 rounded-control border border-field-border bg-field text-field-text px-3 py-2 text-body-lg transition-colors hover:border-field-border-hover hover:bg-field-hover file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-body file:font-medium file:text-fg placeholder:text-field-placeholder focus-ring-inset focus-visible:border-field-border-focus disabled:cursor-not-allowed disabled:bg-field-disabled disabled:opacity-50 aria-invalid:border-field-border-invalid aria-invalid:ring-3 aria-invalid:ring-field-ring-invalid md:text-body",
        className
      )}
      {...props}
    />
  )
}

export { Input }
