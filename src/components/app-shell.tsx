"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/lib/app-context";
import { Logo } from "@/components/logo";
import { RoleSwitcher } from "@/components/role-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Role } from "@/lib/types";

const navItems: { href: string; label: string; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CONSULTANT", "SECRETARY"] },
  { href: "/patients", label: "Patients", icon: Users, roles: ["ADMIN", "CONSULTANT", "SECRETARY"] },
  { href: "/tasks", label: "Tasks", icon: ListChecks, roles: ["ADMIN", "CONSULTANT", "SECRETARY"] },
  { href: "/appointments", label: "Appointments", icon: CalendarDays, roles: ["ADMIN", "CONSULTANT", "SECRETARY"] },
  { href: "/billing", label: "Billing", icon: Receipt, roles: ["ADMIN"] },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAppData();
  const items = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <div className="flex min-h-dvh w-full">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col px-4 py-6 md:flex">
        <Link href="/" aria-label="New Malden Diagnostic Centre — home" className="mb-8 block px-2">
          <Logo className="h-10" />
        </Link>
        <nav aria-label="Primary" className="flex flex-col gap-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-surface border px-3.5 py-2.5 text-body transition-colors duration-150 ease-out focus-ring",
                  active
                    ? "border-line bg-nav-active font-semibold text-fg shadow-xs"
                    : "border-transparent font-medium text-fg-secondary hover:bg-nav-hover hover:text-fg",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:py-3 md:pr-3">
        <div className="flex min-h-0 flex-1 flex-col bg-surface md:rounded-panel md:border md:border-line md:shadow-xs">
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:h-[72px] md:px-8">
            <Link href="/" aria-label="New Malden Diagnostic Centre — home" className="md:hidden">
              <Logo className="h-8" />
            </Link>
            <p className="hidden text-body text-fg-secondary md:block">{todayLabel()}</p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <RoleSwitcher />
            </div>
          </header>

          <nav aria-label="Primary" className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-control px-3.5 py-1.5 text-body font-medium transition-colors focus-ring",
                    active ? "bg-secondary font-semibold text-fg" : "text-fg-secondary hover:bg-surface-hover",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
