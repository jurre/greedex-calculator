import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { orpcQuery } from "@/lib/orpc/orpc";
import { getQueryClient } from "@/lib/react-query/hydration";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prefetch project data including the members / participants
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    // orpc query needs to be implemented
  );
  void queryClient.prefetchQuery(orpcQuery.organization.list.queryOptions());
  void queryClient.prefetchQuery(orpcQuery.project.list.queryOptions());

  return (
    <Suspense fallback={<Loader2Icon className="animate-spin" />}>
      {children}
    </Suspense>
  );
}
