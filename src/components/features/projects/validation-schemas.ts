import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import {
  DISTANCE_KM_STEP,
  MIN_DISTANCE_KM,
} from "@/components/features/projects/types";
import {
  organization,
  projectActivitiesTable,
  projectsTable,
  user,
} from "@/lib/drizzle/schema";
import { validateDistanceStep } from "@/lib/utils/distance-utils";

// Form schema (only user-provided fields)
export const ProjectFormSchema = createInsertSchema(projectsTable).omit({
  id: true,
  responsibleUserId: true,
  createdAt: true,
  updatedAt: true,
});

export const ProjectWithRelationsSchema = createSelectSchema(
  projectsTable,
).extend({
  responsibleUser: createSelectSchema(user),
  organization: createSelectSchema(organization),
});

export const ProjectUpdateFormSchema = createUpdateSchema(projectsTable).omit({
  id: true,
  responsibleUserId: true,
  createdAt: true,
  updatedAt: true,
});

// Activity-related schemas (moved here to break circular dependency)
export const EditActivityFormItemSchema = createUpdateSchema(
  projectActivitiesTable,
)
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    distanceKm: z
      .number()
      .min(MIN_DISTANCE_KM, `Distance must be at least ${MIN_DISTANCE_KM} km`)
      .refine(
        validateDistanceStep,
        `Distance must be in increments of ${DISTANCE_KM_STEP} km`,
      ),
    isNew: z.boolean().optional(), // Track if activity is new
    isDeleted: z.boolean().optional(), // Track if activity should be deleted
  });

// Combined form schema with activities
export const EditProjectWithActivitiesSchema = ProjectUpdateFormSchema.extend({
  activities: z.array(EditActivityFormItemSchema).optional(),
});

// Schema for creating activities from forms/client (omits userId, server provides it from context)
export const CreateActivityInputSchema = createInsertSchema(
  projectActivitiesTable,
)
  .omit({
    id: true,
    userId: true, // Server provides from authenticated user context
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    distanceKm: z
      .number()
      .min(MIN_DISTANCE_KM, `Distance must be at least ${MIN_DISTANCE_KM} km`)
      .refine(
        validateDistanceStep,
        `Distance must be in increments of ${DISTANCE_KM_STEP} km`,
      ),
  });

// Schema for updating activities from client (omits userId, cannot be changed)
export const UpdateActivityInputSchema = createUpdateSchema(
  projectActivitiesTable,
)
  .omit({
    id: true,
    userId: true, // Cannot be changed after creation
    projectId: true, // Cannot change which project the activity belongs to
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    distanceKm: z
      .number()
      .min(MIN_DISTANCE_KM, `Distance must be at least ${MIN_DISTANCE_KM} km`)
      .refine(
        validateDistanceStep,
        `Distance must be in increments of ${DISTANCE_KM_STEP} km`,
      )
      .optional(),
  });

export const ActivityFormItemSchema = CreateActivityInputSchema.omit({
  projectId: true,
});

// Combined form schema with optional activities
export const CreateProjectWithActivitiesSchema = ProjectFormSchema.extend({
  activities: z.array(ActivityFormItemSchema).optional(),
});

export type CreateProjectWithActivities = z.infer<
  typeof CreateProjectWithActivitiesSchema
>;

export const ProjectActivityWithRelationsSchema = createSelectSchema(
  projectActivitiesTable,
).extend({
  project: createSelectSchema(projectsTable).optional(),
  user: createSelectSchema(user).optional(),
});

// Schema for Project with Activities included
export const ProjectWithActivitiesSchema = createSelectSchema(
  projectsTable,
).extend({
  responsibleUser: createSelectSchema(user),
  organization: createSelectSchema(organization),
  activities: z.array(ProjectActivityWithRelationsSchema),
});
