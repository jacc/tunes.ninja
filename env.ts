import { envsafe, str } from "envsafe";

export const env = envsafe({
  SONG_LINK_API_KEY: str({}),
});
