import { useId } from "react";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id" | "aria-invalid" | "aria-describedby"> & {
  label: string;
  /** false hides the label visually; it stays available to screen readers. */
  showLabel?: boolean;
  description?: string;
  error?: string;
  /** Renders a growing textarea instead of a single-line input. */
  multiline?: boolean;
  rows?: number;
};

/**
 * Label + input + optional hint and error, wired for accessibility:
 * the label names the input, hint and error are announced with it, invalid state is set from `error`.
 */
export function TextField({
  label,
  showLabel = true,
  description,
  error,
  multiline,
  rows,
  required,
  disabled,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = [description && descriptionId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("group flex flex-col gap-1.5", className)} data-disabled={disabled ? "true" : undefined}>
      <Label htmlFor={id} className={showLabel ? undefined : "sr-only"}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive-text">
            *
          </span>
        )}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(props as ComponentProps<typeof Textarea>)}
        />
      ) : (
        <Input
          id={id}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
      )}
      {description && !error && (
        <p id={descriptionId} className="text-caption text-fg-secondary">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-caption text-destructive-text">
          {error}
        </p>
      )}
    </div>
  );
}
