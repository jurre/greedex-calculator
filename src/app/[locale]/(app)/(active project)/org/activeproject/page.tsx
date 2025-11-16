"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  CalendarIcon,
  Edit2Icon,
  MapPinIcon,
  QrCodeIcon,
  ShareIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useFormatter } from "next-intl";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditProjectForm from "@/components/features/projects/edit-project-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProjectPermissions } from "@/lib/better-auth/permissions-utils";
import { Link } from "@/lib/i18n/navigation";
import { orpc, orpcQuery } from "@/lib/orpc/orpc";

export default function ControlActiveProjectPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const format = useFormatter();
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const { data: session } = useSuspenseQuery(
    orpcQuery.betterauth.getSession.queryOptions(),
  );

  const { data: projects } = useSuspenseQuery(
    orpcQuery.project.list.queryOptions(),
  );

  const activeProjectId = session?.session?.activeProjectId;
  const activeProject = projects?.find(
    (project) => project.id === activeProjectId,
  );

  // Get participants for the active project
  const { data: participants } = useSuspenseQuery({
    ...orpcQuery.project.getParticipants.queryOptions({
      projectId: activeProjectId || "",
    }),
    enabled: !!activeProjectId,
  });

  // Get user permissions
  const {
    canUpdate,
    canDelete,
    isPending: permissionsPending,
  } = useProjectPermissions();

  // Generate participation URL
  const participationUrl =
    typeof window !== "undefined" && activeProjectId
      ? `${window.location.origin}/project/${activeProjectId}/participate`
      : "";

  // Generate QR code when modal opens
  useEffect(() => {
    if (isQrModalOpen && participationUrl) {
      QRCode.toDataURL(participationUrl, {
        width: 300,
        margin: 2,
      })
        .then((url) => {
          setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
          toast.error("Failed to generate QR code");
        });
    }
  }, [isQrModalOpen, participationUrl]);

  // Delete mutation
  const { mutateAsync: deleteProjectMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: () => orpc.project.delete({ id: activeProjectId || "" }),
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
    if (!activeProject) return;

    const confirmed = await confirm({
      title: "Are you sure?",
      description: `This will permanently delete the project "${activeProject.name}". This action cannot be undone.`,
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(participationUrl);
    toast.success("Participation link copied to clipboard!");
  };

  if (!activeProject) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="mb-2 font-semibold text-xl">No Active Project</h2>
          <p className="mb-4 text-muted-foreground">
            Please select a project from the projects page to view its details.
          </p>
          <Button asChild>
            <Link href="/org/dashboard?tab=projects">Go to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Project Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-bold text-3xl">{activeProject.name}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {activeProject.location}, {activeProject.country}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format.dateTime(activeProject.startDate, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {format.dateTime(activeProject.endDate, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canUpdate && (
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                disabled={permissionsPending}
              >
                <Edit2Icon className="h-4 w-4" />
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || permissionsPending}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {activeProject.welcomeMessage && (
          <p className="text-muted-foreground">
            {activeProject.welcomeMessage}
          </p>
        )}
      </div>

      {/* Participation Link Section */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShareIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Participant Link</h2>
        </div>
        <p className="mb-4 text-muted-foreground text-sm">
          Share this link with participants to allow them to join the project
          and submit their travel activities.
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 rounded-md border bg-muted px-4 py-2 font-mono text-sm">
            {participationUrl}
          </div>
          <Button variant="outline" onClick={copyToClipboard}>
            Copy Link
          </Button>
          <Button variant="outline" onClick={() => setIsQrModalOpen(true)}>
            <QrCodeIcon className="h-4 w-4" />
            QR Code
          </Button>
        </div>
      </div>

      {/* Participants Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">
            Participants ({participants?.length || 0})
          </h2>
        </div>

        {participants && participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
              >
                <Avatar>
                  <AvatarImage
                    src={participant.user.image || undefined}
                    alt={participant.user.name}
                  />
                  <AvatarFallback>
                    {participant.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{participant.user.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {participant.user.email}
                  </p>
                </div>
                <div className="text-muted-foreground text-sm">
                  Joined{" "}
                  {format.dateTime(participant.createdAt, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <UsersIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="mb-1 font-medium">No participants yet</p>
            <p className="text-muted-foreground text-sm">
              Share the participation link to invite people to this project.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {canUpdate && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <EditProjectForm
              project={activeProject}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participation QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the participation page
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCodeDataUrl ? (
              // biome-ignore lint/performance/noImgElement: QR code is a base64 data URL, not an external image
              <img
                src={qrCodeDataUrl}
                alt="QR Code for participation link"
                className="rounded-lg border"
              />
            ) : (
              <div className="flex h-[300px] w-[300px] items-center justify-center rounded-lg border">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            <p className="break-all text-center font-mono text-muted-foreground text-xs">
              {participationUrl}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialogComponent />
    </div>
  );
}
