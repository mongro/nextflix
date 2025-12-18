import { ProfileMovieRating } from "@/lib/prisma";
import { verifyProfileAccess } from "../utils";
import { db } from "@/lib/db";

export async function getRating(
  profileId: ProfileMovieRating["profileId"],
  externalMovieId: ProfileMovieRating["movieId"]
) {
  const start = Date.now();
  //await verifyProfileAccess(profileId);
  const first = Date.now() - start;

  const rating = db.getRating(profileId, externalMovieId);
  const second = Date.now() - first;
  console.log("second", second, "first", first);

  return rating;
}

export async function getRatings(
  profileId: ProfileMovieRating["profileId"],
  take: number = 20,
  cursor?: string
) {
  console.log("cursor", cursor);
  await verifyProfileAccess(profileId);
  const ratings = await db.getRatings(profileId, take, cursor);

  console.log("ratings", ratings);

  return ratings;
}
