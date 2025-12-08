import type { z } from "zod";
import type {
  ParticipantComputedFields,
  ProjectParticipantWithActivitiesSchema,
} from "@/components/features/participants/validation-schemas";
import type { ActivityType } from "@/components/features/projects/types";

/**
 * Participant type inferred from database schema with relations
 * This is the base type from the database
 */
export type ParticipantBase = z.infer<
  typeof ProjectParticipantWithActivitiesSchema
>;

/**
 * Participant type for UI display with computed fields
 * This extends the database type with calculated values
 */
export type Participant = {
  id: string;
  name: string;
  country: string | null;
  activities: Activity[];
} & ParticipantComputedFields;

/**
 * Activity type inferred from database schema
 * Extended with computed CO2 field for UI display
 */
export type Activity = {
  id: string;
  type: ActivityType;
  distanceKm: number;
  co2Kg: number;
};

/**
 * Project statistics type - computed values only, not persisted
 * This is calculated on-the-fly from participant and activity data
 */
export interface ProjectStats {
  totalParticipants: number;
  totalCO2: number;
  averageCO2: number;
  breakdownByType: Record<
    ActivityType,
    {
      distance: number;
      co2: number;
      count: number;
    }
  >;
  treesNeeded: number; // Average tree absorbs ~22kg CO₂ per year, ~1 ton in lifetime (~45 years)
}
