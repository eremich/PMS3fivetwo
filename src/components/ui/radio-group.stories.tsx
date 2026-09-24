import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioCard } from "../ds/radio-card";
import { RadioGroup } from "./radio-group";

const meta = {
  title: "Components/Radio card", tags: ["!autodocs"], parameters: { docs: { description: { component: "Selectable option rows for a small, mutually exclusive choice such as payment type or priority. Use inside a RadioGroup; the selected card gets the primary tint." } } },
  component: RadioGroup,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="SELF_PAY">
      <RadioCard id="pay-self" value="SELF_PAY">
        Self-pay
      </RadioCard>
      <RadioCard id="pay-insurer" value="INSURER">
        Insurer
      </RadioCard>
    </RadioGroup>
  ),
};
