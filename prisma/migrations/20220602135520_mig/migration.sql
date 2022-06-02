-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spotify" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "scopes" TEXT NOT NULL,

    CONSTRAINT "Spotify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppleMusic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personal_access_token" TEXT,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "AppleMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LastFm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "LastFm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spotify_userId_key" ON "Spotify"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AppleMusic_userId_key" ON "AppleMusic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LastFm_userId_key" ON "LastFm"("userId");

-- AddForeignKey
ALTER TABLE "Spotify" ADD CONSTRAINT "Spotify_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppleMusic" ADD CONSTRAINT "AppleMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastFm" ADD CONSTRAINT "LastFm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
