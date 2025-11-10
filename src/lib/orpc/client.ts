import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { Router } from "./router";

declare global {
  // eslint-disable-next-line no-var
  var $client: RouterClient<Router> | undefined;
}

/**
 * RPC Link configuration for client-side requests
 * Only used in browser environments
 */
const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${window.location.origin}/api/rpc`;
  },
  headers: async () => {
    // Client-side headers can be added here if needed
    return {};
  },
});

/**
 * oRPC client
 * Uses server-side client during SSR if available, falls back to browser client
 * This provides optimal performance by avoiding HTTP requests during SSR
 */
export const orpc: RouterClient<Router> =
  globalThis.$client ?? createORPCClient(link);
