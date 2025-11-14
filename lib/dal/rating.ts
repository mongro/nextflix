"use server";
import { ProfileMovieRating } from "../prisma";
import { db } from "../db/index";
import { verifyProfileAccess } from "./utils";

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
