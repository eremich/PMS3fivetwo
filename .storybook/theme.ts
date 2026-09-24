import { create } from "storybook/theming/create";

// Storybook themes need plain hex values; these are the OKLCH design tokens converted
// (primary = --primitive-blue-600, canvas = neutral-50, text = neutral-900, ...).
export const lightTheme = create({
  base: "light",
  brandTitle: "New Malden Diagnostic Centre · Design System",
  brandUrl: "/",
  brandImage: "/logo/logo-compact.svg",
  brandTarget: "_self",

  colorPrimary: "#2860dd",
  colorSecondary: "#2860dd",

  appBg: "#f3f4f6",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e4e6ea",
  appBorderRadius: 12,

  textColor: "#13161d",
  textMutedColor: "#5f636c",
  barTextColor: "#5f636c",
  barSelectedColor: "#2860dd",
  barBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#dcdee2",
  inputTextColor: "#13161d",
  inputBorderRadius: 8,

  fontBase: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, "Geist Mono", Consolas, monospace',
});
