import {Interaction***REMOVED*** from "discord.js";
import fetch from "node-fetch";
import {redis***REMOVED*** from "../redis";
import * as logs from "../events/logging";
import {isDev***REMOVED*** from "../../constants";

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;
const TWELVE_HOURS_IN_MILLISECONDS = 43200000;

export class Topgg {
  public readonly clientId;

  constructor(clientId: string) {
    this.clientId = clientId;
***REMOVED***

  private static readonly headers = {
    Authorization: `${process.env.TOPGG_AUTH***REMOVED***`,
***REMOVED*** as const;

  public async hasVoted(interaction: Interaction, user: string): Promise<boolean> {
    const request = await fetch(
      `https://top.gg/api/bots/${
        !isDev ? this.clientId : "840585628408217610"
    ***REMOVED***/check?userId=${user***REMOVED***`,
      {
        headers: Topgg.headers,
    ***REMOVED***
***REMOVED***

    const body = await request.json();

    if (!body) {
      throw new Error("User not found.");
  ***REMOVED***

    if (body.voted === 1) {
      await logs.newVote(interaction.client, user);

      await redis.set(
        `user:voted:${user***REMOVED***`,
        (Date.now() + TWELVE_HOURS_IN_MILLISECONDS).toString(),
        "ex",
        TWELVE_HOURS_IN_SECONDS
  ***REMOVED***
      return true;
  ***REMOVED*** else {
      return false;
  ***REMOVED***
***REMOVED***

  public async getVotes(): Promise<{monthlyPoints: number; points: number***REMOVED***> {
    const request = await fetch(
      `https://top.gg/api/bots/${!isDev ? this.clientId : "840585628408217610"***REMOVED***`,
      {
        headers: Topgg.headers,
    ***REMOVED***
***REMOVED***

    const body = await request.json();
    const monthlyPoints = body.monthlyPoints;
    const points = body.points;

    return {monthlyPoints, points***REMOVED***;
***REMOVED***
***REMOVED***
