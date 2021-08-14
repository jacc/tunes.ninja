/*
  Warnings:

  - You are about to drop the column `enabled` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "enabled",
ALTER COLUMN "reply_to" SET DEFAULT 0;
