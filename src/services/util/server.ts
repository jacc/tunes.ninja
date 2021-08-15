import express from "express";
import * as TopGG from "@top-gg/sdk";
import { redis } from "../redis";
import * as logs from "../events/logging";
import { AbstractAppService } from "./abstract-app-service";

const SIX_HOURS_IN_SECONDS = 60 * 60 * 6;

export class VotesServer extends AbstractAppService {
  private readonly app = express();
  private readonly webhook = new TopGG.Webhook(
    `${process.env.TOPGG_WEBHOOK_AUTH}`
  );

  start(): void {
    this.app.post(
      "/vote",
      this.webhook.listener(async (vote) => {
        const user = this.client.users.cache.get(vote.user);

        await redis.set(
          `user:voted:${vote.user}`,
          JSON.stringify(true),
          "ex",
          SIX_HOURS_IN_SECONDS
        );

        await logs.newVote(this.client, user || vote.user);
      })
    );

    this.app.listen(process.env.SERVER_PORT || 8097);
  }
}
