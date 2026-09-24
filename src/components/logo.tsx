import Image from "next/image";
import { cn } from "@/lib/utils";

const ALT = "New Malden Diagnostic Centre";

// "full" carries the Sterling Healthcare Group line; use it only where it stays legible (>= 56px tall).
const VARIANTS = {
  compact: { name: "logo-compact", width: 477, height: 100 },
  full: { name: "logo-full", width: 449, height: 100 },
} as const;

/** Light and dark SVGs are both rendered; CSS shows the one that matches the theme. */
export function Logo({ variant = "compact", className }: { variant?: keyof typeof VARIANTS; className?: string }) {
  const { name, width, height } = VARIANTS[variant];
  return (
    <>
      <Image src={`/logo/${name}.svg`} alt={ALT} width={width} height={height} unoptimized priority className={cn("w-auto dark:hidden", className)} />
      <Image
        src={`/logo/${name}-dark.svg`}
        alt={ALT}
        width={width}
        height={height}
        unoptimized
        priority
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}
