import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export type Session = typeof authClient.$Infer.Session;

export const sessionQueryKey = ["session"];
export const getSessionQueryOptions = () => {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: async () => {
      console.log("getSession");
      const session = await authClient.getSession();
      return session;
    },
  });
};

export const useSignOut = () =>
  useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log("successfully loggedOut");
      context.client.refetchQueries({ queryKey: ["session"] });
    },
  });
export const useSession = () => useQuery(getSessionQueryOptions());
