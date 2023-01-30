import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";

import { songRouter } from "./song";
import { inferAsyncReturnType } from "@trpc/server";

const appRouter = router({
  song: songRouter,
  test: publicProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .query(async (req) => {
      return { title: req.input.title };
    }),
});

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

export { createContext };

export default appRouter;

export type AppRouter = typeof appRouter;
