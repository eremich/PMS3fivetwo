"use client";

import { ChevronsUpDown, UserRound } from "lucide-react";
import { useAppData } from "@/lib/app-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  CONSULTANT: "Consultant",
  SECRETARY: "Secretary",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RoleSwitcher() {
  const { currentUser, staffUsers, setCurrentUser } = useAppData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-control py-1 pr-2 pl-1 text-left transition-colors duration-150 ease-out hover:bg-surface-hover focus-ring">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-primary text-fg-inverse text-caption font-medium">
            {initials(currentUser.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate text-body font-medium leading-tight text-fg">
            {currentUser.name}
          </span>
          <span className="truncate text-caption leading-tight text-fg-secondary">
            {roleLabels[currentUser.role]}
            {currentUser.speciality ? ` · ${currentUser.speciality}` : ""}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-fg-secondary" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5 text-caption font-medium text-fg-secondary">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            Demo — sign in as
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {staffUsers.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => setCurrentUser(user)}
              className="gap-2.5"
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-secondary text-fg text-caption font-medium">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-body">{user.name}</span>
                <span className="truncate text-caption text-fg-secondary">
                  {roleLabels[user.role]}
                  {user.speciality ? ` · ${user.speciality}` : ""}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
