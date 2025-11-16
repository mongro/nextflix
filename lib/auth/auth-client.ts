import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;

export const sessionQueryKey = ["session"];
export const getSessionQueryOptions = () => {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: () => {
      return authClient.getSession();
    },
  });
};

export const useSignOut = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log("successfully loggedOut");
      context.client.refetchQueries({ queryKey: ["session"] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });
export const useSession = () => useQuery(getSessionQueryOptions());
