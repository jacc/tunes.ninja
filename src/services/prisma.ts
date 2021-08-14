import {PrismaClient***REMOVED*** from "@prisma/client";
import {User***REMOVED*** from "discord.js";

export const prisma = new PrismaClient();

export async function incrementSearches(author: User): Promise<void> {
  const stats = await prisma.stats.findFirst({***REMOVED***
  if (!stats) {
    await prisma.stats.create({
      data: {
        searches: 0,
***REMOVED***
    ***REMOVED***

    await prisma.stats.updateMany({
      data: {
        searches: {
          increment: 1,
  ***REMOVED***
***REMOVED***
    ***REMOVED***
***REMOVED*** else {
    await prisma.stats.updateMany({
      data: {
        searches: {
          increment: 1,
  ***REMOVED***
***REMOVED***
    ***REMOVED***

    let userSettings = await prisma.user.findFirst({
      where: {id: author.id***REMOVED***,
    ***REMOVED***
    if (!userSettings) {
      const id = author.id as string;
      await prisma.user.create({
        data: {id***REMOVED***,
      ***REMOVED***
  ***REMOVED***

    userSettings = await prisma.user.findFirst({
      where: {id: author.id***REMOVED***,
    ***REMOVED***

    await prisma.user.updateMany({
      where: {
        id: author.id,
***REMOVED***
      data: {
        searches: {
          increment: 1,
  ***REMOVED***
***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***
