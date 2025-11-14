"use server";

import { ProfileMovieRating } from "@/lib/prisma";
import { verifyProfileAccess } from "../utils";
import { db } from "@/lib/db";

export async function removeRating(
  profileId: ProfileMovieRating["profileId"],
  movieId: ProfileMovieRating["movieId"]
) {
  try {
    await verifyProfileAccess(profileId);
    const result = await db.removeRating(profileId, movieId);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

export async function giveRating(
  profileId: ProfileMovieRating["profileId"],
  movieId: ProfileMovieRating["movieId"],
  rating: ProfileMovieRating["rating"]
) {
  try {
    await verifyProfileAccess(profileId);

    const result = await db.giveRating(profileId, movieId, rating);

    return result;
  } catch (error) {
    console.log("error", error);
  }
}
