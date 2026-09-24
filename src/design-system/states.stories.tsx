import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { FilterChip } from "@/components/ds/filter-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

/**
 * Every interactive component in every state, side by side. States are forced with
 * storybook-addon-pseudo-states: only elements marked data-force="..." receive the state,
 * so one page can show default, hover, focus and pressed at the same time.
 */
type Force = "hover" | "focus" | "active";
type Render = (force?: Force, disabled?: boolean) => ReactNode;

const noop = () => undefined;

const rows: { name: string; note?: string; render: Render; skip?: Force[]; noDisabled?: boolean }[] = [
  { name: "Button · primary", render: (f, d) => <Button data-force={f} disabled={d}>Register</Button> },
  { name: "Button · secondary", render: (f, d) => <Button variant="secondary" data-force={f} disabled={d}>Register</Button> },
  { name: "Button · outline", render: (f, d) => <Button variant="outline" data-force={f} disabled={d}>Cancel</Button> },
  { name: "Button · ghost", render: (f, d) => <Button variant="ghost" data-force={f} disabled={d}>Close</Button> },
  { name: "Button · destructive", render: (f, d) => <Button variant="destructive" data-force={f} disabled={d}>Created in error</Button> },
  { name: "Input", skip: ["active"], render: (f, d) => <Input data-force={f} disabled={d} placeholder="07700 900000" className="w-44" /> },
  {
    name: "Filter chip",
    render: (f, d) => (
      <FilterChip active={false} onClick={noop} data-force={f} disabled={d}>
        Urgent
      </FilterChip>
    ),
  },
  {
    name: "Filter chip · selected",
    noDisabled: true,
    render: (f) => (
      <FilterChip active onClick={noop} data-force={f}>
        Urgent
      </FilterChip>
    ),
  },
  {
    name: "Clickable table row",
    skip: [],
    noDisabled: true,
    render: (f) => (
      <div className="w-44 overflow-hidden rounded-control border border-line bg-surface">
        <Table>
          <TableBody>
            <TableRow onClick={noop} data-force={f}>
              <TableCell>Liam Davies</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    ),
  },
];

const columns: { label: string; force?: Force; disabled?: boolean }[] = [
  { label: "Default" },
  { label: "Hover", force: "hover" },
  { label: "Focus (keyboard)", force: "focus" },
  { label: "Pressed", force: "active" },
  { label: "Disabled", disabled: true },
];

function StatesMatrix() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">Interaction states</h1>
        <p className="max-w-3xl text-body text-fg-secondary">
          One definition per state, reused by every component (see docs/design-system.md). Hover fills use the surface or
          variant hover token, focus is a 2px keyboard ring, pressed uses the pressed token, disabled is 50% with a
          not-allowed cursor. Non-clickable rows have no hover.
        </p>
      </header>
      <div className="overflow-x-auto rounded-surface border border-line bg-surface">
        <table className="w-full text-body">
          <thead className="bg-table-header">
            <tr>
              <th className="px-4 py-2.5 text-left text-caption font-medium text-table-header-text">Component</th>
              {columns.map((c) => (
                <th key={c.label} className="px-4 py-2.5 text-left text-caption font-medium text-table-header-text">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="px-4 py-4 align-middle font-medium">{row.name}</td>
                {columns.map((c) => {
                  const unavailable = (c.force && row.skip?.includes(c.force)) || (c.disabled && row.noDisabled);
                  return (
                    <td key={c.label} className="px-4 py-4 align-middle">
                      {unavailable ? <span className="text-caption text-fg-secondary">n/a</span> : row.render(c.force, c.disabled)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Interaction states", tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    pseudo: {
      hover: ['[data-force="hover"]'],
      focusVisible: ['[data-force="focus"]'],
      active: ['[data-force="active"]'],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Matrix: Story = { render: () => <StatesMatrix /> };
