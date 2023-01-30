import type { AppRouter } from "../server/router/_app";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3002/api/" })],
});

// send a call to /test with input { title: "HELLO" }
// client.test.query({ title: "HELLO" }).then((res) => {
//   console.log(res);
// });

client.song.links
  .query({
    title: "123",
  })
  .then((res) => {
    console.log(res);
  });
