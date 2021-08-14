export class UnknownSong extends Error {
  constructor() {
    super("This song was not found.");
***REMOVED***
***REMOVED***

export class UnknownLastFM extends Error {
  constructor() {
    super("Couldn't find any activity for this Last.fm user.");
***REMOVED***
***REMOVED***

export class BotRatelimited extends Error {
  constructor() {
    super("The bot is currently ratelimited by song.link");
***REMOVED***
***REMOVED***

export class NoProfile extends Error {
  constructor() {
    super("You don't have a profile! Do `/profile edit lastfm` to set your Last.fm username!");
***REMOVED***
***REMOVED***
