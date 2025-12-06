/**
 * Distance constants for project activities
 *
 * Single source of truth for distance validation, UI inputs, and database constraints.
 */

/**
 * Minimum distance in kilometers for project activities
 * Activities must have at least this distance to be valid
 */
export const MIN_DISTANCE_KM = 0.1;

/**
 * Step increment for distance input fields
 * Distance values must be multiples of this step
 */
export const DISTANCE_KM_STEP = 0.1;

/**
 * Database decimal precision for distance_km column
 * Total number of digits (both before and after decimal point)
 */
export const DECIMAL_PRECISION = 10;

/**
 * Database decimal scale for distance_km column
 * Number of digits after the decimal point
 * Scale of 1 supports step of 0.1 (one decimal place)
 */
export const DECIMAL_SCALE = 1;

/**
 * Check if a distance value is a valid multiple of the step increment
 *
 * @param value - The distance value to check
 * @param step - The step increment (defaults to DISTANCE_KM_STEP)
 * @returns true if the value is a valid multiple of the step
 */
export function isMultipleOfStep(
  value: number,
  step = DISTANCE_KM_STEP,
): boolean {
  // Handle floating point precision by using integer arithmetic
  // Multiply by 10 to convert to tenths, then check if it's an integer
  const multiplier = 1 / step;
  const scaled = Math.round(value * multiplier);
  return Math.abs(value * multiplier - scaled) < Number.EPSILON;
}

/**
 * Zod refinement function for distance validation
 * Ensures the distance is a valid multiple of the step increment
 *
 * @param value - The distance value to validate
 * @returns true if valid, false otherwise
 */
export function validateDistanceStep(value: number): boolean {
  return isMultipleOfStep(value);
}
