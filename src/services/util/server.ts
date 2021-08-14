import express from "express";
import * as TopGG from "@top-gg/sdk";
import {redis***REMOVED*** from "../redis";
import * as logs from "../events/logging";
import {AbstractAppService***REMOVED*** from "./abstract-app-service";

const SIX_HOURS_IN_SECONDS = 60 * 60 * 6;

export class VotesServer extends AbstractAppService {
  private readonly app = express();
  private readonly webhook = new TopGG.Webhook(`${process.env.TOPGG_WEBHOOK_AUTH***REMOVED***`);

  start(): void {
    this.app.post(
      "/vote",
      this.webhook.listener(async vote => {
        const user = this.client.users.cache.get(vote.user);

        await redis.set(
          `user:voted:${vote.user***REMOVED***`,
          JSON.stringify(true),
          "ex",
          SIX_HOURS_IN_SECONDS
    ***REMOVED***

        await logs.newVote(this.client, user || vote.user);
    ***REMOVED***)
***REMOVED***

    this.app.listen(process.env.SERVER_PORT || 8080);
***REMOVED***
***REMOVED***
