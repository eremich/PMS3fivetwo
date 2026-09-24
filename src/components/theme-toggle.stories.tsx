import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "./theme-toggle";

const meta = { title: "Components/Theme toggle", parameters: { docs: { description: { component: "Switches between Light, Dark and System. The choice is stored in the browser and applied before first paint so the page never flashes." } } }, component: ThemeToggle } satisfies Meta<typeof ThemeToggle>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Sets the same class and localStorage key as the app; the Storybook toolbar switcher does the same for stories. */
export const Default: Story = {};
