import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PatientAvatar } from "../ds/patient-avatar";
import { TaskStatusBadge } from "../ds/status-badge";
import { TableCard } from "../ds/table-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

const rows = [
  { name: "Liam Davies", category: "Radiology", status: "PENDING" as const },
  { name: "Ethan Taylor", category: "Cardiology", status: "SCHEDULED" as const },
  { name: "Ava Wilson", category: "Respiratory", status: "COMPLETE" as const },
];

const meta = { title: "Components/Table", component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ClickableRows: Story = {
  name: "Clickable rows",
  render: () => (
    <TableCard className="w-[36rem]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name} onClick={() => undefined}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <PatientAvatar name={r.name} />
                  <span className="font-semibold">{r.name}</span>
                </div>
              </TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>
                <TaskStatusBadge status={r.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  ),
};

export const StaticRows: Story = {
  name: "Static rows (no hover)",
  render: () => (
    <TableCard className="w-[36rem]">
      <Table>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  ),
};
