import { ProfileMovieRating } from "@/lib/prisma";
import { verifyProfileAccess } from "../utils";
import { db } from "@/lib/db";

export async function getRating(
  profileId: ProfileMovieRating["profileId"],
  externalMovieId: ProfileMovieRating["movieId"]
) {
  await verifyProfileAccess(profileId);

  const rating = db.getRating(profileId, externalMovieId);

  return rating;
}

export async function getRatings(
  profileId: ProfileMovieRating["profileId"],
  take: number = 20,
  cursor?: string
) {
  await verifyProfileAccess(profileId);

  const ratings = await db.getRatings(profileId, take, cursor);

  return ratings;
}
