import { Message } from "discord.js";

/*

TODO: Make this actually work. It's not working right now.

*/

export async function importFmbot(m: Message) {
  // console.log(`Import request coming from ${m.guild!.id}`);
  const matches = m.embeds[0].description?.match(
    /\[(.+)\]\(([^ ]+)(?: "(.+)")?\)/gi
  );
  // console.log(matches);
  if (!matches) return;
  const membersWithLastFM = matches.map((url) =>
    url
      .replaceAll("[", "")
      .replaceAll("]", " - ")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("*", "")
  );

  // console.log(membersToAdd);
}
