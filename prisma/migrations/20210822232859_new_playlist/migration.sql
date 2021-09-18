/*
  Warnings:

  - Added the required column `platform` to the `JoshChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistID` to the `JoshChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JoshChannel" ADD COLUMN     "platform" TEXT NOT NULL,
ADD COLUMN     "playlistID" TEXT NOT NULL;
