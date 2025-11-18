"use client";

import { columns } from "@/components/features/projects/columns";
import { DataTable } from "@/components/features/projects/data-table";
import type { ProjectType } from "@/components/features/projects/types";
import { DEFAULT_PROJECT_SORT } from "@/components/features/projects/types";

export function ProjectsTable({ projects }: { projects: ProjectType[] }) {
  // Map the default sort to TanStack format
  const defaultSorting = [{ id: DEFAULT_PROJECT_SORT, desc: false }];

  return (
    <DataTable
      columns={columns}
      data={projects}
      searchKey="name"
      searchPlaceholder="Filter projects..."
      defaultSorting={defaultSorting}
    />
  );
}
