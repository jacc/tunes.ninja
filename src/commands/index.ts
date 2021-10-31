import { ChatCommand, MessageCommand, UserCommand } from "../types/command";

import { ping } from "./util/ping";
import { config } from "./settings/config";
import { stats } from "./util/stats";
import { invite } from "./util/invite";
import { support } from "./util/support";
import { spotify } from "./util/spotify";
import { song } from "./util/song";
import { vote } from "./util/vote";
import { fm } from "./util/fm";
import { profile } from "./settings/profile";
import { playlist } from "./settings/playlist";
import { getSong } from "./context/get-song";
import { playlists } from "./context/add";
import { api } from "./settings/api";
import { playOnSpotify } from "./context/play";
import { source } from "./util/source";
import { queueOnSpotify } from "./context/queue";
import { lyrics } from "./util/lyrics";
import { album } from "./util/album";
import {analyze} from "./util/analyze";
import {artist} from "./util/artist";

export const chatCommands: ChatCommand[] = [
  ping,
  invite,
  vote,
  stats,
  spotify,
  profile,
  fm,
  song,
  config,
  playlist,
  api,
  source,
  support,
  lyrics,
  album,
    analyze,
    artist
];

export const messageCommands: MessageCommand[] = [
  playlists,
  playOnSpotify,
  queueOnSpotify,
];

export const userCommands: UserCommand[] = [getSong];

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
