import {Inhibitor***REMOVED*** from "../../types/command";
import {guilds***REMOVED*** from "../guilds";
import {GuildMember, Permissions***REMOVED*** from "discord.js";

export const manageServer: Inhibitor = interaction => {
  guilds(interaction);

  if (!interaction.member) {
    throw new Error("You must use this command in a server.");
***REMOVED***

  const member = interaction.member as GuildMember;

  const canManageServer = member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);

  if (!canManageServer) {
    throw new Error("You do not have permission to use this command.");
***REMOVED***
***REMOVED***;
