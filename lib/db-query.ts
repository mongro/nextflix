import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notFound } from "next/navigation";
import { ProfileMovie, ProfileMovieRating, Prisma } from "./prisma";
import { giveRating, removeRating } from "./dal/rating";
import { ApiResponseRated } from "@/app/api/account/profile/[profileId]/rated/route";
import { ApiSuccessResponse } from "./response";
import { ApiResponseRating } from "@/app/api/account/profile/[profileId]/rating/[movieId]/route";
import { ApiResponseIsInMyList } from "@/app/api/account/profile/[profileId]/mylist/[movieId]/route";
import { ApiResponseProfile } from "@/app/api/account/profile/[profileId]/route";
import { deleteProfile } from "./dal/profile";
import { addToMyList, removeFromMyList } from "./dal/my-list/actions";

interface ApiOptions {
  path?: string;
  queryParams?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrlWithParams(
  url: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();
  return `${url}?${queryString}`;
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

function reviveDate(key: string, value: string) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

export const api = async <T extends ApiSuccessResponse<unknown>>({
  path,
  queryParams,
}: ApiOptions) => {
  const fullUrl = buildUrlWithParams(`${path}`, queryParams);

  const response = await fetch(fullUrl);
  if (!response.ok) {
    if (response.status === 404) {
      throw notFound();
    }
    const message = `An error has occured: ${response.url}`;
    throw new Error(message);
  }
  const result = JSON.parse(await response.text(), reviveDate) as T;
  return result.data as T extends ApiSuccessResponse<infer S> ? S : never;
};

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
export const getProfile = async (
  profileId: ProfileMovieRating["profileId"]
) => {
  return await api<ApiResponseProfile>({
    path: `/api/account/profile/${profileId}`,
  });
};

export const getProfileQueryOptions = (
  profileId: ProfileMovieRating["profileId"] | undefined | null
) => {
  return queryOptions({
    queryKey: ["profile", profileId],
    queryFn: profileId ? () => getProfile(profileId) : skipToken,
  });
};

export const useProfile = (...arg: Parameters<typeof getProfileQueryOptions>) =>
  useQuery(getProfileQueryOptions(...arg));

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

type ProfileMovieRatingInput = {
  profileId: ProfileMovieRating["profileId"];
  movieId: ProfileMovieRating["movieId"];
  rating: ProfileMovieRating["rating"];
};
export const useGiveRating = () => {
  return useMutation({
    mutationFn: ({ profileId, movieId, rating }: ProfileMovieRatingInput) =>
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
    mutationFn: ({ profileId, movieId, rating }: ProfileMovieRatingInput) =>
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
    mutationFn: ({ profileId, movieId }: DeleteMovieRatingInput) =>
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

type DeleteMovieRatingInput = {
  profileId: ProfileMovieRating["profileId"];
  movieId: ProfileMovieRating["movieId"];
};

export const useRemoveRating = () => {
  return useMutation({
    mutationFn: ({ profileId, movieId }: DeleteMovieRatingInput) =>
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

const isInMyList = async (
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) => {
  return await api<ApiResponseIsInMyList>({
    path: `/api/account/profile/${profileId}/mylist/${movieId}`,
  });
};

export const isInMyListQueryOptions = (
  profileId: ProfileMovie["profileId"] | undefined | null,
  movieId: ProfileMovie["movieId"]
) => {
  return queryOptions({
    queryKey: ["mylist", profileId, movieId],
    queryFn: profileId ? () => isInMyList(profileId, movieId) : skipToken,
  });
};
export function useIsInMyList(
  ...arg: Parameters<typeof isInMyListQueryOptions>
) {
  return useQuery(isInMyListQueryOptions(...arg));
}

export const useToggleMyList = (
  isInMyList: boolean,
  onSuccess?: (isInMyList: boolean) => void
) => {
  return useMutation({
    mutationFn: ({ profileId, movieId }: DeleteMovieRatingInput) => {
      console.log("isInMyList in mutateFn:", isInMyList);
      return !isInMyList
        ? addToMyList(profileId, movieId)
        : removeFromMyList(profileId, movieId);
    },
    onMutate: async ({ profileId, movieId }, context) => {
      const queryKey = isInMyListQueryOptions(profileId, movieId).queryKey;

      await context.client.cancelQueries({ queryKey });
      const previousIsInMyList = context.client.getQueryData(queryKey);
      context.client.setQueryData(queryKey, !isInMyList);
      return { previousIsInMyList };
    },
    onSettled: (data, err, { profileId, movieId }, mutateResult, context) => {
      const queryKey = isInMyListQueryOptions(profileId, movieId).queryKey;
      if (!data?.success || err) {
        context.client.setQueryData(queryKey, mutateResult?.previousIsInMyList);
      } else if (onSuccess) {
        const isInMyList = context.client.getQueryData(queryKey);
        onSuccess(Boolean(isInMyList));
      }
    },
  });
};
export const useDeleteProfile = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: ({ profileId }: { profileId: number }) =>
      deleteProfile(profileId),
    onSuccess: () => {
      console.log("onSuccess");
      if (onSuccess) {
        onSuccess();
      }
    },
    onSettled: () => {
      console.log("onSettled");

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      console.log("onError");
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
