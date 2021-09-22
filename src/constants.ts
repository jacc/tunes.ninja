import { Permer } from "permer";

/**
 * Whether or not the app is running in development mode
 */
export const isDev = process.env.NODE_ENV === "development";

export enum Colors {
  RED = "#C34E4E",
  YELLOW = "#ffff00",
  GREEN = "#63db5a",
  BLUE = "#3b88c3",
}

export const contributors = [
  "268798547439255572",
  "705665813994012695",
  "291050399509774340",
  "215143736114544640",
  "90339695967350784",
  "140214425276776449",
  "586206645592391711"
];

export const friends = [
  "326237293612367873",
  "268798547439255572",
  "318549834514694156",
  "205039221050703872",
];

export const permer = new Permer([
  "replySpotify",
  "replyAM",
  "replySoundcloud",
]);
