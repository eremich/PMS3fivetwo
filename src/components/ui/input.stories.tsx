import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "07700 900000" },
  decorators: [
    (Story) => (
      <div className="flex w-72 flex-col gap-1.5">
        <Label htmlFor="story-input">Phone</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { id: "story-input" } };
export const Filled: Story = { args: { id: "story-input", defaultValue: "07700 900123" } };
export const Disabled: Story = { args: { id: "story-input", disabled: true } };
export const Invalid: Story = { args: { id: "story-input", "aria-invalid": true, defaultValue: "abc" } };
export const Hover: Story = { args: { id: "story-input" }, parameters: { pseudo: { hover: true } } };
export const Focus: Story = { args: { id: "story-input" }, parameters: { pseudo: { focusVisible: true } } };
