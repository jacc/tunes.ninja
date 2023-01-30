import {Inhibitor} from "../types/command";

export const guilds: Inhibitor = interaction => {
    if (!interaction.guild) {
        throw new Error("You must use this command in a server.");
    }
};
