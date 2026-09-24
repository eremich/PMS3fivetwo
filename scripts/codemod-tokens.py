"""Rename legacy shadcn colour/radius/type classes to design-system tokens.

Usage (from repo root):  python scripts/codemod-tokens.py [--check]
  default  rewrites src/**/*.tsx in place and prints what changed
  --check  changes nothing; exits 1 if legacy or palette classes are still present

Also use it on components added with `shadcn add`: they arrive with the old names.
Mapping lives in docs/design-system.md ("Naming").
"""
import glob
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "src")

# (utility, legacy name[/opacity]) -> new name; None = delete (mode-specific overrides are now in the tokens)
COLOR = {
    # text
    ("text", "muted-foreground"): "fg-secondary",
    ("text", "foreground"): "fg",
    ("text", "accent-foreground"): "fg",
    ("text", "popover-foreground"): "fg",
    ("text", "card-foreground"): "fg",
    ("text", "secondary-foreground"): "fg",
    ("text", "primary-foreground"): "fg-inverse",
    ("text", "primary-text"): "fg-link",
    ("text", "destructive"): "destructive-text",
    ("text", "white"): "fg-inverse",
    ("text", "sidebar-foreground"): "fg-secondary",
    # border / ring / divide
    ("border", "border"): "line",
    ("border", "input"): "line-strong",
    ("border", "ring"): "focus",
    ("border", "muted-foreground/50"): "line-strong-hover",
    ("divide", "border"): "line",
    ("ring", "foreground/10"): "line",
    ("ring", "background"): "canvas",
    ("ring", "destructive/20"): "field-ring-invalid",
    # backgrounds
    ("bg", "muted"): "subtle",
    ("bg", "muted/50"): "subtle",
    ("bg", "accent"): "surface-hover",
    ("bg", "card"): "surface",
    ("bg", "card/70"): "nav-hover",
    ("bg", "popover"): "overlay",
    ("bg", "background"): "canvas",
    ("bg", "primary/90"): "primary-hover",
    ("bg", "primary/10"): "primary-subtle",
    ("bg", "primary/5"): "primary-subtle",
    ("bg", "primary-foreground"): "fg-inverse",
    ("bg", "destructive/10"): "destructive-subtle",
    ("bg", "destructive/20"): "destructive-subtle-hover",
    ("bg", "warning/10"): "warning-subtle",
    ("bg", "border"): "line",
    ("bg", "input/50"): "field-disabled",
    ("bg", "black/10"): "scrim",
}
# Tokens that only existed to patch dark mode; the semantic tokens already resolve per theme.
DARK_ONLY_DELETE = re.compile(r"^(bg|text|border|ring)-(destructive|input|accent|primary|black|muted-foreground|foreground)(/\d+)?$")

RADIUS = {"sm": "control", "md": "control", "lg": "control", "xl": "surface", "2xl": "panel"}
SHADOW = {"xs": "raised", "sm": "raised", "md": "overlay", "lg": "overlay", "xl": "overlay"}
TEXT = {"xs": "caption", "sm": "body", "base": "body-lg", "lg": "h4", "xl": "h3", "2xl": "h2", "3xl": "h1"}

VARIANTS = r"((?:[\w\[\]\-*&>=():/.%]+:)*)"
COLOR_RE = re.compile(r"(?<=[\s\"'`({])" + VARIANTS + r"(bg|text|border|ring|divide)-([a-z-]+(?:/\d+)?)(?![\w/-])")
RADIUS_RE = re.compile(r"(?<=[\s\"'`({])" + VARIANTS + r"rounded((?:-[trblse]{1,2})?)-(sm|md|lg|xl|2xl)(?![\w-])")
SHADOW_RE = re.compile(r"(?<=[\s\"'`({])" + VARIANTS + r"shadow-(xs|sm|md|lg|xl)(?![\w-])")
TEXT_RE = re.compile(r"(?<=[\s\"'`({])" + VARIANTS + r"text-(xs|sm|base|lg|xl|2xl|3xl)(?![\w-])")

LEGACY = re.compile(
    r"(?<=[\s\"'`({:])(?:[\w\[\]\-*&>=():/.%]+:)*"
    r"(?:bg|text|border|ring|divide|outline|fill|stroke)-"
    r"(?:background|foreground|card(?:-foreground)?|popover(?:-foreground)?|primary-foreground|primary-text|secondary-foreground|"
    r"muted(?:-foreground)?|accent(?:-foreground)?|input|ring|sidebar[\w-]*|chart-\d|"
    r"(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|white|black)"
    r"(?![\w-])"
    r"|(?<=[\s\"'`({:])(?:[\w\[\]\-*&>=():/.%]+:)*rounded(?:-[trblse]{1,2})?-(?:sm|md|lg|xl|2xl|3xl|4xl)(?![\w-])"
    r"|(?<=[\s\"'`({:])(?:[\w\[\]\-*&>=():/.%]+:)*text-(?:xs|sm|base|lg|xl|2xl|3xl)(?![\w-])"
    r"|(?<=[\s\"'`({:])(?:[\w\[\]\-*&>=():/.%]+:)*shadow-(?:xs|sm|md|lg|xl)(?![\w-])"
)


def rewrite(text):
    def color(m):
        variants, util, name = m.group(1), m.group(2), m.group(3)
        key = (util, name)
        if "dark:" in variants and DARK_ONLY_DELETE.match(f"{util}-{name}"):
            return "\0"
        if key in COLOR:
            return f"{variants}{util}-{COLOR[key]}"
        return m.group(0)

    def radius(m):
        return f"{m.group(1)}rounded{m.group(2)}-{RADIUS[m.group(3)]}"

    def size(m):
        return f"{m.group(1)}text-{TEXT[m.group(2)]}"

    text = COLOR_RE.sub(color, text)
    text = RADIUS_RE.sub(radius, text)
    text = TEXT_RE.sub(size, text)
    text = SHADOW_RE.sub(lambda m: f"{m.group(1)}shadow-{SHADOW[m.group(2)]}", text)
    # remove deleted tokens together with one adjacent space
    text = re.sub(r" ?\0", "", text)
    return text


def main():
    check = "--check" in sys.argv
    leftovers = []
    changed = 0
    for path in glob.glob(os.path.join(ROOT, "**", "*.ts*"), recursive=True):
        if os.sep + "styles" + os.sep in path:
            continue
        original = open(path, encoding="utf-8").read()
        updated = original if check else rewrite(original)
        if updated != original:
            open(path, "w", encoding="utf-8", newline="").write(updated)
            changed += 1
        for m in LEGACY.finditer(updated):
            line = updated.count("\n", 0, m.start()) + 1
            leftovers.append(f"{os.path.relpath(path, ROOT)}:{line}  {m.group(0)}")
    if not check:
        print(f"rewrote {changed} files")
    if leftovers:
        print(f"{len(leftovers)} legacy classes remain:")
        print("\n".join(sorted(set(leftovers))))
        sys.exit(1)
    print("no legacy classes")


if __name__ == "__main__":
    main()
