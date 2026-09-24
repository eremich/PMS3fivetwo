import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextField } from "./text-field";

const meta = {
  title: "Components/Text field",
  component: TextField,
  tags: ["!autodocs"],
  args: { label: "First name", placeholder: "Alex", showLabel: true },
  argTypes: {
    showLabel: { control: "boolean", description: "false hides the label visually; screen readers still read it" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    multiline: { control: "boolean", description: "Renders a growing textarea instead of a single-line input." },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const WithDescription: Story = {
  name: "With description",
  args: { label: "Email", placeholder: "name@example.com", description: "Used for appointment reminders." },
};
export const WithError: Story = {
  name: "With error",
  args: { label: "Phone", defaultValue: "0770", error: "Enter a full UK number, for example 07700 900000." },
};
export const Disabled: Story = { args: { label: "Record number", defaultValue: "MRN-00042", disabled: true } };
export const Multiline: Story = {
  args: { label: "Clinical notes", placeholder: "Add notes for the consultant", multiline: true, rows: 3 },
};
export const LabelHidden: Story = {
  name: "Label hidden",
  args: { label: "Search patients", placeholder: "Search by name", showLabel: false },
};
