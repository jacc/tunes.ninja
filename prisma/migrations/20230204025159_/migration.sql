/*
  Warnings:

  - You are about to drop the column `reply_to` on the `Guild` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "REPLY_STYLE" AS ENUM ('EMBED', 'MINIMAL');

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "reply_to",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "replyStyle" "REPLY_STYLE" NOT NULL DEFAULT 'EMBED',
ADD COLUMN     "replyToAppleMusic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "replyToSoundcloud" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replyToSpotify" BOOLEAN NOT NULL DEFAULT true;
