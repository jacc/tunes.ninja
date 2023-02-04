-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "reply_to" INTEGER NOT NULL DEFAULT 7,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "searches" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("searches")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "lastfm" TEXT NOT NULL DEFAULT '',
    "searches" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT 'A mysterious user.',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedChannel" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "playlistID" TEXT NOT NULL,

    CONSTRAINT "LinkedChannel_pkey" PRIMARY KEY ("playlistID")
);
