-- CreateTable
CREATE TABLE "User" (
    "discord_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("discord_id")
);
