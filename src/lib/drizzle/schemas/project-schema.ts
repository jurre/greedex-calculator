import { relations } from "drizzle-orm";
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "@/lib/drizzle/schemas/auth-schema";

// Define activity types as a const array (single source of truth)
const activityTypeValues = ["boat", "bus", "train", "car"] as const;
export type ActivityType = (typeof activityTypeValues)[number];

// Define participant roles as a const array (single source of truth)
const participantRoleValues = ["participant", "leader"] as const;
export type ParticipantRole = (typeof participantRoleValues)[number];

// ============================================================================
// TABLES
// ============================================================================

export const projectTable = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  country: text("country").notNull(),
  welcomeMessage: text("welcome_message"),

  // Foreign key to user (responsible team member)
  responsibleUserId: text("responsible_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Foreign key to organization (assuming projects belong to organizations)
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projectActivity = pgTable("project_activity", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, { onDelete: "cascade" }),

  // Activity type: 'boat', 'bus', 'train', 'car'
  activityType: text("activity_type", { enum: activityTypeValues })
    .$type<ActivityType>()
    .notNull(),

  // Distance in kilometers
  distanceKm: decimal("distance_km", { precision: 10, scale: 2 }).notNull(),

  // Optional fields for additional activity details
  description: text("description"),
  activityDate: timestamp("activity_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projectParticipant = pgTable("project_participant", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role", { enum: participantRoleValues })
    .$type<ParticipantRole>()
    .default("participant")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

// project - relations
export const projectRelations = relations(projectTable, ({ one, many }) => ({
  responsibleUser: one(user, {
    fields: [projectTable.responsibleUserId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [projectTable.organizationId],
    references: [organization.id],
  }),
  activities: many(projectActivity),
  participants: many(projectParticipant),
}));

// projectActivity - relations
export const projectActivityRelations = relations(
  projectActivity,
  ({ one }) => ({
    project: one(projectTable, {
      fields: [projectActivity.projectId],
      references: [projectTable.id],
    }),
  }),
);

// projectParticipant - relations
export const projectParticipantRelations = relations(
  projectParticipant,
  ({ one }) => ({
    project: one(projectTable, {
      fields: [projectParticipant.projectId],
      references: [projectTable.id],
    }),
    user: one(user, {
      fields: [projectParticipant.userId],
      references: [user.id],
    }),
  }),
);
