export interface JoshLink {
  linked: boolean;
  playlist: Playlist;
  playlistUrl: string;
}

export interface Playlist {
  isPlaylistPremium: boolean;
  playlistLinkedToDiscordID: string;
  playlistLinkedToDiscordChannel: string;
  playlistLinkedToDiscordServer: string;
  playlistPlatform: string;
  playlistLastSynced: Date;
  internalID: string;
  playlistLinkedCredentials: string;
  playlistLinkedPlatformUniqueID: string;
  id: string;
}
