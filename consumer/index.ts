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
    title:
      "https://open.spotify.com/track/0GO8y8jQk1PkHzS31d699N?si=6c61a3e96e864b2d",
  })
  .then((res) => {
    console.log(res);
  });
