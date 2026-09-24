import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const STATUSES = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "SCHEDULED", label: "Scheduled" },
];

function StatusSelect({ disabled, invalid }: { disabled?: boolean; invalid?: boolean }) {
  return (
    <Select defaultValue="ALL" disabled={disabled}>
      <SelectTrigger className="w-48" aria-invalid={invalid}>
        <SelectValue>{(value: string) => STATUSES.find((s) => s.value === value)?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const meta = { title: "Components/Select", tags: ["!autodocs"], parameters: { docs: { description: { component: "Dropdown for choosing one option from a short list. It shows the label of the selected option, not its stored value. Hover fills the field, focus shows a keyboard ring." } } }, component: StatusSelect } satisfies Meta<typeof StatusSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
