import type { AppRouter } from "../server/router/_app";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3002/api/trpc" })],
});
