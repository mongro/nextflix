import prisma, { ProfileMovieRating } from "../prisma";
import { findOrCreateMovie } from "./movie";

export async function removeRating(
  profileId: ProfileMovieRating["profileId"],
  movieId: ProfileMovieRating["movieId"]
) {
  const result = await prisma.profileMovieRating.delete({
    where: {
      profileMovieRatingId: {
        profileId,
        movieId: movieId,
      },
    },
  });

  return result;
}
export async function giveRating(
  profileId: ProfileMovieRating["profileId"],
  movieId: ProfileMovieRating["movieId"],
  rating: ProfileMovieRating["rating"]
) {
  const movie = await findOrCreateMovie(movieId);

  const result = await prisma.profileMovieRating.upsert({
    where: {
      profileMovieRatingId: {
        profileId,
        movieId: movie.externalId,
      },
    },
    update: {
      rating,
    },
    create: {
      movieId: movie.externalId,
      profileId,
      rating,
    },
  });

  return result;
}

export async function getRating(
  profileId: ProfileMovieRating["profileId"],
  externalMovieId: ProfileMovieRating["movieId"]
) {
  const rating = await prisma.profileMovieRating.findUnique({
    where: {
      profileMovieRatingId: {
        profileId,
        movieId: externalMovieId,
      },
    },
  });

  return rating;
}

export async function getRatings(
  profileId: ProfileMovieRating["profileId"],
  take: number = 20,
  cursor?: string
) {
  const ratings = await prisma.profileMovieRating.findMany({
    where: {
      profileId,
    },
    skip: 1,
    take,
    cursor: cursor
      ? { profileMovieRatingId: { movieId: cursor, profileId } }
      : undefined,
    orderBy: {
      ratedAt: "desc",
    },
    include: {
      movie: true,
    },
  });

  return ratings;
}
