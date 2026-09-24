import primitivesCss from "../styles/tokens/primitives.css?raw";
import semanticCss from "../styles/tokens/semantic.css?raw";
import componentCss from "../styles/tokens/component.css?raw";
import themeCss from "../styles/theme.css?raw";

/**
 * Reads the real token files, so Storybook cannot drift from the code:
 * change a value in src/styles/tokens/*.css and these pages update.
 */
export interface Token {
  name: string;
  value: string;
  group: string;
}

type Blocks = Record<string, Token[]>;

function parse(css: string): Blocks {
  const blocks: Blocks = {};
  let selector: string | null = null;
  let group = "";
  for (const raw of css.split("\n")) {
    const line = raw.trim();
    const open = line.match(/^([:.\w-]+)\s*\{$/);
    if (open && !selector) {
      selector = open[1];
      blocks[selector] ??= [];
      group = "";
      continue;
    }
    if (line === "}") {
      selector = null;
      continue;
    }
    if (!selector) continue;
    const comment = line.match(/^\/\*\s*(.+?)\s*\*\/$/);
    if (comment) {
      group = comment[1];
      continue;
    }
    const token = line.match(/^(--[\w-]+):\s*(.+?);/);
    if (token) blocks[selector].push({ name: token[1], value: token[2], group });
  }
  return blocks;
}

const primitives = parse(primitivesCss)[":root"] ?? [];
const semantic = parse(semanticCss);
const component = parse(componentCss)[":root"] ?? [];

/** var name -> Tailwind colour key, from the bridge in theme.css */
const bridge: Record<string, string> = {};
for (const m of themeCss.matchAll(/--color-([\w-]+):\s*var\((--[\w-]+)\)/g)) bridge[m[2]] = m[1];

/** Class to use in markup for a semantic/component token (undefined when it is not exposed as a colour). */
export function classFor(name: string): string | undefined {
  const key = bridge[name];
  if (!key) return undefined;
  const prefix = name.startsWith("--text-") || name.endsWith("-text") ? "text" : name.includes("border") ? "border" : "bg";
  return `${prefix}-${key}`;
}

/** "var(--primitive-neutral-900)" -> "neutral-900" */
export function alias(value: string): string {
  return value.replace(/var\(--primitive-([\w-]+)\)/g, "$1").replace(/var\((--[\w-]+)\)/g, "$1");
}

export const isColor = (t: Token) => !/height|ring-width|ring-offset/.test(t.name);

export const primitiveTokens = primitives;
export const semanticLight = semantic[":root"] ?? [];
export const semanticDark = semantic[".dark"] ?? [];
export const componentTokens = component;

export function groupBy(tokens: Token[]): [string, Token[]][] {
  const map = new Map<string, Token[]>();
  for (const t of tokens) map.set(t.group, [...(map.get(t.group) ?? []), t]);
  return [...map.entries()];
}

export const typeScale = [...themeCss.matchAll(/^\s*--text-([a-z0-9-]+):\s*([\d.]+rem);/gm)]
  .filter((m) => !m[1].includes("--"))
  .map((m) => {
    const grab = (suffix: string) => themeCss.match(new RegExp(`--text-${m[1]}--${suffix}: *([^;]+);`))?.[1];
    return { name: m[1], size: m[2], lineHeight: grab("line-height"), weight: grab("font-weight") };
  });

export const radii = [...themeCss.matchAll(/^\s*--radius-([a-z]+):\s*([\d.]+rem);/gm)].map((m) => ({
  name: m[1],
  value: m[2],
}));

export const controlHeights = componentTokens.filter((t) => t.name.startsWith("--control-height"));

export const motionTokens = componentTokens.filter((t) => t.name.startsWith("--motion-"));
export const elevationTokens = semanticLight.filter((t) => t.name.startsWith("--elevation-"));
