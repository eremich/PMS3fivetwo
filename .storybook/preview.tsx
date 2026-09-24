import { useEffect } from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "../src/app/globals.css";
import "./docs.css";
import { lightTheme } from "./theme";

// Same fonts as the app (src/app/layout.tsx); the variables must sit on <html> because globals.css reads them there.
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const preview: Preview = {
  // Every component gets a generated Docs page: description, live examples with source, props table.
  tags: ["autodocs"],
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => {
      useEffect(() => {
        document.documentElement.classList.add(dmSans.variable, geistMono.variable, "antialiased");
      }, []);
      return <Story />;
    },
  ],
  parameters: {
    layout: "centered",
    backgrounds: { disabled: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },
    docs: {
      theme: lightTheme,
      toc: { headingSelector: "h2, h3", title: "On this page" },
    },
    options: {
      storySort: {
        order: ["Introduction", "Guidelines", "Foundations", "Components", "Brand"],
        method: "alphabetical",
      },
    },
    a11y: {
      // 'todo' shows violations in the panel without failing anything
      test: "todo",
    },
  },
};

export default preview;
