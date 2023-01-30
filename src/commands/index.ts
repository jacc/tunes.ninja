import { ChatCommand, MessageCommand, UserCommand } from "../types/command";

import { ping } from "./util/ping";
export const chatCommands: ChatCommand[] = [
  ping,
];

export const messageCommands: MessageCommand[] = [];

export const userCommands: UserCommand[] = [];

export const chatCommandsMap = new Map<string, ChatCommand>(
  Object.entries(
    chatCommands.reduce((all, command) => {
      return { ...all, [command.name]: command };
    }, {} as Record<string, ChatCommand>)
  )
);

export const messageCommandsMap = new Map<string, MessageCommand>(
  Object.entries(
    messageCommands.reduce((all, command) => {
      return { ...all, [command.name]: command };
    }, {} as Record<string, MessageCommand>)
  )
);

export const userCommandsMap = new Map<string, UserCommand>(
  Object.entries(
    userCommands.reduce((all, command) => {
      return { ...all, [command.name]: command };
    }, {} as Record<string, UserCommand>)
  )
);
