import {GuildMember, MessageEmbed, MessageEmbedOptions, User***REMOVED*** from "discord.js";

export class StandardEmbed extends MessageEmbed {
  constructor(user: User | GuildMember, data?: StandardEmbed | MessageEmbedOptions) {
    super(data);

    this.setColor("#2f3136");
***REMOVED***
***REMOVED***
