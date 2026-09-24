import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = { title: "Components/Dropdown menu", tags: ["!autodocs"], parameters: { docs: { description: { component: "A menu of actions opened from a button. Items highlight on hover and keyboard focus, destructive items are red, and disabled items keep a not-allowed cursor." } } }, component: DropdownMenu } satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Colour theme</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Sun aria-hidden="true" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Moon aria-hidden="true" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem disabled>System (unavailable)</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Reset</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
