import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";
import {GuildMember} from "discord.js";
import {StandardEmbed} from "../../structs/standard-embed";
import {UnknownSong} from "../../structs/exceptions";

export const analyze: ChatCommand = {
    name: "analyze",
    description: "Analyze a song based on Spotify status or query.",
    inhibitors: [],
    type: "CHAT_INPUT",

    options: [
        {
            name: "song",
            description: "Name of song.",
            type: "STRING",
            required: false,
            autocomplete: true
        },
    ],
    async run(interaction) {
        await interaction.deferReply({ephemeral: true});

        const member = interaction.member as GuildMember;

        const options = new InteractionOptions(
            interaction.options.data as unknown as InteractionOptions[]
        );

        const activity = member.presence?.activities.find(
            (activity: { name: string }) => activity.name === "Spotify"
        );

        if (!activity && !options.has("song"))
            throw new Error("No Spotify presence found or arguments passed.");

        const title = options.has("song") ? options.get("song") : activity?.details;
        const artist = activity?.state;

        let song;
        let search: { uri: string; artist?: string; title?: string; thumbnail?: string; };
        if (title.includes("spotify:track")) {
            song = await SpotifyAPI.analyzeAudio(`${title.split(":")[2]}`)
        } else {
            search = await SpotifyAPI.searchSongMetaData(`${title} ${artist}`);
            if (!search) throw new UnknownSong()
            song = await SpotifyAPI.analyzeAudio(search.uri.split(":")[2])
        }

        const embed = new StandardEmbed(interaction.member as GuildMember).setAuthor(
            `${search!.title} by ${search!.artist}`,
            search!.thumbnail ? search!.thumbnail : ""
        );


        for (const [key, value] of Object.entries(song).slice(0, 11)) {
            embed.addField(toTitleCase(key), value.toString(), true)
        }

        await interaction.editReply({embeds: [embed]})
    }
}


function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
