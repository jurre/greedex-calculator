"use client";

import { Grid2X2, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortOption } from "./types";
import { SORT_OPTIONS } from "./types";

interface ProjectsControlsProps {
  view: "grid" | "table";
  setView: (view: "grid" | "table") => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

export function ProjectsControls({
  view,
  setView,
  sortBy,
  onSortChange,
}: ProjectsControlsProps) {
  const sortOptions = [
    { value: SORT_OPTIONS.name, label: "Name" },
    { value: SORT_OPTIONS.startDate, label: "Start Date" },
    { value: SORT_OPTIONS.createdAt, label: "Created" },
    { value: SORT_OPTIONS.updatedAt, label: "Updated" },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("grid")}
        >
          <Grid2X2 className="mr-2 size-4" />
          Grid
        </Button>
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          <TableProperties className="mr-2 size-4" />
          Table
        </Button>
      </div>

      {view === "grid" && onSortChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort:{" "}
              {sortOptions.find((option) => option.value === sortBy)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={sortBy === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
