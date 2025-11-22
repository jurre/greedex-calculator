import { z } from "zod";
import { MemberWithUserSchema } from "@/components/features/organizations/types";
import { auth } from "@/lib/better-auth";
import { base } from "@/lib/orpc/context";
import { authorized } from "@/lib/orpc/middleware";

/**
 * List user's organizations using Better Auth
 * Uses Better Auth's implicit organization.list endpoint
 */
export const listOrganizations = base.handler(async ({ context }) => {
  const organizations = await auth.api.listOrganizations({
    headers: context.headers,
  });
  return organizations || [];
});

export const searchMembers = authorized
  .route({
    method: "POST",
    path: "/organizations/members/search",
    description: "Search members with flexible filters",
    tags: ["Organizations"],
  })
  .input(
    z.object({
      organizationId: z.string(),
      filters: z
        .object({
          roles: z.array(z.string()).optional(),
          //TODO: Add more filters easily in the future
          // search: z.string().optional(),
          // status: z.enum(["active", "pending", "inactive"]).optional(),
          // limit: z.number().optional(),
          // offset: z.number().optional(),
        })
        .optional(),
    }),
  )
  .output(
    z.object({
      members: z.array(MemberWithUserSchema),
      total: z.number(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { organizationId, filters } = input;

    const allMembers = [];
    for (const role of filters?.roles || []) {
      const result = await auth.api.listMembers({
        query: {
          organizationId,
          filterField: "role",
          filterOperator: "eq",
          filterValue: role,
        },
        headers: context.headers,
      });
      allMembers.push(...(result?.members || []));
    }

    // Deduplicate members by id in case of overlapping roles
    const uniqueMembers = allMembers.filter(
      (member, index, self) =>
        index === self.findIndex((m) => m.id === member.id),
    );

    return {
      members: uniqueMembers,
      total: uniqueMembers.length,
    };
  });
