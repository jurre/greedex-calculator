import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QuestionnaireForm } from "@/components/participate/questionnaire-form";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc/orpc";

interface ParticipatePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch project data with activities from the database
async function getProjectData(projectId: string) {
  try {
    const data = await orpc.projects.getForParticipation({ id: projectId });
    return {
      ...data.project,
      activities: data.activities,
    };
  } catch (error) {
    console.error("Failed to fetch project data:", error);
    return null;
  }
}

export default async function ParticipatePage({ params }: ParticipatePageProps) {
  const { id } = await params;

  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <QuestionnaireForm project={project} />
    </Suspense>
  );
}
