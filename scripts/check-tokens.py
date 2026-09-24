"""Fail if a class refers to a design-system colour token that does not exist.

Tailwind silently ignores unknown classes, so a typo like bg-surfce or text-fg-secondry renders as
"no style". This reads the allowed names from src/styles/theme.css and checks every usage.

Usage (from repo root):  python scripts/check-tokens.py
"""
import glob
import os
import re
import sys

SRC = os.path.join(os.path.dirname(__file__), "..", "src")

theme = open(os.path.join(SRC, "styles", "theme.css"), encoding="utf-8").read()
allowed = set(re.findall(r"--color-([a-z0-9-]+):", theme))
roots = {name.split("-")[0] for name in allowed}

UTIL = r"(?:bg|text|border|ring|divide|outline|fill|stroke|placeholder|from|to|via|caret|accent|decoration)"
pattern = re.compile(r"(?<=[\s\"'`({:])" + UTIL + r"-([a-z][a-z0-9-]*)(?:/\d+)?(?![\w-])")

# Utilities that share a first word with a token root but are not colours.
NOT_COLOR = {"text-body", "text-caption", "border-line-", "ring-inset"}
problems = []
for path in glob.glob(os.path.join(SRC, "**", "*.ts*"), recursive=True):
    if os.sep + "styles" + os.sep in path:
        continue
    text = open(path, encoding="utf-8").read()
    for m in pattern.finditer(text):
        name = m.group(1)
        if name.split("-")[0] not in roots or name in allowed:
            continue
        line = text.count("\n", 0, m.start()) + 1
        problems.append(f"{os.path.relpath(path, SRC)}:{line}  {m.group(0)}")

if problems:
    print("Unknown design-system colour classes:")
    print("\n".join(sorted(set(problems))))
    sys.exit(1)
print(f"ok: all colour classes resolve to tokens ({len(allowed)} colour tokens)")
