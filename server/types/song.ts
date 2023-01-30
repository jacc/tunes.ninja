interface LinksRequest {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  entitiesByUniqueId: String[];
  linksByPlatform: LinksByPlatform;
}

export interface LinksByPlatform {
  amazon_music: AmazonMusic;
  amazon_store: AmazonStore;
  deezer: Deezer;
  apple_music: AppleMusic;
  itunes: Itunes;
  napster: Napster;
  pandora: Pandora;
  soundcloud: Soundcloud;
  spotify: Spotify;
  tidal: Tidal;
  yandex: Yandex;
  youtube: Youtube;
  youtube_music: YoutubeMusic;
}

export interface AmazonMusic {
  url: string;
  entityUniqueId: string;
}

export interface AmazonStore {
  url: string;
  entityUniqueId: string;
}

export interface Deezer {
  url: string;
  entityUniqueId: string;
}

export interface AppleMusic {
  url: string;
  nativeAppUriMobile: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
}

export interface Itunes {
  url: string;
  nativeAppUriMobile: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
}

export interface Napster {
  url: string;
  entityUniqueId: string;
}

export interface Pandora {
  url: string;
  entityUniqueId: string;
}

export interface Soundcloud {
  url: string;
  entityUniqueId: string;
}

export interface Spotify {
  url: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
}

export interface Tidal {
  url: string;
  entityUniqueId: string;
}

export interface Yandex {
  url: string;
  entityUniqueId: string;
}

export interface Youtube {
  url: string;
  entityUniqueId: string;
}

export interface YoutubeMusic {
  url: string;
  entityUniqueId: string;
}
