/*
  Warnings:

  - You are about to drop the column `replySpotify` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `replyAM` on the `Guild` table. All the data in the column will be lost.
  - Added the required column `reply_to` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "replySpotify",
DROP COLUMN "replyAM",
ADD COLUMN     "reply_to" INTEGER NOT NULL;
