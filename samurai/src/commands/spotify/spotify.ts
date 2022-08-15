import {
  Activity,
  ActivityType,
  ApplicationCommandType,
  GuildMember,
  Presence,
} from "discord.js";
import { ChatCommand } from "../../types/command";
import { dispatchReply } from "../../services/dispatch";
import { returnGuildSettings } from "../../services/helpers/utility";

/*

Dear whoever reads this before I finish the actual code,
the /spotify command is currently broken as Discord has decided
to undocument the method that gave me the data for Spotify.

I now have to depend on Spotify's unfortunate API to get the
song data to return. If this command sucks in the future,
blame it all on Discord & the library maintainers at
Discord.js

Love,
Jack

 */

// export const spotify: ChatCommand = {
//     name: "spotify",
//     description: "Get current song information from your Discord status.",
//     type: ApplicationCommandType.ChatInput,
//     inhibitors: [],
//     async run(interaction) {
//         // const member = interaction.member as GuildMember;
//         // let guildSettings = await returnGuildSettings(interaction.guild!.id);
//         //
//         // if (!member.presence) throw new Error("No Spotify presence found! Are you sure you're listening to something?")
//         //
//         // console.log(member.presence.activities)
//         //
//         // let activity = member.presence.activities.filter((x: Activity) => x.name == 'Spotify' && x.type == ActivityType.Listening)[0]
//         //
//         // if (!activity) throw new Error("No Spotify presence found! Are you sure you're listening to something?")
//         //
//         // console.log(activity.syncId)
//         // // @ts-expect-error
//         await dispatchReply(interaction, `https://open.spotify.com/track/${activity.syncId}`, guildSettings)

//     },
// };
