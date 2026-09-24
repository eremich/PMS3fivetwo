import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "Components/Input", tags: ["!autodocs"], parameters: { docs: { description: { component: "Bare single-line text input. Use it where the surrounding UI already names it, such as a search box in a toolbar. Inside forms use Text field, which adds the label, hint and error." } } },
  component: Input,
  args: { placeholder: "07700 900000", "aria-label": "Phone" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Filled: Story = { args: { defaultValue: "07700 900123" } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "abc" } };
export const Hover: Story = { args: {}, parameters: { pseudo: { hover: true } } };
export const Focus: Story = { args: {}, parameters: { pseudo: { focusVisible: true } } };
