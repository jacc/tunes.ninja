-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "replyToSpotify" BOOLEAN NOT NULL DEFAULT true,
    "replyToAppleMusic" BOOLEAN NOT NULL DEFAULT true,
    "replyToSoundcloud" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);
