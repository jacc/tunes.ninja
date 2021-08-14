export class UnknownSong extends Error {
  constructor() {
    super("This song was not found.");
  }
}

export class UnknownLastFM extends Error {
  constructor() {
    super("Couldn't find any activity for this Last.fm user.");
  }
}

export class BotRatelimited extends Error {
  constructor() {
    super("The bot is currently ratelimited by song.link");
  }
}

export class NoProfile extends Error {
  constructor() {
    super("You don't have a profile! Do `/profile edit lastfm` to set your Last.fm username!");
  }
}
