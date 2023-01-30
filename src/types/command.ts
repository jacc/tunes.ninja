import {
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  CommandInteraction,
  Interaction,
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
  UserApplicationCommandData,
  UserContextMenuCommandInteraction
} from "discord.js";


export interface ChatCommand extends ChatInputApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandType.ChatInput;
  run(interaction: CommandInteraction): Promise<void>;
}

export interface MessageCommand extends MessageApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandType.Message;
  run(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

export interface UserCommand extends UserApplicationCommandData {
  inhibitors: Inhibitor[] | Inhibitor;
  type: ApplicationCommandType.User;
  run(interaction: UserContextMenuCommandInteraction): Promise<void>;
}

export type Inhibitor = (interaction: Interaction) => Promise<void> | void;
