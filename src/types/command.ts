import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  ContextMenuInteraction,
  MessageApplicationCommandData,
  UserApplicationCommandData,
***REMOVED*** from "discord.js";

import type {ApplicationCommandTypes***REMOVED*** from "discord.js/typings/enums";

export interface ChatCommand extends ChatInputApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.CHAT_INPUT | "CHAT_INPUT";
  run(interaction: CommandInteraction): Promise<void>;
***REMOVED***

export interface MessageCommand extends MessageApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.MESSAGE | "MESSAGE";
  run(interaction: ContextMenuInteraction): Promise<void>;
***REMOVED***

export interface UserCommand extends UserApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandTypes.USER | "USER";
  run(interaction: ContextMenuInteraction): Promise<void>;
***REMOVED***

export type Inhibitor = (interaction: CommandInteraction) => Promise<void> | void;
