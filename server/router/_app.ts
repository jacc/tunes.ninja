import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";

import { songRouter } from "./song";
import { inferAsyncReturnType } from "@trpc/server";
import { guildRouter } from "./guild";

const appRouter = router({
  song: songRouter,
  guild: guildRouter,
});

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

export { createContext };

export default appRouter;

export type AppRouter = typeof appRouter;
