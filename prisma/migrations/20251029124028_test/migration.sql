/*
  Warnings:

  - The primary key for the `ProfileMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileMovieRating` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."ProfileMovie" DROP CONSTRAINT "ProfileMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileMovieRating" DROP CONSTRAINT "ProfileMovieRating_movieId_fkey";

-- AlterTable
ALTER TABLE "ExternalMovie" ALTER COLUMN "externalId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProfileMovie" DROP CONSTRAINT "ProfileMovie_pkey",
ALTER COLUMN "movieId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProfileMovie_pkey" PRIMARY KEY ("profileId", "movieId");

-- AlterTable
ALTER TABLE "ProfileMovieRating" DROP CONSTRAINT "ProfileMovieRating_pkey",
ALTER COLUMN "movieId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProfileMovieRating_pkey" PRIMARY KEY ("profileId", "movieId");

-- AddForeignKey
ALTER TABLE "ProfileMovie" ADD CONSTRAINT "ProfileMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "ExternalMovie"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMovieRating" ADD CONSTRAINT "ProfileMovieRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "ExternalMovie"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
