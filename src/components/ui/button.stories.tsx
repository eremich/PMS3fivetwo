import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["!autodocs"],
  args: { children: "Register patient" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive", "link"],
      description: "Visual weight and intent. One primary per screen or dialog.",
      table: { type: { summary: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"' }, defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      description: "Height from the control-height tokens: xs 28, sm 32, default 40, lg 44. Icon sizes are square.",
      table: { type: { summary: '"xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"' }, defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean", description: "50% opacity, not-allowed cursor, no click.", table: { defaultValue: { summary: "false" } } },
    children: { control: "text", description: "The label: a verb that says what happens." },
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

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["primary", "secondary", "outline", "ghost", "destructive", "link"] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant[0].toUpperCase() + variant.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size === "default" ? "Default" : size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};
