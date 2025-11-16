import { ApiResponseRating } from "@/app/api/account/profile/[profileId]/rating/[movieId]/route";
import { ProfileMovieRating } from "../prisma";
import { api } from "./client";
import { ApiResponseRated } from "@/app/api/account/profile/[profileId]/rated/route";
import {
  infiniteQueryOptions,
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { giveRating, removeRating } from "../dal/ratings/actions";

export const ratingQueryKey = "rating";

const getRating = async (
  profileId: ProfileMovieRating["profileId"],
  movieId: ProfileMovieRating["movieId"]
) => {
  return await api<ApiResponseRating>({
    path: `/api/account/profile/${profileId}/rating/${movieId}`,
  });
};

const getRatings = async (
  profileId: ProfileMovieRating["profileId"],
  cursor?: ProfileMovieRating["movieId"],
  take?: number
) => {
  return await api<ApiResponseRated>({
    path: `/api/account/profile/${profileId}/rated`,
    queryParams: { cursor, take },
  });
};

export const getRatingQueryOptions = (
  profileId: ProfileMovieRating["profileId"] | undefined | null,
  movieId: ProfileMovieRating["movieId"]
) => {
  return queryOptions({
    queryKey: [ratingQueryKey, profileId, movieId],
    queryFn: profileId ? () => getRating(profileId, movieId) : skipToken,
  });
};

export const getInfiniteRatingsQueryOptions = (
  profileId: ProfileMovieRating["profileId"],
  take: number
) => {
  return infiniteQueryOptions({
    queryKey: ["ratings", profileId],
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      console.log("pageParam in queryFn:", pageParam);
      return getRatings(profileId, pageParam, take);
    },
    getNextPageParam: (lastPage) => {
      console.log("lastPage in getNextPageParam:", lastPage);
      return lastPage && lastPage?.length > take - 1
        ? lastPage?.[lastPage?.length - 1]?.movieId
        : undefined;
    },
    initialPageParam: undefined,
  });
};

export const useRating = (...arg: Parameters<typeof getRatingQueryOptions>) =>
  useQuery(getRatingQueryOptions(...arg));

export const useGiveRating = () => {
  return useMutation({
    mutationFn: ({
      profileId,
      movieId,
      rating,
    }: Pick<ProfileMovieRating, "profileId" | "movieId" | "rating">) =>
      giveRating(profileId, movieId, rating),
    onMutate: async ({ profileId, movieId, rating }, context) => {
      const queryKey = getRatingQueryOptions(profileId, movieId).queryKey;
      await context.client.cancelQueries({ queryKey });
      console.log("cancelQueryKey", queryKey);
      const previousRating = context.client.getQueryData(queryKey);
      context.client.setQueryData(
        queryKey,
        previousRating
          ? {
              ...previousRating,
              rating,
            }
          : {
              profileId,
              movieId,
              rating,
              ratedAt: new Date(Date.now()),
              updatedAt: new Date(Date.now()),
            }
      );
      return { previousRating };
    },
    onError: (err, { profileId, movieId }, previousRating, context) => {
      context.client.setQueryData(
        getRatingQueryOptions(profileId, movieId).queryKey,
        previousRating?.previousRating
      );
    },
    onSettled: (data, error, { profileId, movieId }, prev, context) => {
      const queryKey = getRatingQueryOptions(profileId, movieId).queryKey;
      context.client.invalidateQueries({ queryKey });
    },
  });
};

export const useGiveRatingInInfiniteContext = () => {
  return useMutation({
    mutationFn: ({
      profileId,
      movieId,
      rating,
    }: Pick<ProfileMovieRating, "profileId" | "movieId" | "rating">) =>
      giveRating(profileId, movieId, rating),
    onMutate: async ({ profileId, movieId, rating }, context) => {
      const queryKey = getInfiniteRatingsQueryOptions(profileId, 10).queryKey;
      await context.client.cancelQueries({ queryKey });
      const previousRating = context.client.getQueryData(queryKey);
      context.client.setQueryData(queryKey, (oldData) => {
        if (!oldData) return undefined;
        const newData = oldData.pages.map((page) => {
          return page.map((item) => {
            if (item.movieId === movieId && item.profileId == profileId) {
              const newItem = { ...item, rating };
              return newItem;
            } else return item;
          });
        });
        return { ...oldData, pages: newData };
      });
      return { previousRating };
    },
    onError: (err, { profileId, movieId }, previousRating, context) => {
      const queryKey = getInfiniteRatingsQueryOptions(profileId, 10).queryKey;

      context.client.setQueryData(queryKey, previousRating?.previousRating);
    },
  });
};
export const useRemoveRatingInInfiniteContext = () => {
  return useMutation({
    mutationFn: ({
      profileId,
      movieId,
    }: Pick<ProfileMovieRating, "profileId" | "movieId">) =>
      removeRating(profileId, movieId),
    onMutate: async ({ profileId, movieId }, context) => {
      const queryKey = getInfiniteRatingsQueryOptions(profileId, 10).queryKey;
      await context.client.cancelQueries({ queryKey });
      const previousRating = context.client.getQueryData(queryKey);
      context.client.setQueryData(queryKey, (oldData) => {
        if (!oldData) return undefined;
        const newData = oldData.pages.map((page) => {
          return page.filter(
            (item) => !(item.movieId === movieId && item.profileId == profileId)
          );
        });
        return { ...oldData, pages: newData };
      });
      return { previousRating };
    },
    onError: (err, { profileId, movieId }, previousRating, context) => {
      const queryKey = getInfiniteRatingsQueryOptions(profileId, 10).queryKey;

      context.client.setQueryData(queryKey, previousRating?.previousRating);
    },
  });
};

export const useRemoveRating = () => {
  return useMutation({
    mutationFn: ({
      profileId,
      movieId,
    }: Pick<ProfileMovieRating, "profileId" | "movieId">) =>
      removeRating(profileId, movieId),
    onMutate: async ({ profileId, movieId }, context) => {
      const queryKey = getRatingQueryOptions(profileId, movieId).queryKey;
      await context.client.cancelQueries({ queryKey });
      const previousRating = context.client.getQueryData(queryKey);
      context.client.setQueryData(queryKey, null);
      return { previousRating };
    },
    onError: (err, { profileId, movieId }, previousRating, context) => {
      context.client.setQueryData(
        getRatingQueryOptions(profileId, movieId).queryKey,
        previousRating?.previousRating
      );
    },
  });
};
