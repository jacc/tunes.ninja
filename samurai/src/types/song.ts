export interface Song {
  title?: string | null;

  artist?: string | null;

  thumbnail?: string | null;

  links?: {
    apple_music?: string;
    soundcloud?: string;
    spotify?: string;
    tidal?: string;
    youtube?: string;
    youtube_music?: string;
  };
}
