import {ChatCommand, MessageCommand, UserCommand***REMOVED*** from "../types/command";

import {ping***REMOVED*** from "./util/ping";
import {config***REMOVED*** from "./settings/config";
import {stats***REMOVED*** from "./util/stats";
import {invite***REMOVED*** from "./util/invite";
import {spotify***REMOVED*** from "./util/spotify";
import {song***REMOVED*** from "./util/song";
import {vote***REMOVED*** from "./util/vote";
import {fm***REMOVED*** from "./util/fm";
import {profile***REMOVED*** from "./settings/profile";
import {playlist***REMOVED*** from "./settings/playlist";
import {getSong***REMOVED*** from "./context/get-song";
import {playlists***REMOVED*** from "./context/spotify-add";
import {api***REMOVED*** from "./settings/api";
import {playOnSpotify***REMOVED*** from "./context/play";

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
];

export const messageCommands: MessageCommand[] = [playlists, playOnSpotify];

export const userCommands: UserCommand[] = [getSong];

export const chatCommandsMap = new Map<string, ChatCommand>(
  Object.entries(
    chatCommands.reduce((all, command) => {
      return {...all, [command.name]: command***REMOVED***;
  ***REMOVED***, {***REMOVED*** as Record<string, ChatCommand>)
  )
);

export const messageCommandsMap = new Map<string, MessageCommand>(
  Object.entries(
    messageCommands.reduce((all, command) => {
      return {...all, [command.name]: command***REMOVED***;
  ***REMOVED***, {***REMOVED*** as Record<string, MessageCommand>)
  )
);

export const userCommandsMap = new Map<string, UserCommand>(
  Object.entries(
    userCommands.reduce((all, command) => {
      return {...all, [command.name]: command***REMOVED***;
  ***REMOVED***, {***REMOVED*** as Record<string, UserCommand>)
  )
);
