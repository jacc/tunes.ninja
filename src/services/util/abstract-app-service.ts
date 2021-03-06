import {Client} from "discord.js";

export abstract class AbstractAppService<T = [never]> {
  protected readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  abstract start(): T extends [never] ? void : T;
}
