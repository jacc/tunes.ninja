import fetch from "node-fetch";
import {UnknownSong***REMOVED*** from "../../structs/exceptions";
import {Song***REMOVED*** from "../../types/song";
import {wrapRedis***REMOVED*** from "../redis";

export class SongsApi {
  public static async getLinks(url: string): Promise<Song> {
    return await wrapRedis(
      `song:${url***REMOVED***`,
***REMOVED***
        const request = await fetch(
          `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)***REMOVED***&key=${
            process.env.SONG_LINK_API
        ***REMOVED***`
    ***REMOVED***
        const json = await request.json();
        if (request.status === 400 || request.status === 404) {
    ***REMOVED***
      ***REMOVED***
        return {
          title: json["entitiesByUniqueId"][json["entityUniqueId"]]?.title || null,
          artist: json["entitiesByUniqueId"][json["entityUniqueId"]]?.artistName || null,
          thumbnail: json["entitiesByUniqueId"][json["entityUniqueId"]]?.thumbnailUrl || null,
          links: {
            apple_music: json.linksByPlatform.appleMusic?.url || null,
            soundcloud: json.linksByPlatform.soundcloud?.url || null,
            spotify: json.linksByPlatform.spotify?.url || null,
            tidal: json.linksByPlatform.tidal?.url || null,
            youtube: json.linksByPlatform.youtube?.url || null,
            youtube_music: json.linksByPlatform.youtubeMusic?.url || null,
    ***REMOVED***
      ***REMOVED***;
***REMOVED***
      2592000
***REMOVED***
***REMOVED***
***REMOVED***

export interface Links {
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
***REMOVED***

export interface AmazonMusic {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface AmazonStore {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Deezer {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface AppleMusic {
  url: string;
  nativeAppUriMobile: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
***REMOVED***

export interface Itunes {
  url: string;
  nativeAppUriMobile: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
***REMOVED***

export interface Napster {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Pandora {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Soundcloud {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Spotify {
  url: string;
  nativeAppUriDesktop: string;
  entityUniqueId: string;
***REMOVED***

export interface Tidal {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Yandex {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface Youtube {
  url: string;
  entityUniqueId: string;
***REMOVED***

export interface YoutubeMusic {
  url: string;
  entityUniqueId: string;
***REMOVED***
