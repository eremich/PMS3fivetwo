// Production build for Vercel: the design system is published at /storybook on the same URL as the app.
// 1. build Storybook to storybook-static  2. copy it to public/storybook  3. build the Next.js app.
// public/storybook is removed first because Storybook itself copies public/ (staticDirs) and would nest an old build.
import { execSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";

const run = (command) => execSync(command, { stdio: "inherit" });

rmSync("public/storybook", { recursive: true, force: true });
run("npx storybook build -o storybook-static");
cpSync("storybook-static", "public/storybook", { recursive: true });
run("npx next build");
