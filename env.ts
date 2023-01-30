import { envsafe, str } from "envsafe";
import "dotenv/config";

export const env = envsafe({
  DISCORD_TOKEN: str({}),
  SONG_LINK_API_KEY: str({}),
});
