"use client";

import { useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import {
  readThemePreference,
  saveThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribeToTheme, readThemePreference, () => "system" as const);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Colour theme"
        className="relative flex size-control-md items-center justify-center rounded-control border border-line bg-surface text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg focus-ring"
      >
        <Sun className="size-4 scale-100 dark:scale-0" aria-hidden="true" />
        <Moon className="absolute size-4 scale-0 dark:scale-100" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          {options.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem key={value} onClick={() => saveThemePreference(value)} className="gap-2.5">
              <Icon className="size-4" aria-hidden="true" />
              {label}
              {preference === value && <Check className="ml-auto size-4 text-fg-link" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
