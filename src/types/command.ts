import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  ContextMenuInteraction,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from "discord.js";

import type {ApplicationCommandTypes} from "discord.js/typings/enums";

export interface ChatCommand extends ChatInputApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.CHAT_INPUT | "CHAT_INPUT";
  run(interaction: CommandInteraction): Promise<void>;
}

export interface MessageCommand extends MessageApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.MESSAGE | "MESSAGE";
  run(interaction: ContextMenuInteraction): Promise<void>;
}

export interface UserCommand extends UserApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.USER | "USER";
  run(interaction: ContextMenuInteraction): Promise<void>;
}

export type Inhibitor = (interaction: CommandInteraction) => Promise<void> | void;
