// import { initTRPC, inferAsyncReturnType } from "@trpc/server";
// import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import appRouter, { createContext } from "./router/_app";

const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3002, () => {
  console.log("Server started on http://localhost:3002");
});

// import { songRouter } from "./router/song";

// const createContext = ({
//   req,
//   res,
// }: trpcExpress.CreateExpressContextOptions) => ({}); // no context
// type Context = inferAsyncReturnType<typeof createContext>;

// const t = initTRPC.create();

// export const middleware = t.middleware;
// export const router = t.router;
// export const publicProcedure = t.procedure;

// export const appRouter = t.router({
//   song: songRouter,
// });

// export type AppRouter = typeof appRouter;

// app.listen(3000);
