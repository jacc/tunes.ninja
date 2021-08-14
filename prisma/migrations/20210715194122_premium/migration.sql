/*
  Warnings:

  - Added the required column `premium` to the `JoshChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JoshChannel" ADD COLUMN     "premium" BOOLEAN NOT NULL;
