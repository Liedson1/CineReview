CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "year" TEXT,
    "plot" TEXT,
    "poster" TEXT,
    "backdrop" TEXT,
    "runtime" INTEGER,
    "genres" TEXT,
    "rating" REAL,
    "voteCount" INTEGER,
    "releaseDate" TEXT,
    "originalTitle" TEXT,
    "language" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

 
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE INDEX "Review_movieId_idx" ON "Review"("movieId");

CREATE INDEX "Review_userId_idx" ON "Review"("userId");

CREATE UNIQUE INDEX "Review_userId_movieId_key" ON "Review"("userId", "movieId");
