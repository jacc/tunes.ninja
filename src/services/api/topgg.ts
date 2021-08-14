import {Interaction} from "discord.js";
import fetch from "node-fetch";
import {redis} from "../redis";
import * as logs from "../events/logging";
import {isDev} from "../../constants";

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;
const TWELVE_HOURS_IN_MILLISECONDS = 43200000;

export class Topgg {
  public readonly clientId;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  private static readonly headers = {
    Authorization: `${process.env.TOPGG_AUTH}`,
  } as const;

  public async hasVoted(interaction: Interaction, user: string): Promise<boolean> {
    const request = await fetch(
      `https://top.gg/api/bots/${
        !isDev ? this.clientId : "840585628408217610"
      }/check?userId=${user}`,
      {
        headers: Topgg.headers,
      }
    );

    const body = await request.json();

    if (!body) {
      throw new Error("User not found.");
    }

    if (body.voted === 1) {
      await logs.newVote(interaction.client, user);

      await redis.set(
        `user:voted:${user}`,
        (Date.now() + TWELVE_HOURS_IN_MILLISECONDS).toString(),
        "ex",
        TWELVE_HOURS_IN_SECONDS
      );
      return true;
    } else {
      return false;
    }
  }

  public async getVotes(): Promise<{monthlyPoints: number; points: number}> {
    const request = await fetch(
      `https://top.gg/api/bots/${!isDev ? this.clientId : "840585628408217610"}`,
      {
        headers: Topgg.headers,
      }
    );

    const body = await request.json();
    const monthlyPoints = body.monthlyPoints;
    const points = body.points;

    return {monthlyPoints, points};
  }
}
