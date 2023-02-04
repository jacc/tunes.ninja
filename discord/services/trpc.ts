import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/router/_app";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3002/api/" })],
});
