import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "./avatar";

const meta = { title: "Components/Avatar", parameters: { docs: { description: { component: "Circular initials avatar for staff, with an optional status badge and grouping." } } }, component: Avatar } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AM</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {["AM", "SC", "JO"].map((n) => (
        <Avatar key={n}>
          <AvatarFallback>{n}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
