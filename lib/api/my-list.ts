import {
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileMovie } from "../prisma";
import { ApiResponseIsInMyList } from "@/app/api/account/profile/[profileId]/mylist/[movieId]/route";
import { ApiResponseListOfProfile } from "@/app/api/account/profile/[profileId]/mylist/route";
import { api } from "./client";
import { addToMyList, removeFromMyList } from "../dal/my-list/actions";

export const MY_LIST_QUERYKEY = "mylist";

const isInMyList = async (
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) => {
  return await api<ApiResponseIsInMyList>({
    path: `/api/account/profile/${profileId}/mylist/${movieId}`,
  });
};
export const getMyList = async (profileId: ProfileMovie["profileId"]) => {
  return await api<ApiResponseListOfProfile>({
    path: `/api/account/profile/${profileId}/mylist`,
  });
};

export const isInMyListQueryOptions = (
  profileId: ProfileMovie["profileId"] | undefined | null,
  movieId: ProfileMovie["movieId"]
) => {
  return queryOptions({
    queryKey: [MY_LIST_QUERYKEY, profileId, movieId],
    queryFn: profileId ? () => isInMyList(profileId, movieId) : skipToken,
  });
};
export const getMyListQueryOptions = (
  profileId: ProfileMovie["profileId"] | undefined | null
) => {
  return queryOptions({
    queryKey: [MY_LIST_QUERYKEY, profileId],
    queryFn: profileId ? () => getMyList(profileId) : skipToken,
  });
};

export function useMyList(...arg: Parameters<typeof getMyListQueryOptions>) {
  return useQuery(getMyListQueryOptions(...arg));
}

export function useIsInMyList(
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) {
  const queryClient = useQueryClient();
  return useQuery({
    ...isInMyListQueryOptions(profileId, movieId),
    initialData: () => {
      const myList = queryClient.getQueryData(
        getMyListQueryOptions(profileId).queryKey
      );
      return myList?.some((item) => item.movieId === movieId);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(getMyListQueryOptions(profileId).queryKey)
        ?.dataUpdatedAt,
  });
}

export const useToggleMyList = (
  isInMyList: boolean,
  onSuccess?: (isInMyList: boolean) => void
) => {
  return useMutation({
    mutationFn: ({
      profileId,
      movieId,
    }: Pick<ProfileMovie, "profileId" | "movieId">) => {
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
