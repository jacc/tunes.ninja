-- CreateEnum
CREATE TYPE "Services" AS ENUM ('SPOTIFY', 'APPLEMUSIC', 'SOUNDCLOUD', 'TIDAL', 'YOUTUBE', 'YOUTUBE_MUSIC');

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "returnServices" "Services"[];
