/*
  Warnings:

  - The primary key for the `JoshChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "JoshChannel" DROP CONSTRAINT "JoshChannel_pkey",
ADD PRIMARY KEY ("playlistID");
