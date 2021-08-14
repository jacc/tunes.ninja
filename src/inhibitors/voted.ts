import {Topgg} from "../services/api/topgg";
import {Inhibitor} from "../types/command";

export const voted: Inhibitor = async interaction => {
  const hasVoted = await new Topgg(interaction.client.user!.id).hasVoted(
    interaction,
    interaction.user.id
  );

  if (!hasVoted) {
    throw new Error(
      `Before using this feature please upvote us on Top.gg - it really helps us out! [Click here to vote!](https://tunes.ninja/vote)`
    );
  }
};
