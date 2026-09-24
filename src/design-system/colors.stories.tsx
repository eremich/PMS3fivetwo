import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComponentTokensPage, PrimitivesPage, SemanticPage } from "./token-tables";

const meta = {
  title: "Foundations/Colors", tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Semantic: Story = { render: () => <SemanticPage /> };
export const Primitives: Story = { render: () => <PrimitivesPage /> };
export const ComponentTokens: Story = { name: "Component tokens", render: () => <ComponentTokensPage /> };
