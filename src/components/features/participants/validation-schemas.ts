import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { ProjectActivityWithRelationsSchema } from "@/components/features/projects/validation-schemas";
import {
  projectParticipantsTable,
  user as userTable,
} from "@/lib/drizzle/schema";

// Schema for participant with user details (as returned by the API)
export const ProjectParticipantWithUserSchema = createSelectSchema(
  projectParticipantsTable,
).extend({
  user: createSelectSchema(userTable).omit({
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// Schema for participant with user details and activities
// This represents a participant in a project with all their activities
export const ProjectParticipantWithActivitiesSchema = createSelectSchema(
  projectParticipantsTable,
).extend({
  user: createSelectSchema(userTable),
  activities: z.array(ProjectActivityWithRelationsSchema),
});

// Computed fields type for participant statistics
// These are calculated on-the-fly and not stored in the database
export type ParticipantComputedFields = {
  totalCO2: number;
  rank?: number;
};
