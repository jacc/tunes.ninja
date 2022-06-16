/*
  Warnings:

  - You are about to drop the `AppleMusic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LastFm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spotify` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReplyStyle" AS ENUM ('MINIMAL', 'DESCRIPTIVE');

-- DropForeignKey
ALTER TABLE "AppleMusic" DROP CONSTRAINT "AppleMusic_userId_fkey";

-- DropForeignKey
ALTER TABLE "LastFm" DROP CONSTRAINT "LastFm_userId_fkey";

-- DropForeignKey
ALTER TABLE "Spotify" DROP CONSTRAINT "Spotify_userId_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "replyStyle" "ReplyStyle" NOT NULL DEFAULT E'MINIMAL';

-- DropTable
DROP TABLE "AppleMusic";

-- DropTable
DROP TABLE "LastFm";

-- DropTable
DROP TABLE "Spotify";
