/*
  Warnings:

  - Made the column `title` on table `ExternalMovie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `ProfileMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProfileMovieRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalMovie" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProfileMovie" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProfileMovieRating" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
