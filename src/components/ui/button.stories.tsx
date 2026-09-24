import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Register patient" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost", "destructive", "link"] },
    size: { control: "select", options: ["xs", "sm", "default", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Created in error" } };
export const Link: Story = { args: { variant: "link" } };
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Plus aria-hidden="true" />
      New episode
    </Button>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Hover: Story = { args: { variant: "primary" }, parameters: { pseudo: { hover: true } } };
export const Focus: Story = { args: { variant: "primary" }, parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { args: { variant: "primary" }, parameters: { pseudo: { active: true } } };
