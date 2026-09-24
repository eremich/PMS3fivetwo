import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CalendarPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { FilterChip } from "./filter-chip";
import { PageHeader } from "./page-header";
import { SearchInput } from "./search-input";
import { SectionPanel } from "./section-panel";
import { StatTile } from "./stat-tile";
import { Toolbar } from "./toolbar";

const meta = { title: "Components/Layout blocks", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  name: "Page header",
  render: () => (
    <PageHeader
      title="Patients"
      description="Search and manage patient records."
      actions={
        <Button>
          <CalendarPlus aria-hidden="true" />
          Register patient
        </Button>
      }
    />
  ),
};

export const FiltersToolbar: Story = {
  name: "Toolbar with search and chips",
  render: function Render() {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState("all");
    return (
      <Toolbar meta="Showing 9 of 9">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by patient name" />
        {["all", "red", "urgent"].map((id) => (
          <FilterChip key={id} active={active === id} onClick={() => setActive(id)}>
            {id === "all" ? "All priorities" : id === "red" ? "Red flag" : "Urgent"}
          </FilterChip>
        ))}
      </Toolbar>
    );
  },
};

export const Stats: Story = {
  name: "Stat tiles",
  render: () => (
    <div className="grid w-[40rem] grid-cols-3 gap-4">
      <StatTile label="Active tasks" value={5} emphasis />
      <StatTile label="Pending" value={2} />
      <StatTile label="Scheduled" value={2} />
    </div>
  ),
};

export const Empty: Story = {
  name: "Empty state",
  render: () => (
    <div className="w-[36rem]">
      <EmptyState message="No patients match your search." action={<Button variant="outline">Clear search</Button>} />
    </div>
  ),
};

export const Panel: Story = {
  name: "Section panel",
  render: () => (
    <div className="w-[28rem]">
      <SectionPanel icon={FileText} title="Referral form">
        <p className="text-body text-fg-secondary">No referral form added yet.</p>
        <Button variant="outline" size="sm" className="w-fit">
          Add referral form
        </Button>
      </SectionPanel>
    </div>
  ),
};
