import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea", parameters: { docs: { description: { component: "Multi-line text input for notes. It grows with its content. Always pair it with a visible label." } } },
  component: Textarea,
  args: { placeholder: "Clinical notes" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "Too short" } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
