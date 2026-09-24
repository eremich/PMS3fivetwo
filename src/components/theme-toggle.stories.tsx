import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "./theme-toggle";

const meta = { title: "Components/Theme toggle", component: ThemeToggle } satisfies Meta<typeof ThemeToggle>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Sets the same class and localStorage key as the app; the Storybook toolbar switcher does the same for stories. */
export const Default: Story = {};
