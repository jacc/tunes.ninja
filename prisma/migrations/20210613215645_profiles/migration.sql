-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'A mysterious user.',
ALTER COLUMN "lastfm" SET DEFAULT E'',
ALTER COLUMN "searches" SET DEFAULT 0;
