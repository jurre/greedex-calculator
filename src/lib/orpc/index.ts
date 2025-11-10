/**
 * oRPC module exports
 * Central export point for oRPC functionality
 */

// Client for use in components and pages (works on both client and server)
export { orpc } from "./client";

// Context and middleware for creating custom procedures (server-side only)
export { base } from "./context";
export { authMiddleware, authorized } from "./middleware";

// Types for type-safe usage
export type { Router } from "./router";

// Re-export router for server-side use
export { router } from "./router";
