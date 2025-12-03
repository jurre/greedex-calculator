import { headers } from "next/headers";
import { Suspense } from "react";
import ActiveProjectContent from "@/components/features/projects/ActiveProjectContent";
import { ActiveProjectHeaderClientSkeleton } from "@/components/features/projects/ActiveProjectHeaderClient";
import ParticipantsList, {
  ParticipantsListSkeleton,
} from "@/components/features/projects/ParticipantsList";
import { ParticipationControlsClientSkeleton } from "@/components/features/projects/ParticipationControlsClient";
import { auth } from "@/lib/better-auth";
import { orpcQuery } from "@/lib/orpc/orpc";
import { getQueryClient } from "@/lib/react-query/hydration";

export default async function ControlActiveProjectPage() {
  const queryClient = getQueryClient();

  // Get session for server-side data
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Prefetch all necessary data
  void queryClient.prefetchQuery(orpcQuery.betterauth.getSession.queryOptions());
  void queryClient.prefetchQuery(orpcQuery.projects.list.queryOptions());
  void queryClient.prefetchQuery(orpcQuery.organizations.list.queryOptions());
  void queryClient.prefetchQuery(
    orpcQuery.organizations.getActive.queryOptions(),
  );

  // Prefetch participants data if we have an active project
  const activeProjectId = session?.session?.activeProjectId;
  if (activeProjectId) {
    void queryClient.prefetchQuery(
      orpcQuery.projects.getParticipants.queryOptions({
        input: {
          projectId: activeProjectId,
        },
      }),
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <>
            <ActiveProjectHeaderClientSkeleton />
            <ParticipationControlsClientSkeleton />
          </>
        }
      >
        <ActiveProjectContent />
      </Suspense>
      <Suspense fallback={<ParticipantsListSkeleton />}>
        {activeProjectId ? (
          <ParticipantsList activeProjectId={activeProjectId} />
        ) : null}
      </Suspense>
    </>
  );
}
