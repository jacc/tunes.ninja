import {CommandInteraction, Message, User***REMOVED*** from "discord.js";
import fetch from "node-fetch";
import {JoshLink***REMOVED*** from "../../types/josh";
import {prisma***REMOVED*** from "../prisma";

export class JoshAPI {
  public static async link(server: string, channel: string, user: string): Promise<string> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/login/user/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: channel.toString(),
        discordServerID: server.toString(),
        discordUserID: user.toString(),
    ***REMOVED***),
    ***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      if (!body.detail) throw new Error(body.reason);
      if (body.detail) throw new Error(body.detail.reason);
  ***REMOVED***
    return body.url;
***REMOVED***

  // TODO: fix unlink
  public static async unlink(user: string): Promise<boolean> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/unlink/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        discordUserID: user.toString(),
    ***REMOVED***),
    ***REMOVED***

    const body = await response.json();

    if (response.status !== 200) {
      if (!body.detail) throw new Error(body.reason);
      if (body.detail) throw new Error(body.detail.reason);
  ***REMOVED***
    return true;
***REMOVED***

  public static async play(user: string, song: string): Promise<string> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/spotify/user/${user***REMOVED***/action/play/song`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        spotifyTrackID: song.toString(),
    ***REMOVED***),
    ***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
  ***REMOVED***
    return body;
***REMOVED***

  public static async playlist(server: string, channel: string, user: string): Promise<JoshLink> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/link/playlist/creation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: channel.toString(),
        discordServerID: server.toString(),
        discordUserID: user.toString(),
    ***REMOVED***),
    ***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
  ***REMOVED***
    return body;
***REMOVED***

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public static async delete(channel: string): Promise<any> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/unlink/playlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: channel.toString(),
    ***REMOVED***),
    ***REMOVED***

    await prisma.joshChannel.delete({
      where: {
        id: channel.toString(),
***REMOVED***
    ***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
  ***REMOVED***
    return body;
***REMOVED***

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public static async add(message: Message | CommandInteraction, url: string): Promise<any> {
    let author;
    if (message instanceof Message) {
      author = message.author;
  ***REMOVED***
    if (message instanceof CommandInteraction) {
      if (!message.deferred) {
        await message.deferReply();
    ***REMOVED***
      author = message.member;
  ***REMOVED***

    await fetch(`${process.env.JOSH_BASE***REMOVED***/add/new/song/premium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: message.channel!.id.toString(),
        discordServerID: message.guild!.id.toString(),
        discordUserID: (author as User).id.toString(),
        url,
    ***REMOVED***),
    ***REMOVED***

    if (message instanceof Message) {
      await message.react("🎶");
  ***REMOVED***
***REMOVED***

  public static async getPlaylists(user: string): Promise<any> {
    const response = await fetch(`${process.env.JOSH_BASE***REMOVED***/playlists/${user***REMOVED***?fresh=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
***REMOVED***
    ***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
  ***REMOVED***
    return body;
***REMOVED***

  public static async addPersonalPlaylist(
    user: string,
    playlist: string,
    song: string
  ): Promise<any> {
    const response = await fetch(
      `${process.env.JOSH_BASE***REMOVED***/user/${user***REMOVED***/playlist/${playlist***REMOVED***/add?song_id=${song***REMOVED***`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${process.env.JOSH_AUTH***REMOVED***`,
  ***REMOVED***
    ***REMOVED***
***REMOVED***

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
  ***REMOVED***
    return body;
***REMOVED***
***REMOVED***
