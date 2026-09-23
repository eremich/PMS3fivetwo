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
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 text-left transition-colors duration-150 ease-out hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
            {initials(currentUser.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate text-sm font-medium leading-tight text-foreground">
            {currentUser.name}
          </span>
          <span className="truncate text-xs leading-tight text-muted-foreground">
            {roleLabels[currentUser.role]}
            {currentUser.speciality ? ` · ${currentUser.speciality}` : ""}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
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
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
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
