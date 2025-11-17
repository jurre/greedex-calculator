import { headers } from "next/headers";
import ActiveProjectHeaderClient from "@/components/features/projects/ActiveProjectHeaderClient";
import ParticipantsList from "@/components/features/projects/ParticipantsList";
import ParticipationControlsClient from "@/components/features/projects/ParticipationControlsClient";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { auth } from "@/lib/better-auth";
import { Link } from "@/lib/i18n/navigation";
import { orpc } from "@/lib/orpc/orpc";

export default async function ControlActiveProjectPage() {
  // Fetch session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const activeProjectId = session?.session.activeProjectId;

  // Get origin for consistent URL rendering
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${protocol}://${host}`;

  if (!activeProjectId) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Active Project</EmptyTitle>
            <EmptyDescription>
              Please select a project from the projects page to view its
              details.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/org/dashboard?tab=projects">Go to Projects</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  // Fetch projects
  const projects = await orpc.project.list();

  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  );

  if (!activeProject) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Project Not Found</EmptyTitle>
            <EmptyDescription>
              The active project could not be found.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/org/dashboard?tab=projects">Go to Projects</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  // Fetch participants
  const participants = await orpc.project.getParticipants({
    projectId: activeProjectId,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <ActiveProjectHeaderClient activeProject={activeProject} />

      <ParticipationControlsClient
        activeProjectId={activeProjectId}
        origin={origin}
      />

      <ParticipantsList participants={participants} />
    </div>
  );
}
