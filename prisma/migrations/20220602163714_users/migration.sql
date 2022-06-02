-- CreateEnum
CREATE TYPE "Flags" AS ENUM ('FRIEND', 'BANNED', 'DONATOR', 'CONTRIBUTOR', 'OWNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "flags" "Flags"[],
ADD COLUMN     "searches" INTEGER NOT NULL DEFAULT 0;
