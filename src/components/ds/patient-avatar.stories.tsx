import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PatientAvatar } from "./patient-avatar";

const meta = {
  title: "Components/Patient avatar",
  component: PatientAvatar,
  args: { name: "Liam Davies" },
} satisfies Meta<typeof PatientAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Palette: Story = {
  render: () => (
    <div className="flex gap-3">
      {["Liam Davies", "Ethan Taylor", "Noah Williams", "Ava Wilson", "Sophia Evans", "Olivia Brown"].map((n) => (
        <PatientAvatar key={n} name={n} />
      ))}
    </div>
  ),
};
