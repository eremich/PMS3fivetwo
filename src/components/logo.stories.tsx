import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./logo";

const meta = {
  title: "Brand/Logo", parameters: { docs: { description: { component: "The centre logo as SVG in light and dark variants; the theme picks the matching one. Use compact in navigation and the full version, with the Sterling Healthcare Group line, only where it stays legible." } } },
  component: Logo,
  argTypes: { variant: { control: "inline-radio", options: ["compact", "full"] } },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sidebar and mobile header. Switch the theme in the toolbar: the dark SVG variant is shown automatically. */
export const Compact: Story = { args: { variant: "compact", className: "h-10" } };

/** Carries the Sterling Healthcare Group line; only use it where it stays legible (about 56px tall or more). */
export const Full: Story = { args: { variant: "full", className: "h-20" } };
