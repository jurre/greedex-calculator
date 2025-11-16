"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { orpcQuery } from "@/lib/orpc/orpc";

export default function ControlActiveProjectPage(
  //   {
  //   params,
  // }: {
  //   params: Promise<{ param: string }>;
  // }
) {
  // const { param } = await params;

  const { data: session } = useSuspenseQuery(
    orpcQuery.betterauth.getSession.queryOptions(),
  );

  const { data: projects } = useSuspenseQuery(
    orpcQuery.project.list.queryOptions(),
  );

  const activeProject = projects?.find(
    (project) => project.id === session?.session?.activeProjectId,
  );

  return (
    <div>
      <h1>Active project</h1>
      <pre>{JSON.stringify(activeProject, null, 2)}</pre>
    </div>
  );
}
