import { ApiResponseProfile } from "@/app/api/account/profile/[profileId]/route";
import { ProfileMovieRating } from "../prisma";
import {
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./client";
import { deleteProfile } from "../dal/profile";
import { getMyList } from "./my-list";

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

export const useProfileWithPreload = (
  profileId: ProfileMovieRating["profileId"] | undefined | null
) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: profileId
      ? () => {
          queryClient.prefetchQuery({
            queryKey: ["mylist", profileId],
            queryFn: () => getMyList(profileId),
          });
          return getProfile(profileId);
        }
      : skipToken,
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
