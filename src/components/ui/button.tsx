import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding text-body font-medium whitespace-nowrap transition-all select-none focus-ring active:not-aria-[haspopup]:translate-y-px disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-field-ring-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-button-primary text-button-primary-text hover:bg-button-primary-hover active:bg-button-primary-pressed",
        secondary:
          "bg-button-secondary text-button-secondary-text hover:bg-button-secondary-hover active:bg-button-secondary-pressed aria-expanded:bg-button-secondary-hover",
        outline:
          "border-button-outline-border bg-button-outline text-button-outline-text hover:bg-button-outline-hover active:bg-button-outline-pressed aria-expanded:bg-button-outline-hover",
        ghost:
          "text-button-ghost-text hover:bg-button-ghost-hover active:bg-button-ghost-pressed aria-expanded:bg-button-ghost-hover",
        destructive:
          "bg-button-destructive text-button-destructive-text hover:bg-button-destructive-hover active:bg-button-destructive-pressed",
        link: "text-button-link-text underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-control-md gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-control-xs gap-1 rounded-control px-2.5 text-caption in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-sm gap-1.5 rounded-control px-3 text-body in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-control-lg gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-control-md",
        "icon-xs":
          "size-control-xs rounded-control [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-control-sm rounded-control",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
