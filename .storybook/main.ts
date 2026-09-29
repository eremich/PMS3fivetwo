import type { StorybookConfig } from "@storybook/nextjs-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    {
      // GitHub-flavoured Markdown, so tables in the MDX docs render as tables
      name: "@storybook/addon-docs",
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-themes",
    "@storybook/addon-mcp",
    "storybook-addon-pseudo-states",
  ],
  framework: "@storybook/nextjs-vite",
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  features: { sidebarOnboardingChecklist: false },
  staticDirs: ["../public"],
};

export default config;
