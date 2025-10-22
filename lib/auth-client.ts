import { useQuery } from "@tanstack/react-query";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({});

export type Session = typeof authClient.$Infer.Session;

export const useSession = () =>
  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const session = await authClient.getSession();
      return session;
    },
  });
