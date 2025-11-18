"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, EyeIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useFormatter } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import type { ProjectType } from "@/components/features/projects/types";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useProjectPermissions } from "@/lib/better-auth/permissions-utils";
import { Link } from "@/lib/i18n/navigation";
import { orpc, orpcQuery } from "@/lib/orpc/orpc";
import EditProjectForm from "./edit-project-form";
import { SORT_OPTIONS } from "./types";

function DateCell({ date }: { date: Date }) {
  const format = useFormatter();
  return (
    <div>
      {format.dateTime(date, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </div>
  );
}

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: SORT_OPTIONS.name,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue(SORT_OPTIONS.name)}</div>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: SORT_OPTIONS.startDate,
    header: ({ column, table }) => (
      <SortableHeader
        column={column}
        table={table}
        title="Start Date"
        isNumeric
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue(SORT_OPTIONS.startDate) as Date;
      return <DateCell date={date} />;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: SORT_OPTIONS.createdAt,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Created" isNumeric />
    ),
    cell: ({ row }) => {
      const date = row.getValue(SORT_OPTIONS.createdAt) as Date;
      return <DateCell date={date} />;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: SORT_OPTIONS.updatedAt,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Updated" isNumeric />
    ),
    cell: ({ row }) => {
      const date = row.getValue(SORT_OPTIONS.updatedAt) as Date;
      return <DateCell date={date} />;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;
      return <ProjectActionsCell project={project} />;
    },
  },
];

function ProjectActionsCell({ project }: { project: ProjectType }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const {
    canUpdate,
    canDelete,
    isPending: permissionsPending,
  } = useProjectPermissions();

  const { mutateAsync: deleteProjectMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: () => orpc.project.delete({ id: project.id }),
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Project deleted successfully");
          queryClient.invalidateQueries({
            queryKey: orpcQuery.project.list.queryKey(),
          });
        } else {
          toast.error("Failed to delete project");
        }
      },
      onError: (err: unknown) => {
        console.error(err);
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "An error occurred while deleting the project");
      },
    });

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Are you sure?",
      description: `This will permanently delete the project "${project.name}". This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDestructive: true,
    });

    if (confirmed) {
      try {
        await deleteProjectMutation();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/org/projects/${project.id}`}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          {canUpdate && (
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit2Icon className="mr-2 h-4 w-4" />
              Edit Project
            </DropdownMenuItem>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting || permissionsPending}
                className="text-destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdate && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <EditProjectForm
              project={project}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDialogComponent />
    </>
  );
}
