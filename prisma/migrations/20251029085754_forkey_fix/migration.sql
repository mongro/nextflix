-- DropForeignKey
ALTER TABLE "public"."ProfileMovie" DROP CONSTRAINT "ProfileMovie_movieId_fkey";

-- AddForeignKey
ALTER TABLE "ProfileMovie" ADD CONSTRAINT "ProfileMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "ExternalMovie"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
