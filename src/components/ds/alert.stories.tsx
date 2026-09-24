import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["!autodocs"],
  args: { tone: "info", children: "Appointment reminders are sent by email two days before." },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
      description: "Meaning of the message. Sets colour, icon and how it is announced.",
      table: { type: { summary: '"info" | "success" | "warning" | "danger"' }, defaultValue: { summary: "info" } },
    },
    title: { control: "text", description: "Optional bold first line." },
    children: { control: "text", description: "The message: what happened and what to do." },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: "success", children: "Patient registered. You can now add a referral." } };
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Possible duplicate",
    children: "A patient named Liam Davies with this date of birth already exists (MRN-00012). Check before registering again.",
  },
};
export const Danger: Story = {
  args: { tone: "danger", title: "Could not save", children: "The amount must be greater than £0. Enter it and try again." },
};

export const AllTones: Story = {
  name: "All tones",
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert tone="info">Appointment reminders are sent by email two days before.</Alert>
      <Alert tone="success">Patient registered. You can now add a referral.</Alert>
      <Alert tone="warning" title="Possible duplicate">
        A patient with this name and date of birth already exists.
      </Alert>
      <Alert tone="danger" title="Could not save">
        The amount must be greater than £0.
      </Alert>
    </div>
  ),
};
