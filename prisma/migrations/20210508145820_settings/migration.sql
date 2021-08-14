/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "replySpotify" BOOLEAN NOT NULL,
    "replyAM" BOOLEAN NOT NULL,
    "replyYoutube" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);
